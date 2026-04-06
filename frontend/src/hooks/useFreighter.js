import { useState, useEffect, useCallback } from "react";
import {
  isConnected,
  requestAccess,
  getPublicKey,
} from "@stellar/freighter-api";

export function useFreighter() {
  const [publicKey, setPublicKey] = useState(null);
  const [isFreighterInstalled, setIsFreighterInstalled] = useState(true); // Default to true to prevent flickering
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState(null);

  // Poll for Freighter to account for slow injection
  useEffect(() => {
    let attempts = 0;
    const checkFreighter = async () => {
      try {
        const result = await isConnected();
        const connected = result.isConnected !== undefined ? result.isConnected : !!result;
        if (connected) {
          setIsFreighterInstalled(true);
          return true; // Success
        }
      } catch (e) {
        console.warn("Freighter discovery attempt failed:", e);
      }
      return false;
    };

    const interval = setInterval(async () => {
      const found = await checkFreighter();
      if (found || attempts > 6) {
        if (!found) setIsFreighterInstalled(false);
        clearInterval(interval);
      }
      attempts++;
    }, 500);

    checkFreighter();
    return () => clearInterval(interval);
  }, []);

  const connectWallet = useCallback(async () => {
    setError(null);
    setConnecting(true);
    try {
      const accessResult = await requestAccess();
      if (accessResult.error) {
        throw new Error(accessResult.error);
      }
      const keyResult = await getPublicKey();
      if (keyResult.error) {
        throw new Error(keyResult.error);
      }
      const key = keyResult.publicKey || keyResult;
      setPublicKey(key);
      setIsWalletConnected(true);
      return key;
    } catch (err) {
      setError(err.message || "Failed to connect wallet");
      return null;
    } finally {
      setConnecting(false);
    }
  }, []);

  const disconnectWallet = useCallback(() => {
    setPublicKey(null);
    setIsWalletConnected(false);
    setError(null);
  }, []);

  return {
    publicKey,
    isFreighterInstalled,
    isWalletConnected,
    connecting,
    error,
    connectWallet,
    disconnectWallet,
  };
}
