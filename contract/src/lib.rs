#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, token, Address, Env, Vec};

#[contracttype]
pub enum DataKey {
    Deadline,
    Participants,
    Token,
}

#[contract]
pub struct RaffleContract;

// Fixed price of 5 XLM (50,000,000 stroops)
const TICKET_PRICE: i128 = 50_000_000;

#[contractimpl]
impl RaffleContract {
    pub fn initialize(env: Env, token: Address, deadline: u64) {
        if env.storage().instance().has(&DataKey::Deadline) {
            panic!("Already initialized");
        }
        env.storage().instance().set(&DataKey::Token, &token);
        env.storage().instance().set(&DataKey::Deadline, &deadline);
        env.storage().instance().set(&DataKey::Participants, &Vec::<Address>::new(&env));
    }

    pub fn buy_ticket(env: Env, buyer: Address) {
        buyer.require_auth();
        
        let deadline: u64 = env.storage().instance().get(&DataKey::Deadline).unwrap();
        if env.ledger().timestamp() >= deadline {
            panic!("Raffle has ended");
        }

        let token: Address = env.storage().instance().get(&DataKey::Token).unwrap();
        let client = token::Client::new(&env, &token);
        
        // Transfer 5 XLM to the contract
        client.transfer(&buyer, &env.current_contract_address(), &TICKET_PRICE);

        let mut participants: Vec<Address> = env.storage().instance().get(&DataKey::Participants).unwrap();
        participants.push_back(buyer);
        env.storage().instance().set(&DataKey::Participants, &participants);
    }

    pub fn pick_winner(env: Env) {
        let deadline: u64 = env.storage().instance().get(&DataKey::Deadline).unwrap();
        if env.ledger().timestamp() < deadline {
            panic!("Raffle still ongoing");
        }

        let participants: Vec<Address> = env.storage().instance().get(&DataKey::Participants).unwrap();
        let num_participants = participants.len();
        if num_participants == 0 {
            panic!("No participants");
        }

        let winner_index = env.prng().gen_range(0..num_participants as u64) as u32;
        let winner = participants.get(winner_index).unwrap();

        let token: Address = env.storage().instance().get(&DataKey::Token).unwrap();
        let client = token::Client::new(&env, &token);
        let balance = client.balance(&env.current_contract_address());
        
        if balance > 0 {
            client.transfer(&env.current_contract_address(), &winner, &balance);
        }

        // Clear participants so it cannot be run again
        env.storage().instance().set(&DataKey::Participants, &Vec::<Address>::new(&env));
    }

    pub fn get_pool(env: Env) -> i128 {
        if let Some(token) = env.storage().instance().get::<_, Address>(&DataKey::Token) {
            let client = token::Client::new(&env, &token);
            client.balance(&env.current_contract_address())
        } else {
            0
        }
    }

    pub fn get_participants(env: Env) -> Vec<Address> {
        env.storage().instance().get(&DataKey::Participants).unwrap_or_else(|| Vec::new(&env))
    }
}

// Ensure the tests are run
mod test;
