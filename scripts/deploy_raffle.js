import { rpc, TransactionBuilder, Networks, Keypair, Asset, Contract, Address, nativeToScVal, xdr } from '@stellar/stellar-sdk';
import fs from 'fs';
import path from 'path';

const RPC_URL = "https://soroban-testnet.stellar.org:443";
const NETWORK_PASSPHRASE = Networks.TESTNET;
const server = new rpc.Server(RPC_URL);

async function deploy() {
  console.log("--- Starting Deployment ---");
  
  // 1. Generate/Fund Deployer
  const deployer = Keypair.random();
  console.log(`Deployer Public Key: ${deployer.publicKey()}`);
  console.log("Funding deployer via Friendbot...");
  await fetch(`https://friendbot.stellar.org/?addr=${deployer.publicKey()}`);
  console.log("Funded.");

  const account = await server.getAccount(deployer.publicKey());

  // 2. Read WASM
  const wasmPath = path.join(process.cwd(), 'contract', 'target', 'wasm32-unknown-unknown', 'release', 'stellar_raffle.wasm');
  const wasm = fs.readFileSync(wasmPath);

  // 3. Upload WASM
  console.log("Uploading WASM...");
  const installTx = new TransactionBuilder(account, {
    fee: "1000000",
    networkPassphrase: NETWORK_PASSPHRASE,
  })
  .addOperation(rpc.Operation.uploadWasm({ wasm }))
  .setTimeout(30)
  .build();

  installTx.sign(deployer);
  const installResp = await server.sendTransaction(installTx);
  console.log("Upload Response:", installResp.status);

  if (installResp.status !== "SUCCESS") {
    console.error("Upload failed.");
    return;
  }

  // Get WASM ID
  const wasmId = installResp.wasmId; // Simplified for this script
  console.log("WASM ID:", wasmId);

  // 4. Create Contract
  console.log("Creating contract instance...");
  const createTx = new TransactionBuilder(await server.getAccount(deployer.publicKey()), {
    fee: "1000000",
    networkPassphrase: NETWORK_PASSPHRASE,
  })
  .addOperation(rpc.Operation.createContract({ wasmId, address: Address.fromString(deployer.publicKey()) }))
  .setTimeout(30)
  .build();

  createTx.sign(deployer);
  const createResp = await server.sendTransaction(createTx);
  console.log("Create Response:", createResp.status);

  const contractId = createResp.contractId;
  console.log("CONTRACT ID:", contractId);

  // 5. Initialize
  console.log("Initializing contract...");
  const initTx = new TransactionBuilder(await server.getAccount(deployer.publicKey()), {
    fee: "1000000",
    networkPassphrase: NETWORK_PASSPHRASE,
  })
  .addOperation(new Contract(contractId).call("initialize", 
    Address.fromString(deployer.publicKey()).toScVal(),
    Address.fromString("CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2AAMAOIP").toScVal(), // XLM Testnet
    nativeToScVal(Math.floor(Date.now() / 1000) + 3600, { type: 'u64' }) // Deadline + 1 hour
  ))
  .setTimeout(30)
  .build();

  initTx.sign(deployer);
  const initResp = await server.sendTransaction(initTx);
  console.log("Initialize Response:", initResp.status);

  console.log("--- Deployment Complete ---");
  console.log(`CONTRACT_ID=${contractId}`);
}

deploy().catch(console.error);
