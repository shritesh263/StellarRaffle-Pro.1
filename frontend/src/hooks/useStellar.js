import { useState, useEffect, useCallback } from "react";
import { HORIZON_URL } from "../config";

export function useStellar(publicKey) {
  const [balance, setBalance] = useState("0.00");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBalance = useCallback(async () => {
    if (!publicKey) {
      setBalance("0.00");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${HORIZON_URL}/accounts/${publicKey}`);
      // Handle the case where a new account isn't yet in the ledger
      if (response.status === 404) {
        setBalance("0.00");
        return;
      }
      if (!response.ok) {
        throw new Error("Horizon API request failed");
      }
      const data = await response.json();
      const xlmBalance = data.balances.find((b) => b.asset_type === "native");
      setBalance(xlmBalance ? xlmBalance.balance : "0.00");
    } catch (err) {
      setError(err.message || "Failed to fetch balance");
    } finally {
      setLoading(false);
    }
  }, [publicKey]);

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  return { balance, loading, error, refreshBalance: fetchBalance };
}
