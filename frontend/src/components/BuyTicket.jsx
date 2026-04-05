import React, { useState } from 'react';
import { signTransaction } from '@stellar/freighter-api';
import { TransactionBuilder, Networks, Contract, rpc, nativeToScVal, Address } from '@stellar/stellar-sdk';

const CONTRACT_ID = import.meta.env.VITE_CONTRACT_ID || "CAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD2KM"; 
const RPC_URL = import.meta.env.VITE_RPC_URL || "https://soroban-testnet.stellar.org:443";
const NETWORK_PASSPHRASE = Networks.TESTNET;

const rpcServer = new rpc.Server(RPC_URL);

const BuyTicket = ({ pubKey, tier, setAlert, onSuccess }) => {
  const [loading, setLoading] = useState(false);

  const buyTicket = async () => {
    setLoading(true);
    setAlert(null);

    try {
      if (CONTRACT_ID.startsWith("CAA")) {
         setAlert({ type: 'success', message: `DEMO: Successfully bought ${tier} ticket!` });
         setLoading(false);
         onSuccess();
         return;
      }

      // Referral search from URL
      const urlParams = new URLSearchParams(window.location.search);
      const referrer = urlParams.get('ref');

      const account = await rpcServer.getAccount(pubKey);
      const contract = new Contract(CONTRACT_ID);

      // Tier ScVal mapping
      // tier: 'Bronze', 'Gold', 'Diamond'
      const tierScVal = nativeToScVal(tier);
      const tx = new TransactionBuilder(account, {
        fee: '100',
        networkPassphrase: NETWORK_PASSPHRASE,
      })
      .addOperation(contract.call("buy_ticket", Address.fromString(pubKey).toScVal(), tierScVal, referrer ? Address.fromString(referrer).toScVal() : nativeToScVal(null)))
      .setTimeout(30)
      .build();

      const signedXdr = await signTransaction(tx.toXDR(), {
        network: 'TESTNET',
        accountToSign: pubKey,
      });

      const response = await rpcServer.sendTransaction(rpc.TransactionBuilder.fromXDR(signedXdr, NETWORK_PASSPHRASE));

      if (response.status === 'SUCCESS') {
        setAlert({ type: 'success', message: `Successfully purchased ${tier} ticket!` });
        onSuccess();
      }

    } catch (e) {
      console.error(e);
      setAlert({ type: 'error', message: 'Transaction failed or was rejected.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginTop: '2rem' }}>
      <button 
        onClick={buyTicket} 
        disabled={loading} 
        className="btn-primary"
      >
        {loading ? <span className="loader"></span> : `Confirm Purchase (${tier})`}
      </button>
      <p style={{ marginTop: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center' }}>
        95% of proceeds go to Jackpot. 5% developer fee applies.
      </p>
    </div>
  );
};

export default BuyTicket;
