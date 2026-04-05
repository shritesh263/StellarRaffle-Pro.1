import { rpc, TransactionBuilder, Networks, Keypair, Contract, Address, nativeToScVal, Operation } from '@stellar/stellar-sdk';
import fs from 'fs';
import path from 'path';

const RPC_URL = "https://soroban-testnet.stellar.org:443";
const NETWORK_PASSPHRASE = Networks.TESTNET;
const server = new rpc.Server(RPC_URL);

async function deploy() {
  try {
    console.log("--- Starting Deployment ---");
    
    const deployer = Keypair.random();
    console.log(`Deployer Public Key: ${deployer.publicKey()}`);
    await fetch(`https://friendbot.stellar.org/?addr=${deployer.publicKey()}`);
    console.log("Funded.");

    let account = await server.getAccount(deployer.publicKey());
    const wasmPath = path.join(process.cwd(), '..', 'contract', 'target', 'wasm32-unknown-unknown', 'release', 'stellar_raffle_contract.wasm');
    const wasm = fs.readFileSync(wasmPath);

    // 1. Upload
    console.log("Uploading WASM...");
    let tx = new TransactionBuilder(account, {
      fee: "100",
      networkPassphrase: NETWORK_PASSPHRASE,
    })
    .addOperation(Operation.uploadContractWasm({ wasm }))
    .setTimeout(30)
    .build();

    console.log("Simulating/Preparing Upload...");
    tx = await server.prepareTransaction(tx);
    tx.sign(deployer);
    let resp = await server.sendTransaction(tx);
    console.log("Upload Sent:", resp.status);

    if (resp.status !== "SUCCESS") {
        throw new Error(`Upload failed: ${JSON.stringify(resp)}`);
    }

    let status = await server.getTransaction(resp.hash);
    while (status.status === "NOT_FOUND" || status.status === "PENDING") {
      console.log("Polling Upload...");
      await new Promise(r => setTimeout(r, 2000));
      status = await server.getTransaction(resp.hash);
    }
    
    if (status.status !== "SUCCESS") {
        throw new Error(`Upload result failed: ${JSON.stringify(status)}`);
    }

    const wasmId = status.returnValue.bytes().toString('hex');
    console.log("WASM ID:", wasmId);

    // 2. Create
    console.log("Creating contract...");
    account = await server.getAccount(deployer.publicKey());
    tx = new TransactionBuilder(account, {
      fee: "100",
      networkPassphrase: NETWORK_PASSPHRASE,
    })
    .addOperation(Operation.createContract({ wasmId: Buffer.from(wasmId, 'hex'), address: Address.fromString(deployer.publicKey()) }))
    .setTimeout(30)
    .build();

    tx = await server.prepareTransaction(tx);
    tx.sign(deployer);
    resp = await server.sendTransaction(tx);
    console.log("Create Sent:", resp.status);

    status = await server.getTransaction(resp.hash);
    while (status.status === "NOT_FOUND" || status.status === "PENDING") {
      console.log("Polling Create...");
      await new Promise(r => setTimeout(r, 2000));
      status = await server.getTransaction(resp.hash);
    }
    const contractId = Address.fromScVal(status.returnValue).toString();
    console.log("CONTRACT ID:", contractId);

    console.log("--- Deployment Successful ---");
    console.log(`CONTRACT_ID=${contractId}`);
    fs.writeFileSync('deployed_id.txt', contractId);
  } catch (e) {
    fs.writeFileSync('error_log.txt', e.stack + "\n" + JSON.stringify(e, null, 2));
    console.error("CRITICAL ERROR:", e.message);
    process.exit(1);
  }
}

deploy().catch(console.error);
