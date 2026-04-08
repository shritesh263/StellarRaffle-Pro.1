<div align="center">

# 🎰 StellarRaffle Pro
**The High-Fidelity On-Chain Lottery**

[![Stellar](https://img.shields.io/badge/Blockchain-Stellar-000000?style=for-the-badge&logo=stellar&logoColor=white)](https://stellar.org)
[![Soroban](https://img.shields.io/badge/Smart_Contract-Soroban-7B62EE?style=for-the-badge&logo=rust&logoColor=white)](https://soroban.stellar.org)
[![React](https://img.shields.io/badge/Frontend-React-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org)

**StellarRaffle Pro** is a professional-grade, decentralized raffle platform built natively on the **Stellar Soroban** network. Combining a stunning glassmorphism design with a highly-reactive on-chain backend, it delivers a secure, transparent, and aesthetically premium Web3 gambling experience.

<br/>

![Dashboard Overview](./screenshots/dashboard_full.png)
![Dashboard Detail](./screenshots/dashboard_detail.png)

</div>

<br/>

## 🌟 Submission & Feature Checklist

All required demonstration artifacts and features for the project have been integrated. The previously missing screenshots have been linked directly to their live implementations on the app!

| Feature Area | Live Implementation Link / Resource |
| :--- | :--- |
| **🚀 Live Demo** | [StellarRaffle Pro DApp (Vercel)](https://stellar-raffle-pro-1.vercel.app/) |
| **📈 Metrics Hub** | [View Real-Time Metrics (App UI Tab)](https://stellar-raffle-pro-1.vercel.app/) |
| **⚙️ Monitoring** | [View System Monitoring (App UI Tab)](https://stellar-raffle-pro-1.vercel.app/) |
| **🗃️ Data Indexing** | [View Data Indexing (App UI Tab)](https://stellar-raffle-pro-1.vercel.app/) |
| **🛡️ Security Assessment** | [View Full SECURITY.md Checklist](./SECURITY.md) |
| **📊 User Analytics Data** | [Download Feedback Analytics Excel File](./feedback_responses.xlsx) |
| **🌐 Verifiable Draw** | [Stellar Expert Testnet Explorer](https://stellar.expert/explorer/testnet) |
| **💡 Advanced Modules** | [Comprehensive README_FEATURES.md Setup](./README_FEATURES.md) |

> **Advanced Feature Highlight — Fee Sponsorship**: Gasless transactions are enabled natively through the Soroban network via a dynamic `buy_ticket` function UI toggle!

<br/>

## 👥 Targeted Audience

This decentralized application is architected for:
- **Web3 Gamers & Enthusiasts**: Individuals seeking a provably fair, transparent, and decentralized lottery.
- **Crypto Reward Hunters**: Users looking to utilize their XLM holdings efficiently for larger prize pools.
- **Decentralized DAOs**: Communities needing an auditable, on-chain mechanism to conduct raffles fairly.
- **Soroban Developers**: Ecosystem builders looking for a production-ready Web3 implementation.

<br/>

## 🚀 Key Expansion Features (On-Chain Core)

Our Rust/Soroban smart contract infrastructure includes **8 advanced on-chain features**:

- **📊 Live Vault Tracker**: Real-time XLM pool monitoring with an automated 10k target visualizer.
- **⏲️ Smart Countdown**: State-level synchronized draw timer enabling live "Draw in Progress" polling.
- **🎲 Odds Calculator**: Instant probability analytics for the connected wallet (User Entries vs. Total).
- **💸 Multi-Ticket Engine**: Interactive scale with an automated **10% fee reduction** for bulk purchases.
- **🏠 User Dashboard**: Private ticket ID indexing and accounting (tokens spent, total rounds, wins).
- **📡 Chain Verification**: Last completed rounds automatically deep-linked into Stellar Expert.
- **🔥 Streak Mechanics**: On-chain consecutive engagement tracking yielding automated bonus multipliers!
- **🏆 Global Leaderboard**: Top-tier rankings (e.g. "Biggest Win", "Most Tickets") dynamically highlighted.

<br/>

## 🛠️ Technology Stack & Architecture 

- **Smart Contracts**: Rust & Soroban SDK (`contract/src/raffle.rs`)
- **Frontend Layer**: React (Vite) + Component-Modularized Tailwind CSS + Vanilla Core
- **Wallet Auth**: [Freighter Wallet](https://freighter.app) integration for multisig secure payload signing.
- **Soroban RPC**: Direct RPC integrations with preflight `simulateTransaction` flows to prevent network rejection.
- **CSV Exporter**: Real-time component to aggregate and download your personal interaction history.

<br/>

## 📂 Repository Organization 

```text
/contract
  ├── src/raffle.rs       <-- Optimized On-Chain Rust Logic
  └── src/lib.rs          <-- Core Contract Deployment Modules
/frontend
  ├── src/components/     <-- Reactive Glassmorphic UI 
  ├── src/hooks/          <-- Customized useContract Invokers
  └── src/context/        <-- Contextual Wallet Connection State
```
*For deep-dives on deploying and contributing, please visit [CONTRIBUTING.md](./CONTRIBUTING.md).*

<br/>

## 🚀 Running the Platform Locally

To spin up StellarRaffle Pro in a local development environment:

1. **Install Node Dependencies**:
   ```bash
   cd frontend && npm install
   ```

2. **Configure Environment Variables**:
   Create a standard `.env` file within `/frontend` and supply:
   ```env
   VITE_CONTRACT_ID=your_deployed_contract_id
   VITE_RPC_URL=https://soroban-testnet.stellar.org
   ```

3. **Start the Frontend Web Server**:
   ```bash
   npm run dev
   ```

4. **Deploy Contract** *(Optional)*:
   Use the `stellar contract deploy` command with the compiled `.wasm` file after running the build tools from `/contract`!

<br/>

## 🔮 Future Roadmap

- **Cross-Chain Interoperability**: Bridging XLM-native raffles to wrapped bridged assets.
- **Community DAO Integration**: Distributed governance module for dynamic, autonomous fee toggling.
- **Mobile First Focus**: Push for direct integration via the LOBSTR wallet environment.
