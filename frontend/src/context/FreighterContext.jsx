import React, { createContext, useState, useEffect, useCallback } from 'react';
import {
  isConnected,
  isAllowed,
  requestAccess,
  getAddress,
  WatchWalletChanges,
} from "@stellar/freighter-api";

export const FreighterContext = createContext(null);

export const FreighterProvider = ({ children }) => {
  const [address, setAddress] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState(null);

  // Initialize and check for Freighter status
  useEffect(() => {
    const init = async () => {
      try {
        const connected = await isConnected();
        if (connected) {
          setIsInstalled(true);
          
          // Auto-connect if already allowed
          const allowed = await isAllowed();
          if (allowed) {
            const currentAddress = await getAddress();
            if (currentAddress && !currentAddress.error) {
              setAddress(currentAddress.address || currentAddress);
            }
          }
        }
      } catch (err) {
        console.warn("Freighter initialization warning:", err);
      }
    };
    init();

    // Set up watcher for account/connection changes
    let watcher;
    try {
      watcher = new WatchWalletChanges((newAddress) => {
        setAddress(newAddress);
      });
    } catch (err) {
       console.error("Failed to initialize WatchWalletChanges:", err);
    }

    return () => {
      if (watcher && watcher.stop) {
        watcher.stop();
      }
    };
  }, []);

  const connect = useCallback(async () => {
    setConnecting(true);
    setError(null);
    try {
      const result = await requestAccess();
      if (result && !result.error) {
        const addr = result.address || result;
        setAddress(addr);
        return addr;
      } else if (result.error) {
         throw new Error(result.error);
      }
    } catch (err) {
      setError(err.message || "Failed to connect to Freighter");
      console.error("Freighter connection error:", err);
    } finally {
      setConnecting(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    setAddress(null);
    setError(null);
  }, []);

  const value = {
    address,
    isInstalled,
    connecting,
    error,
    connect,
    disconnect
  };

  return (
    <FreighterContext.Provider value={value}>
      {children}
    </FreighterContext.Provider>
  );
};
