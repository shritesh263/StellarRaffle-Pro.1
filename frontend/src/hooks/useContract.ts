import { rpc, TransactionBuilder, Networks, Address, nativeToScVal, scValToNative, Contract } from '@stellar/stellar-sdk';
import { useState, useEffect, useCallback } from 'react';

const RPC_URL = "https://soroban-testnet.stellar.org:443";
const NETWORK_PASSPHRASE = Networks.TESTNET;
const CONTRACT_ID = import.meta.env.VITE_CONTRACT_ID || ""; 

export function useContract() {
  const [server] = useState(new rpc.Server(RPC_URL));

  const fetchState = useCallback(async (method: string, args: any[] = []) => {
    if (!CONTRACT_ID) return null;
    const contract = new Contract(CONTRACT_ID);
    const tx = new TransactionBuilder(
      new rpc.Server(RPC_URL).getAccount("GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGAAAAAAAAAAAAAAAAAAAAAA"), // Dummy account
      { fee: "100", networkPassphrase: NETWORK_PASSPHRASE }
    )
    .addOperation(contract.call(method, ...args))
    .setTimeout(30)
    .build();

    const simulation = await server.simulateTransaction(tx);
    if (simulation.result) {
      return scValToNative(simulation.result.retval);
    }
    return null;
  }, [server]);

  const callContract = useCallback(async (publicKey: string, method: string, args: any[] = [], signTransaction: any) => {
    if (!CONTRACT_ID) throw new Error("Contract ID missing");
    
    const account = await server.getAccount(publicKey);
    const contract = new Contract(CONTRACT_ID);
    
    const tx = new TransactionBuilder(account, {
      fee: "1000",
      networkPassphrase: NETWORK_PASSPHRASE,
    })
    .addOperation(contract.call(method, ...args))
    .setTimeout(60)
    .build();

    const signedXdr = await signTransaction(tx.toXDR(), {
      network: 'TESTNET',
      accountToSign: publicKey,
    });

    const response = await server.sendTransaction(rpc.TransactionBuilder.fromXDR(signedXdr, NETWORK_PASSPHRASE));
    return response;
  }, [server]);

  return { fetchState, callContract, server };
}
