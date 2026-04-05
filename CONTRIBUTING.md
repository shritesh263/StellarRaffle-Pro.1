# Contributing to StellarRaffle Pro

Thank you for considering contributing! This is an open project built on Stellar/Soroban.

## Development Setup

### Smart Contract (Rust/Soroban)
```bash
rustup target add wasm32-unknown-unknown
cd contract
cargo build --target wasm32-unknown-unknown --release
cargo test
```

### Frontend (React + Vite)
```bash
cd frontend
cp .env.example .env.local   # Add your contract ID
npm install
npm run dev
```

## Commit Conventions

This project uses [Conventional Commits](https://www.conventionalcommits.org/):

| Prefix | Usage |
|--------|-------|
| `feat:` | New feature |
| `fix:` | Bug fix |
| `docs:` | Documentation only |
| `contract:` | Smart contract changes |
| `chore:` | Tooling / configuration |
| `test:` | Adding or updating tests |
| `style:` | CSS / UI changes |

## Pull Request Process

1. Fork the repo and create a feature branch
2. Ensure `cargo test` passes before submitting
3. Update `ARCHITECTURE.md` if contract logic changes
4. Keep PRs focused — one feature or fix per PR

## Code Style

- **Rust**: Follow standard `rustfmt` conventions (`cargo fmt`)
- **JavaScript/JSX**: ESLint is configured in `frontend/eslint.config.js`
