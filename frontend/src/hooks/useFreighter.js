import { useContext } from "react";
import { FreighterContext } from "../context/FreighterContext";

export function useFreighter() {
  const context = useContext(FreighterContext);

  if (!context) {
    throw new Error("useFreighter must be used within a FreighterProvider");
  }

  return {
    publicKey: context.address,
    isFreighterInstalled: context.isInstalled,
    isWalletConnected: !!context.address,
    connecting: context.connecting,
    error: context.error,
    connectWallet: context.connect,
    disconnectWallet: context.disconnect,
  };
}
