import React, { useState } from 'react';
import { useContract } from '../hooks/useContract';
import { useFreighter } from '../hooks/useFreighter';
import { signTransaction } from '@stellar/freighter-api';

const MultiTicketPurchase = () => {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const { callContract } = useContract();
  const { publicKey } = useFreighter();

  const PRICE_XLM = 5;
  const totalCost = quantity * PRICE_XLM;
  const finalCost = quantity >= 10 ? totalCost * 0.9 : totalCost;

  const handlePurchase = async () => {
    if (!publicKey) return alert("Connect wallet first");
    setLoading(true);
    try {
      const response = await callContract(
        publicKey, 
        'buy_tickets', 
        [quantity], 
        signTransaction
      );
      if (response.status === 'SUCCESS') {
        alert("Success! Transaction Hash: " + response.hash);
      }
    } catch (err) {
      console.error(err);
      alert("Failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h3 className="text-2xl font-black text-white">Bulk Purchase</h3>
          <p className="text-slate-500 font-semibold text-xs uppercase tracking-widest mt-1">Stellar Testnet</p>
        </div>
        {quantity >= 10 && (
          <div className="bg-green-500/10 text-green-400 px-4 py-2 rounded-full border border-green-500/20 font-black text-xs animate-bounce">
            🔥 10% BUNDLE DISCOUNT ACTIVATED
          </div>
        )}
      </div>

      <div className="space-y-10">
        <div className="space-y-4">
          <div className="flex justify-between text-white font-black text-sm uppercase">
            <span>Ticket Quantity</span>
            <span className="text-indigo-400">{quantity} Tickets</span>
          </div>
          <input 
            type="range" 
            min="1" 
            max="50" 
            value={quantity} 
            onChange={(e) => setQuantity(parseInt(e.target.value))}
            className="w-full h-3 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500 border border-slate-700/50"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-black uppercase">
            <span>1 Ticket</span>
            <span>50 Tickets Max</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700/50">
            <span className="text-slate-500 text-xs font-bold block mb-1">Standard Cost</span>
            <span className="text-xl font-black text-white line-through opacity-40">{totalCost.toFixed(2)} XLM</span>
          </div>
          <div className="bg-indigo-500/10 rounded-2xl p-6 border border-indigo-500/30">
            <span className="text-indigo-400 text-xs font-bold block mb-1">Final Price</span>
            <span className="text-2xl font-black text-white">{finalCost.toFixed(2)} XLM</span>
          </div>
        </div>

        <button 
          onClick={handlePurchase}
          disabled={loading || !publicKey}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:from-slate-700 disabled:to-slate-700 disabled:cursor-not-allowed h-16 rounded-2xl text-white font-black uppercase tracking-widest shadow-[0_10px_40px_-5px_rgba(79,70,229,0.5)] transition-all transform active:scale-95"
        >
          {loading ? (
            <div className="flex items-center justify-center gap-3">
              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-white" />
              <span>Confirming on Chain...</span>
            </div>
          ) : (
            `Secure ${quantity} Tickets Now`
          )}
        </button>

        <p className="text-[10px] text-slate-500 text-center uppercase tracking-widest font-black leading-relaxed">
          Powered by Soroban Smart Contracts • Stellar Testnet Only
        </p>
      </div>
    </div>
  );
};

export default MultiTicketPurchase;
