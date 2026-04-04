import React, { useState, useEffect } from 'react';
import { rpc, Contract, nativeToScVal, scValToNative } from '@stellar/stellar-sdk';

// We'll replace this once the contract is deployed
const CONTRACT_ID = import.meta.env.VITE_CONTRACT_ID || "CAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD2KM"; 
const RPC_URL = import.meta.env.VITE_RPC_URL || "https://soroban-testnet.stellar.org:443";

const rpcServer = new rpc.Server(RPC_URL);

const RaffleInfo = ({ refreshTrigger }) => {
  const [pool, setPool] = useState('0');
  const [participantsCount, setParticipantsCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchContractData();
  }, [refreshTrigger]);

  const fetchContractData = async () => {
    // Basic mock until we have our actual contract ID set up.
    if (CONTRACT_ID.startsWith("CAA")) {
       return;
    }
    
    setLoading(true);
    try {
      const contract = new Contract(CONTRACT_ID);
      
      // Get Pool
      const poolTx = await rpcServer.simulateTransaction(
        // Note: Building a full simulation needs a source account. 
        // We'll rely on simple reads if possible, or wait to implement correctly.
        // For simplicity in UI, we might just show mock or actual fetch if real contract:
      );

      // Soroban RPC logic for calling `get_pool` and `get_participants` ...
      // We will fill this in when the Wasm is deployed and we have exact bindings.
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="raffle-section stat-box">
      <div className="stat-label">Prize Pool</div>
      <div className="stat-value">
        {loading ? <div className="loader" style={{margin:'0 auto'}}></div> : `${pool} XLM`}
      </div>
      <div className="stat-label" style={{marginTop: '1rem'}}>Participants</div>
      <div className="stat-value" style={{color: 'var(--text-main)'}}>{participantsCount}</div>
      <div className="stat-label" style={{marginTop: '1rem'}}>Draw In</div>
      <div className="stat-value">TBD</div>
    </div>
  );
};

export default RaffleInfo;
