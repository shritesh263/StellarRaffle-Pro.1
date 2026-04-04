# StellarRaffle

A fully on-chain lottery built on Stellar Testnet using Soroban. 
Users connect their Freighter wallet, buy a lottery ticket for 5 XLM, and when the deadline passes, a smart contract autonomously selects a random winner and sends them the total XLM prize pool.

## Features Built
- **Soroban Smart Contract**: Written in Rust, natively verifiable Wasm. Implements `buy_ticket` and `pick_winner` with a random number generator.
- **Vite React Frontend**: Connects directly to the Testnet horizon and Soroban RPC.
- **Freighter Wallet Integration**: Connect/disconnect UI and robust transaction building.
- **Clean UI**: Responsive glassmorphism interface with testable logic and error handling.

## Running Locally

1. Update your `.env` file in `frontend/.env` with your desired RPC and Contract ID.
2. Initialize Frontend:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
3. Test Frontend logic:
   ```bash
   npm run test
   ```

## Smart Contract Setup

Due to missing `link.exe` for Visual Studio Build Tools, native Windows compilation of Soroban Wasm couldn't finish. Run the following on a configured Rust environment:
```bash
# 1. Add Wasm target
rustup target add wasm32-unknown-unknown

# 2. Build the contract
cd contract
cargo build --target wasm32-unknown-unknown --release

# 3. Use Stellar CLI to fund identity and deploy to Testnet
stellar keys generate signer --fund
stellar contract deploy \
  --wasm target/wasm32-unknown-unknown/release/stellar_raffle_contract.wasm \
  --source signer \
  --network testnet
```

Copy the generated Contract ID into `frontend/.env` variables:
```
VITE_CONTRACT_ID="CXYZ...ABCD"
VITE_RPC_URL="https://soroban-testnet.stellar.org:443"
```
