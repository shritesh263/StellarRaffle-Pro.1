#![cfg(test)]

use super::*;
use soroban_sdk::{testutils::{Address as _, Ledger}, Address, Env};
use soroban_sdk::token::Client as TokenClient;
use soroban_sdk::token::StellarAssetClient as TokenAdminClient;

fn create_token_contract<'a>(env: &Env, admin: &Address) -> (TokenClient<'a>, TokenAdminClient<'a>) {
    let contract_address = env.register_stellar_asset_contract(admin.clone());
    (
        TokenClient::new(env, &contract_address),
        TokenAdminClient::new(env, &contract_address),
    )
}

#[test]
fn test_professional_workflow() {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register_contract(None, ProfessionalRaffle);
    let client = ProfessionalRaffleClient::new(&env, &contract_id);

    let owner = Address::generate(&env);
    let token_admin = Address::generate(&env);
    let (token, token_admin_client) = create_token_contract(&env, &token_admin);

    let buyer1 = Address::generate(&env);
    let buyer2 = Address::generate(&env);
    let referrer = Address::generate(&env);
    
    token_admin_client.mint(&buyer1, &100_000_000);
    token_admin_client.mint(&buyer2, &100_000_000);

    let start_time = 1_000_000;
    env.ledger().with_mut(|li| li.timestamp = start_time);
    let deadline = start_time + 3600;

    client.initialize(&owner, &token.address, &deadline);

    // 1. Diamond Buy (50 XLM) with Referral (1%)
    client.buy_ticket(&buyer1, &TicketTier::Diamond, &Some(referrer.clone()));

    // Verify Referral Reward
    assert_eq!(token.balance(&referrer), 500_000); // 1% of 50 XLM = 0.5 XLM
    
    // Verify Vault (5% - 1% to referrer = 4% current vault)
    // Actually our logic says platform_fee = 5%; then subtract referral.
    // So 5% of 50 = 2.5; 1% of 50 = 0.5. Vault gets 2.0.
    let (_, participants, _, vault) = client.get_raffle_info();
    assert_eq!(participants, 15); // Diamond = 15 entries
    assert_eq!(vault, 2_000_000); 

    // 2. Gold Buy (20 XLM) no Referral
    client.buy_ticket(&buyer2, &TicketTier::Gold, &None);
    
    let (pool_net, participants_total, _, vault_total) = client.get_raffle_info();
    assert_eq!(participants_total, 20); // 15 + 5
    // Gold fee 5% of 20 = 1.0. Total vault = 2.0 + 1.0 = 3.0.
    assert_eq!(vault_total, 3_000_000);
    
    // 3. Draw Winner
    env.ledger().with_mut(|li| li.timestamp = deadline + 1);
    client.draw_winner();

    let history = client.get_winner_history();
    assert_eq!(history.len(), 1);
    
    // 4. Withdraw fees by Owner
    client.withdraw_fees(&owner);
    assert_eq!(token.balance(&owner), 3_000_000);
}

#[test]
fn test_bronze_tier_no_referral() {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register_contract(None, ProfessionalRaffle);
    let client = ProfessionalRaffleClient::new(&env, &contract_id);

    let owner = Address::generate(&env);
    let token_admin = Address::generate(&env);
    let (token, token_admin_client) = create_token_contract(&env, &token_admin);

    let buyer = Address::generate(&env);
    token_admin_client.mint(&buyer, &50_000_000);

    let start_time = 2_000_000u64;
    env.ledger().with_mut(|li| li.timestamp = start_time);
    let deadline = start_time + 3600;

    client.initialize(&owner, &token.address, &deadline);

    // Bronze: 5 XLM, 1 entry, no referrer
    client.buy_ticket(&buyer, &TicketTier::Bronze, &None);

    let (_, participants, _, vault) = client.get_raffle_info();
    assert_eq!(participants, 1);  // 1 entry for Bronze
    assert_eq!(vault, 250_000);   // 5% of 5 XLM = 0.25 XLM = 250_000 stroops
}

#[test]
#[should_panic(expected = "Lottery draw is in progress or ended.")]
fn test_buy_after_deadline_panics() {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register_contract(None, ProfessionalRaffle);
    let client = ProfessionalRaffleClient::new(&env, &contract_id);

    let owner = Address::generate(&env);
    let token_admin = Address::generate(&env);
    let (token, token_admin_client) = create_token_contract(&env, &token_admin);

    let buyer = Address::generate(&env);
    token_admin_client.mint(&buyer, &50_000_000);

    let start_time = 3_000_000u64;
    let deadline = start_time + 3600;
    env.ledger().with_mut(|li| li.timestamp = deadline + 100); // Past deadline

    client.initialize(&owner, &token.address, &deadline);
    client.buy_ticket(&buyer, &TicketTier::Bronze, &None); // Should panic
}

#[test]
fn test_self_referral_blocked() {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register_contract(None, ProfessionalRaffle);
    let client = ProfessionalRaffleClient::new(&env, &contract_id);

    let owner = Address::generate(&env);
    let token_admin = Address::generate(&env);
    let (token, token_admin_client) = create_token_contract(&env, &token_admin);

    let buyer = Address::generate(&env);
    token_admin_client.mint(&buyer, &50_000_000);

    let start_time = 4_000_000u64;
    env.ledger().with_mut(|li| li.timestamp = start_time);
    let deadline = start_time + 3600;

    client.initialize(&owner, &token.address, &deadline);

    // Self-referral: buyer refers themselves — should be a no-op (0 referral reward)
    client.buy_ticket(&buyer, &TicketTier::Bronze, &Some(buyer.clone()));

    // buyer should NOT receive any referral reward (self-referral is blocked)
    // Vault should get full 5% = 250_000 stroops
    let (_, _, _, vault) = client.get_raffle_info();
    assert_eq!(vault, 250_000); // Full 5%, no referral deduction
}
