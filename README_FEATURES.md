# StellarRaffle Feature Expansion Bundle 🎰

This bundle adds 8 advanced, on-chain features to the StellarRaffle platform using Soroban smart contracts and React.

## 🚀 Addition List

1. **LIVE VAULT TRACKER**: Real-time XLM pool monitoring with animated progress.
2. **COUNTDOWN TIMER**: On-chain deadline tracking with draw-in-progress states.
3. **ODDS CALCULATOR**: Instant win-probability analysis for the connected wallet.
4. **MULTI-TICKET PURCHASE**: Bulk entry slider with automated 10% bundle discounts.
5. **MY TICKETS DASHBOARD**: Personal entry history with local CSV data export.
6. **VERIFIABLE DRAW HISTORY**: Ledger-verified winner list linked to Stellar Expert.
7. **STREAK BONUS SYSTEM**: Participation rewards for consecutive round entries.
8. **LEADERBOARD**: Global top 10 rankings for winners and heavy buyers.

## 🛠️ Technical Implementation

### Smart Contract (`/contracts/raffle.rs`)
The new contract includes:
- `buy_tickets(quantity: u32)` with discount logic.
- `get_raffle_info()` for live dashboarding.
- `get_user_stats()` for streaks and balances.
- Event emission for the `draw_winner` history.

### Hook (`/frontend/src/hooks/useContract.ts`)
A shared TypeScript hook that handles:
- RPC server connection.
- Transaction simulation (`simulateTransaction`).
- XDR signing via Freighter.

### Components (`/frontend/src/components/*.tsx`)
All components are built with **Tailwind CSS** and are fully responsive.

## 📦 How to Integrate

Since this is an **additive-only** expansion (no existing files were modified), you can view all new features by importing the unified dashboard:

```jsx
import FeaturesDashboard from './components/FeaturesDashboard';

// Place this inside your main App component or a new route
<FeaturesDashboard />
```

> [!IMPORTANT]
> **Tailwind Setup**: If your project does not yet have Tailwind CSS, you must install it (`npm install -D tailwindcss postcss autoprefixer`) and initialize your configuration to see the high-fidelity styling.

> [!TIP]
> **Contract Deployment**: Deploy the new `raffle.rs` contract to Testnet, then update your `.env` file with the new `VITE_CONTRACT_ID`.
