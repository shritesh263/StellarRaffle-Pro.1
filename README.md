<div align="center">

# 🎰 StellarRaffle Pro

**A high-fidelity, professional-grade decentralized lottery platform built on the Stellar Network (Soroban Smart Contracts)**

[![Stellar](https://img.shields.io/badge/Network-Stellar_Testnet-blueviolet?style=for-the-badge&logo=stellar)](https://stellar.org)
[![Rust](https://img.shields.io/badge/Contract-Rust%2FSoroban-orange?style=for-the-badge&logo=rust)](https://soroban.stellar.org)
[![React](https://img.shields.io/badge/Frontend-React%2BVite-61DAFB?style=for-the-badge&logo=react)](https://react.dev)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

</div>

---

## 📌 Project Overview

StellarRaffle Pro is a fully on-chain lottery dApp demonstrating **full-stack Soroban development**. Users can purchase tiered tickets using XLM, refer friends for instant on-chain rewards, and watch a transparent winner selection drawn by the Soroban PRNG — all without a centralized intermediary.

This project was built as a **Level 5 Stellar Internship Submission**, showcasing:
- Advanced Rust/Soroban smart contract patterns
- Production-ready React + Vite Web3 frontend
- Real Freighter wallet integration
- On-chain referral engine and business model

---

## 🔗 Live Demo & Contract

| Resource | Link |
|---|---|
| 🌐 **Live Frontend** | [https://stellarraffle.vercel.app](https://stellarraffle.vercel.app) *(deploy to update)* |
| 📜 **Contract ID (Testnet)** | `CDSA...` *(see deployment notes below)* |
| 🔭 **Stellar Expert** | [View on Stellar Expert](https://stellar.expert/explorer/testnet) |
| 📁 **GitHub Repository** | [github.com/ShriteshJ/StellarRaffle](https://github.com/ShriteshJ/StellarRaffle) |

---

## ✨ Key Features

### 🎟️ Multi-Tiered Ticketing System
Maximize participation with three strategic tiers — each providing a different entry weight for the prize draw:

| Tier | Price | Entries | Bonus |
|------|-------|---------|-------|
| 🥉 **Bronze** | 5 XLM | 1 entry | Entry-level |
| 🥇 **Gold** | 20 XLM | 5 entries | +25% value |
| 💎 **Diamond** | 50 XLM | 15 entries | +50% value (best ROI) |

### 🤝 Autonomous Referral Engine
A built-in viral growth mechanism. Referrers earn an instant **1% cashback in XLM** on every ticket purchased through their referral link. The reward is sent directly by the smart contract — no manual intervention required.

### 💼 Transparent Business Model
- **Platform Vault (5%)**: Each purchase auto-routes 5% to a segregated `VaultBalance`. Only the `Owner` can withdraw.
- **Prize Pool (95%)**: All remaining funds form the verifiable, on-chain jackpot.
- **Winner History**: On-chain record of the last 10 winners with timestamps.

### 🖥️ Futuristic Light UI
- **React 19 + Vite** for lightning-fast performance
- **Glassmorphism & micro-animations** for a premium Web3 feel
- **Freighter Wallet** integration for seamless Stellar signing
- **Tabbed navigation**: Play / Winner History / Referral Engine

---

## 🏗️ Architecture

For a complete technical deep-dive into the smart contract design, data flows, and security model, see:

👉 **[ARCHITECTURE.md](./ARCHITECTURE.md)**

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Smart Contract | Rust, Soroban SDK v22 |
| Blockchain | Stellar Testnet (Soroban RPC) |
| Frontend | React 19, Vite 8 |
| Wallet | Freighter Browser Extension |
| Styling | Vanilla CSS (Glassmorphism) |
| Testing | `cargo test` (Soroban test env) |

---

## 🚀 Getting Started

### Prerequisites
- [Rust](https://rustup.rs/) + `wasm32-unknown-unknown` target
- [Stellar CLI](https://developers.stellar.org/docs/tools/developer-tools/cli/install-cli)
- [Node.js 18+](https://nodejs.org/) + npm
- [Freighter Wallet](https://www.freighter.app/) browser extension (set to Testnet)

### 1. Clone the Repository
```bash
git clone https://github.com/ShriteshJ/StellarRaffle.git
cd StellarRaffle
```

### 2. Build & Deploy the Smart Contract
```bash
# Install Soroban target
rustup target add wasm32-unknown-unknown

# Build the contract
cd contract
cargo build --target wasm32-unknown-unknown --release

# Deploy to Stellar Testnet (requires stellar CLI and funded identity)
stellar contract deploy \
  --wasm target/wasm32-unknown-unknown/release/stellar_raffle.wasm \
  --source <YOUR_IDENTITY> \
  --network testnet

# Initialize the deployed contract
stellar contract invoke \
  --id <CONTRACT_ID> \
  --source <YOUR_IDENTITY> \
  --network testnet \
  -- initialize \
  --owner <OWNER_ADDRESS> \
  --token CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2AAMAOIP \
  --deadline 1800000000
```

> **XLM Token Address (Testnet):** `CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2AAMAOIP`

### 3. Configure the Frontend
```bash
cd frontend
# Update CONTRACT_ID in src/components/BuyTicket.jsx, RaffleInfo.jsx, Balance.jsx
# Replace the placeholder with your deployed contract ID
```

### 4. Run the Frontend
```bash
cd frontend
npm install
npm run dev
# Open http://localhost:5173
```

---

## ✅ Running Tests

The smart contract includes a comprehensive integration test covering the full workflow:

```bash
cd contract
cargo test -- --nocapture
```

**Test coverage includes:**
- Diamond ticket purchase with referral reward distribution
- Gold ticket purchase without referral
- Winner draw via Soroban PRNG
- Owner fee withdrawal
- Vault balance accounting

---

## 📂 Project Structure

```
StellarRaffle/
├── contract/                    # Soroban Smart Contract (Rust)
│   ├── src/
│   │   ├── lib.rs              # Core contract logic
│   │   └── test.rs             # Integration tests
│   └── Cargo.toml
├── frontend/                    # React + Vite dApp
│   ├── src/
│   │   ├── components/
│   │   │   ├── Wallet.jsx      # Freighter wallet connection
│   │   │   ├── Balance.jsx     # Live XLM balance display
│   │   │   ├── RaffleInfo.jsx  # Contract state (pool, timer, tickets)
│   │   │   ├── BuyTicket.jsx   # Ticket purchase + referral logic
│   │   │   ├── TierSelector.jsx # Tier selection UI
│   │   │   └── WinnerHistory.jsx # On-chain winner records
│   │   ├── App.jsx             # Root component + tab routing
│   │   ├── App.css             # Component styles
│   │   └── index.css           # Global design system
│   └── package.json
├── ARCHITECTURE.md              # Technical design document
└── README.md                   # This file
```

---

## 🔐 Security Model

- All user-facing state changes require `require_auth()` — no unauthorized transactions possible
- Platform fees are tracked in a separable `VaultBalance` — immune to prize pool contamination
- Referral self-dealing is blocked: `if ref_addr != buyer`
- Winner selection uses Soroban's native `env.prng()` — tamper-resistant on-chain randomness

---

## 📸 Screenshots

| Dashboard | Referral Engine |
|---|---|
| *Connect wallet and select a ticket tier* | *Generate and share your referral link* |

---

## 🗺️ Roadmap

- [ ] Multi-round automation (auto-restart after each draw)
- [ ] Mainnet deployment
- [ ] Ticket NFT mints for provenance
- [ ] DAO governance for platform fee allocation

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

*Developed as a Level 5 Stellar Internship Submission — 2026*
