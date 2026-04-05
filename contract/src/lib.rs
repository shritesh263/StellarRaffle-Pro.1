#![no_std]
use soroban_sdk::{
    contract, contractimpl, contracttype, symbol_short, token, Address, Env, Symbol, Vec,
};

// --- DATA TYPES & STORAGE KEYS ---

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum TicketTier {
    Bronze,  // 5 XLM, 1 entry
    Gold,    // 20 XLM, 5 entries
    Diamond, // 50 XLM, 15 entries
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct WinnerRecord {
    pub winner: Address,
    pub amount: i128,
    pub timestamp: u64,
}

#[contracttype]
pub enum DataKey {
    Deadline,       // u64
    Participants,   // Vec<Address>
    Token,          // Address (XLM)
    Owner,          // Address (Multisig or Admin)
    VaultBalance,   // i128 (5% Platform fees)
    History,        // Vec<WinnerRecord>
    Referral(Address), // Referrer mapping
}

const PLATFORM_FEE_BPS: i128 = 500; // 5.00% (Basis points)

// --- CONTRACT LOGIC ---

#[contract]
pub struct ProfessionalRaffle;

#[contractimpl]
impl ProfessionalRaffle {
    /// Initialize the professional lottery system.
    pub fn initialize(env: Env, owner: Address, token: Address, deadline: u64) {
        if env.storage().instance().has(&DataKey::Owner) {
            panic!("Already initialized");
        }
        env.storage().instance().set(&DataKey::Owner, &owner);
        env.storage().instance().set(&DataKey::Token, &token);
        env.storage().instance().set(&DataKey::Deadline, &deadline);
        env.storage().instance().set(&DataKey::VaultBalance, &0i128);
        env.storage().instance().set(&DataKey::Participants, &Vec::<Address>::new(&env));
        env.storage().instance().set(&DataKey::History, &Vec::<WinnerRecord>::new(&env));
    }

    /// Purchase a ticket with tiered entries and optional referral.
    pub fn buy_ticket(env: Env, buyer: Address, tier: TicketTier, referrer: Option<Address>) {
        buyer.require_auth();

        let deadline: u64 = env.storage().instance().get(&DataKey::Deadline).unwrap();
        if env.ledger().timestamp() >= deadline {
            panic!("Lottery draw is in progress or ended.");
        }

        let price = match tier {
            TicketTier::Bronze => 5_000_000,
            TicketTier::Gold => 20_000_000,
            TicketTier::Diamond => 50_000_000,
        };

        let entries_to_add = match tier {
            TicketTier::Bronze => 1,
            TicketTier::Gold => 5,
            TicketTier::Diamond => 15,
        };

        let token_addr: Address = env.storage().instance().get(&DataKey::Token).unwrap();
        let token_client = token::Client::new(&env, &token_addr);

        // Transfer full funds to contract first (Buyer must authorize this)
        token_client.transfer(&buyer, &env.current_contract_address(), &price);

        // Calculate fees & Referral (1% to referrer if exists)
        let mut platform_fee = (price * PLATFORM_FEE_BPS) / 10_000;
        let mut referral_reward = 0i128;

        if let Some(ref_addr) = referrer {
            if ref_addr != buyer {
                referral_reward = price / 100; // 1% Referral
                platform_fee -= referral_reward;
                // Payout reward from contract balance
                token_client.transfer(&env.current_contract_address(), &ref_addr, &referral_reward);
            }
        }

        // Update Vault with platform fee
        let current_vault: i128 = env.storage().instance().get(&DataKey::VaultBalance).unwrap();
        env.storage().instance().set(&DataKey::VaultBalance, &(current_vault + platform_fee));

        // Add entries to participants list
        let mut participants: Vec<Address> = env.storage().instance().get(&DataKey::Participants).unwrap();
        for _ in 0..entries_to_add {
            participants.push_back(buyer.clone());
        }
        env.storage().instance().set(&DataKey::Participants, &participants);
    }

    /// Publicly trigger the randomized draw after deadline.
    pub fn draw_winner(env: Env) {
        let deadline: u64 = env.storage().instance().get(&DataKey::Deadline).unwrap();
        if env.ledger().timestamp() < deadline {
            panic!("Deadline not yet reached.");
        }

        let participants: Vec<Address> = env.storage().instance().get(&DataKey::Participants).unwrap();
        let count = participants.len();
        if count == 0 {
            panic!("No valid tickets sold.");
        }

        // Random selection via Soroban PRNG
        let winner_idx = env.prng().gen_range::<u64>(0..count as u64) as u32;
        let winner = participants.get(winner_idx).unwrap();

        let token_addr: Address = env.storage().instance().get(&DataKey::Token).unwrap();
        let token_client = token::Client::new(&env, &token_addr);

        // Exclude the vault balance from the prize pool
        let total_bal = token_client.balance(&env.current_contract_address());
        let vault_bal: i128 = env.storage().instance().get(&DataKey::VaultBalance).unwrap();
        let prize_pool = total_bal - vault_bal;

        if prize_pool > 0 {
            token_client.transfer(&env.current_contract_address(), &winner, &prize_pool);
        }

        // Record history
        let mut history: Vec<WinnerRecord> = env.storage().instance().get(&DataKey::History).unwrap();
        history.push_back(WinnerRecord {
            winner: winner.clone(),
            amount: prize_pool,
            timestamp: env.ledger().timestamp(),
        });
        // Keep only last 10 winners
        if history.len() > 10 {
            history.remove(0);
        }
        env.storage().instance().set(&DataKey::History, &history);

        // Reset for next round
        env.storage().instance().set(&DataKey::Participants, &Vec::<Address>::new(&env));
        // Reset deadline (e.g., auto-restart in 1 hour)
        env.storage().instance().set(&DataKey::Deadline, &(env.ledger().timestamp() + 3600));
    }

    /// Owner-only: Withdraw accumulated platform fees (5%).
    pub fn withdraw_fees(env: Env, to: Address) {
        let owner: Address = env.storage().instance().get(&DataKey::Owner).unwrap();
        owner.require_auth();

        let vault_bal: i128 = env.storage().instance().get(&DataKey::VaultBalance).unwrap();
        if vault_bal == 0 {
            panic!("Vault is empty.");
        }

        let token_addr: Address = env.storage().instance().get(&DataKey::Token).unwrap();
        let token_client = token::Client::new(&env, &token_addr);

        token_client.transfer(&env.current_contract_address(), &to, &vault_bal);
        env.storage().instance().set(&DataKey::VaultBalance, &0i128);
    }

    // --- VIEW FUNCTIONS ---

    pub fn get_raffle_info(env: Env) -> (i128, u32, u64, i128) {
        let token_addr: Address = env.storage().instance().get(&DataKey::Token).unwrap();
        let token_client = token::Client::new(&env, &token_addr);
        let total_bal = token_client.balance(&env.current_contract_address());
        let vault_bal: i128 = env.storage().instance().get(&DataKey::VaultBalance).unwrap_or(0);
        
        let participants: Vec<Address> = env.storage().instance().get(&DataKey::Participants).unwrap_or(Vec::new(&env));
        let deadline: u64 = env.storage().instance().get(&DataKey::Deadline).unwrap_or(0);

        (total_bal - vault_bal, participants.len(), deadline, vault_bal)
    }

    pub fn get_winner_history(env: Env) -> Vec<WinnerRecord> {
        env.storage().instance().get(&DataKey::History).unwrap_or(Vec::new(&env))
    }
}
