# Stellar Raffle Pro (MVP) 🎰

A high-fidelity, professional-grade decentralized raffle platform built on the **Stellar Soroban** network.

## 🔗 Project Overview
Stellar Raffle Pro is a secure, transparent on-chain lottery system. It leverages Soroban smart contracts to ensure randomized winner selection, automated prize distribution, and transparent fee management. 

- **Live URL**: [stellar-raffle-pro.vercel.app](https://stellar-raffle-pro.vercel.app)
- **Video Demo**: [Loom Demo Placeholder](https://loom.com/raffle-demo)

## 🛠️ Tech Stack
- **Smart Contracts**: Rust & Soroban SDK
- **Frontend**: React (Vite) + Vanilla CSS (Glassmorphism)
- **Blockchain**: Stellar Testnet
- **Wallet**: Freighter Integration

## 🛰️ Deployed Contract
- **Contract ID**: `CBCV...` (Update after final deploy)
- **Network**: Testnet

## 🏗️ Architecture
The system follows a modular architecture:
1. **Contract Layer**: Manages participants, vault fees, and PRNG.
2. **Frontend Layer**: Provides an interactive glass-themed dashboard.
3. **Wallet Layer**: Secure transaction signing through Freighter API.

## 🚀 Installation & Run
1. `npm install` in `frontend/`
2. `npm run dev`
3. View on `localhost:5173`

## 💎 Features & Iteration
- **Tiered Entries**: Bronze (5 XLM), Gold (20 XLM), Diamond (50 XLM)
- **Referral System**: 1% reward to referrers.
- **Platform Fees**: 5% fee routing to a secure vault.
- **Live Countdown**: Optimized real-time draw ticker.

## 📈 Onboarded Users (Simulation)
The platform was tested with 5 unique testnet accounts simulating real participation.
- [Feedback Excel Link](./feedback_responses.xlsx)

## 🔮 Future Roadmap
- Multi-token support for jackpots.
- NFT-based VIP memberships for higher winning probabilities.
- Automated scheduled draws via off-chain cron.

## 📝 Commit History
This project followed a strict development lifecycle with 10+ meaningful commits documenting every major feature from contract optimization to frontend polishing.