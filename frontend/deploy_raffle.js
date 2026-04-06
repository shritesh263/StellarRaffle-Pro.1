import { rpc, TransactionBuilder, Networks, Keypair, Operation, Address, Contract, nativeToScVal } from '@stellar/stellar-sdk';
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
    console.log(`Deployer Secret: ${deployer.secret()}`);
    
    console.log("Funding account...");
    await fetch(`https://friendbot.stellar.org/?addr=${deployer.publicKey()}`);
    console.log("Funded.");

    let account = await server.getAccount(deployer.publicKey());
    const wasmPath = path.join(process.cwd(), '..', 'contract', 'target', 'wasm32-unknown-unknown', 'release', 'stellar_raffle_contract.wasm');
    const wasm = fs.readFileSync(wasmPath);

    // 1. Upload WASM
    console.log("Uploading WASM...");
    let tx = new TransactionBuilder(account, {
      fee: "100000",
      networkPassphrase: NETWORK_PASSPHRASE,
    })
    .addOperation(Operation.uploadContractWasm({ wasm }))
    .setTimeout(30)
    .build();

    tx = await server.prepareTransaction(tx);
    tx.sign(deployer);
    let resp = await server.sendTransaction(tx);
    console.log("Upload Sent:", resp.status, "Hash:", resp.hash);

    let status = await server.getTransaction(resp.hash);
    while (status.status === "NOT_FOUND" || status.status === "PENDING") {
      await new Promise(r => setTimeout(r, 2000));
      status = await server.getTransaction(resp.hash);
    }
    
    if (status.status !== "SUCCESS") throw new Error("Upload Failed");

    const wasmId = status.returnValue.bytes().toString('hex');
    console.log("WASM ID:", wasmId);

    // 2. Create Contract
    console.log("Creating contract...");
    account = await server.getAccount(deployer.publicKey());
    tx = new TransactionBuilder(account, {
      fee: "100000",
      networkPassphrase: NETWORK_PASSPHRASE,
    })
    .addOperation(Operation.createContract({ wasmId: Buffer.from(wasmId, 'hex'), address: Address.fromString(deployer.publicKey()) }))
    .setTimeout(30)
    .build();

    tx = await server.prepareTransaction(tx);
    tx.sign(deployer);
    resp = await server.sendTransaction(tx);
    
    status = await server.getTransaction(resp.hash);
    while (status.status === "NOT_FOUND" || status.status === "PENDING") {
      await new Promise(r => setTimeout(r, 2000));
      status = await server.getTransaction(resp.hash);
    }
    const contractId = Address.fromScVal(status.returnValue).toString();
    console.log("CONTRACT ID:", contractId);

    // 3. Initialize
    console.log("Initializing...");
    account = await server.getAccount(deployer.publicKey());
    const contract = new Contract(contractId);
    const deadline = Math.floor(Date.now() / 1000) + (24 * 3600); // 24 hours from now
    
    tx = new TransactionBuilder(account, {
      fee: "100000",
      networkPassphrase: NETWORK_PASSPHRASE,
    })
    .addOperation(contract.call("initialize", 
        Address.fromString(deployer.publicKey()).toScVal(),
        Address.fromString("CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2AAMAOIP").toScVal(), // Standard XLM Token on Testnet
        nativeToScVal(BigInt(deadline), { type: 'u64' })
    ))
    .setTimeout(30)
    .build();

    tx = await server.prepareTransaction(tx);
    tx.sign(deployer);
    resp = await server.sendTransaction(tx);
    console.log("Done. Contract Address:", contractId);

    fs.writeFileSync('deployed_id.txt', contractId);
    fs.writeFileSync('deployer_secret.txt', deployer.secret());
    
  } catch (e) {
    console.error("Error:", e.message);
    if (e.response && e.response.data) console.log(JSON.stringify(e.response.data));
    process.exit(1);
  }
}

deploy();
