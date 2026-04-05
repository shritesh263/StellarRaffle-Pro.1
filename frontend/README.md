# Stellar Raffle Frontend Documentation

## Project-specific Frontend Description
This repository contains the frontend for the Stellar Raffle project, a platform that allows users to participate in raffles using cryptocurrency. The frontend is designed to provide an intuitive user experience while interacting with the backend services.

## Wallet Integration Setup
To enable wallet integration, follow these steps:
1. Install the required wallet provider (e.g., MetaMask).
2. Connect your wallet to the application using the connection button.
3. Ensure that your wallet is configured to use the appropriate network.

## Component Structure and Responsibilities
The frontend application is structured into several key components:
- **App**: The main application component that controls routing and global state.
- **Header**: Displays the navigation and wallet connection status.
- **RaffleList**: Fetches and displays the list of active raffles.
- **RaffleDetails**: Shows the details of a selected raffle and allows entry.

## Environment Variables Configuration
Create a `.env` file in the root of the project and add the following variables:
```
REACT_APP_API_URL=<your_api_url>
REACT_APP_NETWORK=<Ethereum or other network name>
```
Make sure to replace `<your_api_url>` with your actual API endpoint.

## Build and Deployment Instructions for Vercel
1. Push your code to GitHub.
2. Sign in to Vercel and import your GitHub repository.
3. Set up the environment variables in Vercel's project settings.
4. Vercel will automatically deploy your application on every push to the main branch.

## Development Workflow
- Clone the repository: `git clone https://github.com/shritesh263/-StellarRaffle-Pro.git`
- Install dependencies: `npm install`
- Run the development server: `npm start`
- Commit changes: `git commit -m "Your commit message"`
- Push to GitHub: `git push origin main`