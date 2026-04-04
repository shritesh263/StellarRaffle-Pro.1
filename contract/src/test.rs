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
fn test_buy_ticket() {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register_contract(None, RaffleContract);
    let client = RaffleContractClient::new(&env, &contract_id);

    let token_admin = Address::generate(&env);
    let (token, token_admin_client) = create_token_contract(&env, &token_admin);

    let buyer = Address::generate(&env);
    token_admin_client.mint(&buyer, &100_000_000); // 10 XLM

    // Deadline in 1 hour
    let start_time = 12345;
    env.ledger().with_mut(|li| li.timestamp = start_time);
    let deadline = start_time + 3600;

    client.initialize(&token.address, &deadline);

    client.buy_ticket(&buyer);

    let pool = client.get_pool();
    assert_eq!(pool, 50_000_000); // 5 XLM

    let participants = client.get_participants();
    assert_eq!(participants.len(), 1);
    assert_eq!(participants.get(0).unwrap(), buyer);
}

#[test]
fn test_pick_winner() {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register_contract(None, RaffleContract);
    let client = RaffleContractClient::new(&env, &contract_id);

    let token_admin = Address::generate(&env);
    let (token, token_admin_client) = create_token_contract(&env, &token_admin);

    let buyer1 = Address::generate(&env);
    let buyer2 = Address::generate(&env);
    token_admin_client.mint(&buyer1, &100_000_000);
    token_admin_client.mint(&buyer2, &100_000_000);

    let start_time = 12345;
    env.ledger().with_mut(|li| li.timestamp = start_time);
    let deadline = start_time + 3600;

    client.initialize(&token.address, &deadline);

    client.buy_ticket(&buyer1);
    client.buy_ticket(&buyer2);

    assert_eq!(client.get_pool(), 100_000_000);

    // Fast forward past deadline
    env.ledger().with_mut(|li| li.timestamp = deadline + 1);

    client.pick_winner();

    assert_eq!(client.get_pool(), 0);
    assert_eq!(client.get_participants().len(), 0);

    let bal1 = token.balance(&buyer1);
    let bal2 = token.balance(&buyer2);

    // One should have 150_000_000 and the other 50_000_000
    assert!(bal1 == 150_000_000 || bal2 == 150_000_000);
}
