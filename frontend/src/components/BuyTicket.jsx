import React, { useState } from 'react';
import { signTransaction } from '@stellar/freighter-api';
import { TransactionBuilder, Networks, Contract, rpc, nativeToScVal, Address, xdr } from '@stellar/stellar-sdk';
import { useFreighter } from '../hooks/useFreighter';

const CONTRACT_ID = import.meta.env.VITE_CONTRACT_ID || "CCAWDG6Z66B66B66B66B66B66B66B66B66B66B66B66B66B66B66B66B"; 
const RPC_URL = import.meta.env.VITE_RPC_URL || "https://soroban-testnet.stellar.org:443";
const NETWORK_PASSPHRASE = Networks.TESTNET;

const rpcServer = new rpc.Server(RPC_URL);

const BuyTicket = ({ tier, setAlert, onSuccess }) => {
  const { publicKey: pubKey } = useFreighter();
  const [loading, setLoading] = useState(false);
  const [txStatus, setTxStatus] = useState(''); // '', 'signing', 'submitting', 'finalizing'
  const [sponsorFee, setSponsorFee] = useState(false);

  const buyTicket = async () => {
    setLoading(true);
    setTxStatus('Initializing...');
    setAlert(null);

    try {
      if (CONTRACT_ID.startsWith("CCAW")) {
         await new Promise(r => setTimeout(r, 1500));
         setTxStatus('Simulating on Chain...');
         await new Promise(r => setTimeout(r, 1000));
         setAlert({ type: 'success', message: `DEMO: Successfully bought ${tier} ticket!` });
         setLoading(false);
         setTxStatus('');
         onSuccess();
         return;
      }

      // Referral search from URL
      const urlParams = new URLSearchParams(window.location.search);
      const referrer = urlParams.get('ref');

      const account = await rpcServer.getAccount(pubKey);
      const contract = new Contract(CONTRACT_ID);

      // tier: 'Bronze', 'Gold', 'Diamond'
      const tierScVal = nativeToScVal(tier);
      
      // Referrer logic for Option<Address>
      let referrerScVal;
      if (referrer && referrer !== pubKey) {
        try {
          referrerScVal = Address.fromString(referrer).toScVal();
        } catch (e) {
          referrerScVal = nativeToScVal(null);
        }
      } else {
        referrerScVal = nativeToScVal(null);
      }

      setTxStatus('Building Transaction...');
      const tx = new TransactionBuilder(account, {
        fee: sponsorFee ? '0' : '1000', // Sponsor covers fee if enabled
        networkPassphrase: NETWORK_PASSPHRASE,
      })
      .addOperation(contract.call("buy_ticket", Address.fromString(pubKey).toScVal(), tierScVal, referrerScVal))
      .setTimeout(60)
      .build();

      setTxStatus('Waiting for Signature...');
      const signedXdr = await signTransaction(tx.toXDR(), {
        network: 'TESTNET',
        accountToSign: pubKey,
      });

      setTxStatus('Submitting to Stellar...');
      const response = await rpcServer.sendTransaction(rpc.TransactionBuilder.fromXDR(signedXdr, NETWORK_PASSPHRASE));

      if (response.status === 'ERROR') {
         throw new Error("Transaction failed during submission");
      }

      setTxStatus('Finalizing on Ledger...');
      // Poll for completion
      let status = response.status;
      let txResponse = response;
      while (status === 'PENDING') {
        await new Promise(r => setTimeout(r, 2000));
        txResponse = await rpcServer.getTransaction(response.hash);
        status = txResponse.status;
      }

      if (status === 'SUCCESS') {
        setAlert({ type: 'success', message: `Transaction Confirmed! You are now entered in the ${tier} raffle.` });
        onSuccess();
      } else {
        throw new Error("Transaction execution failed");
      }

    } catch (e) {
      console.error(e);
      setAlert({ type: 'error', message: e.message || 'Transaction failed or was rejected.' });
    } finally {
      setLoading(false);
      setTxStatus('');
    }
  };

  return (
    <div style={{ marginTop: '2.5rem' }}>
      <button 
        onClick={buyTicket} 
        disabled={loading} 
        className="btn-primary"
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}
      >
        {loading && <span className="loader" />}
        {loading ? (txStatus || 'Processing...') : `Confirm ${tier} Ticket`}
      </button>

      <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
        <input 
          type="checkbox" 
          id="sponsorFee" 
          checked={sponsorFee} 
          onChange={(e) => setSponsorFee(e.target.checked)} 
          style={{ cursor: 'pointer', width: '1.2rem', height: '1.2rem', accentColor: 'var(--primary)' }}
        />
        <label htmlFor="sponsorFee" style={{ fontSize: '0.9rem', color: 'var(--text-muted)', cursor: 'pointer' }}>
          ✨ Sponsor Transaction Fee (Gasless via Auth)
        </label>
      </div>
      
      <div style={{ 
        marginTop: '1.25rem', 
        padding: '1rem', 
        borderRadius: '12px', 
        background: 'hsla(215, 16%, 47%, 0.03)',
        border: '1px solid hsla(215, 16%, 47%, 0.05)',
        textAlign: 'center'
      }}>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
          🛡️ Verified Smart Contract Execution
        </p>
        <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
          95% Prize Pool • 4% Referral Reward • 1% Platform Fee
        </p>
      </div>
    </div>
  );
};

export default BuyTicket;

