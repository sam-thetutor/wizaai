import {
  useDisconnect,
  useWriteContract,
  useWaitForTransactionReceipt,
  useChainId,
} from "wagmi";
import { useCallback, useEffect } from "react";
import { useApp } from "../contexts/AppContext";
import { useAppKitAccount } from "@reown/appkit/react";
import { useSupabase } from "./useSupabase";
import { switchToKaiaTestnet, isKaiaNetwork, KAIA_TESTNET_CHAIN_ID } from "../utils/networkUtils";

export const useWeb3 = () => {
  const { address, isConnected } = useAppKitAccount();
  const chainId = useChainId();
  const { disconnect } = useDisconnect();
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });
  const { setUser, addNotification } = useApp();
  const { getCreatorById } = useSupabase();

  const disconnectWallet = useCallback(() => {
    disconnect();
    setUser(null);
    addNotification({
      type: "info",
      title: "Wallet Disconnected",
      message: "Successfully disconnected from wallet",
    });
  }, []);

  // Check and switch to Kaia network when connected
  useEffect(() => {
    const checkAndSwitchNetwork = async () => {
      if (isConnected && chainId && !isKaiaNetwork(chainId)) {
        console.log(`⚠️ Wrong network detected: ${chainId}. Switching to Kaia Testnet...`);
        
        const switched = await switchToKaiaTestnet();
        if (switched) {
          addNotification({
            type: "success",
            title: "Network Switched",
            message: "Successfully switched to Kaia Testnet",
          });
        } else {
          addNotification({
            type: "warning",
            title: "Wrong Network",
            message: "Please manually switch to Kaia Testnet in your wallet",
          });
        }
      }
    };

    checkAndSwitchNetwork();
  }, [isConnected, chainId]);

  useEffect(() => {
    const handleConnection = async () => {
      if (isConnected && address) {
        try {
          const existingUser = await getCreatorById(address);
          setUser(existingUser);
        } catch (error) {
          console.error("Failed to sync user data:", error);
          addNotification({
            type: "error",
            title: "Sync Failed",
            message: "Failed to sync user data with database",
          });
        }
      }
    };

    handleConnection();
  }, [isConnected, address]);

  return {
    disconnectWallet,
    writeContract,
    isPending,
    isConfirming,
    isConfirmed,
    hash,
    chainId,
    isKaiaNetwork: chainId ? isKaiaNetwork(chainId) : false,
    switchToKaiaTestnet,
  };
};
