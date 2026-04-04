import React, { useState } from 'react';
import { signTransaction } from '@stellar/freighter-api';
import { TransactionBuilder, Networks, Contract, Asset, rpc } from '@stellar/stellar-sdk';

const CONTRACT_ID = import.meta.env.VITE_CONTRACT_ID || "CAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD2KM"; 
const RPC_URL = import.meta.env.VITE_RPC_URL || "https://soroban-testnet.stellar.org:443";
const NETWORK_PASSPHRASE = Networks.TESTNET;

const rpcServer = new rpc.Server(RPC_URL);

const BuyTicket = ({ pubKey, setAlert, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState('');

  const buyTicketInfo = async () => {
    setLoading(true);
    setAlert(null);
    setTxHash('');

    try {
      if (CONTRACT_ID.startsWith("CAA")) {
         setAlert({ type: 'error', message: 'Contract ID not set. Please update .env' });
         setLoading(false);
         return;
      }

      const account = await rpcServer.getAccount(pubKey);
      
      const contract = new Contract(CONTRACT_ID);
      const tx = new TransactionBuilder(account, {
        fee: '100',
        networkPassphrase: NETWORK_PASSPHRASE,
      })
      .addOperation(contract.call("buy_ticket", /* we'd pass env + buyer here using xdr */ ))
      .setTimeout(30)
      .build();

      // Ask Freighter to sign it
      const signedXdr = await signTransaction(tx.toXDR(), {
        network: 'TESTNET',
        accountToSign: pubKey,
      });

      // Submit via RPC
      const txToSubmit = rpc.TransactionBuilder.fromXDR(signedXdr, NETWORK_PASSPHRASE);
      const response = await rpcServer.sendTransaction(txToSubmit);

      if (response.status === 'ERROR') {
        const resultXdr = response.errorResultXdr;
        if (resultXdr) {
           setAlert({ type: 'error', message: 'Transaction failed (possibly not enough XLM).' });
        } else {
           setAlert({ type: 'error', message: "Can't reach Testnet. Try again." });
        }
      } else if (response.status === 'PENDING') {
        // Poll for status
        let txStatus = await rpcServer.getTransaction(response.hash);
        let retries = 0;
        while (txStatus.status === 'NOT_FOUND' && retries < 10) {
           await new Promise((res) => setTimeout(res, 2000));
           txStatus = await rpcServer.getTransaction(response.hash);
           retries++;
        }
        
        if (txStatus.status === 'SUCCESS') {
          setTxHash(response.hash);
          setAlert({ type: 'success', message: 'Ticket purchased successfully!' });
          onSuccess();
        } else {
          setAlert({ type: 'error', message: 'Transaction failed on chain.' });
        }
      }

    } catch (e) {
      if (e.message && e.message.toLowerCase().includes('reject')) {
        setAlert({ type: 'error', message: 'You cancelled the transaction.' });
      } else {
        setAlert({ type: 'error', message: 'Your balance is too low, or network issue occurred.' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="action-section">
      <button 
        onClick={buyTicketInfo} 
        disabled={loading} 
        className="btn" 
        style={{width: '100%', height: '50px', marginTop: '1rem', background: 'var(--secondary)'}}
      >
        {loading ? <div className="loader"></div> : 'Buy Ticket (5 XLM)'}
      </button>

      {txHash && (
        <div className="notification notif-success" style={{marginTop: '1rem'}}>
          <p>Success Hash:</p>
          <a a href={`https://stellar.expert/explorer/testnet/tx/${txHash}`} target="_blank" rel="noreferrer" style={{color: 'inherit'}}>
            {txHash.substring(0,8)}...{txHash.substring(txHash.length - 8)}
          </a>
        </div>
      )}
    </div>
  );
};

export default BuyTicket;
