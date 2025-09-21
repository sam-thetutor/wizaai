import { switchChain } from '@wagmi/core';
import { wagmiAdapter } from '../config/chains';

export const KAIA_TESTNET_CHAIN_ID = 1001;
export const KAIA_MAINNET_CHAIN_ID = 8217;

export const switchToKaiaTestnet = async () => {
  try {
    await switchChain(wagmiAdapter.wagmiConfig, { chainId: KAIA_TESTNET_CHAIN_ID });
    console.log('✅ Switched to Kaia Testnet');
    return true;
  } catch (error) {
    console.error('❌ Failed to switch to Kaia Testnet:', error);
    
    // Try to add the network if it doesn't exist
    if (error instanceof Error && error.message.includes('4902')) {
      try {
        await addKaiaTestnetToWallet();
        await switchChain(wagmiAdapter.wagmiConfig, { chainId: KAIA_TESTNET_CHAIN_ID });
        return true;
      } catch (addError) {
        console.error('❌ Failed to add Kaia Testnet:', addError);
        return false;
      }
    }
    return false;
  }
};

export const addKaiaTestnetToWallet = async () => {
  if (!window.ethereum) {
    throw new Error('No wallet detected');
  }

  try {
    await window.ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [{
        chainId: `0x${KAIA_TESTNET_CHAIN_ID.toString(16)}`,
        chainName: 'Kaia Testnet',
        nativeCurrency: {
          name: 'KAIA',
          symbol: 'KAIA',
          decimals: 18
        },
        rpcUrls: ['https://public-en-kairos.node.kaia.io'],
        blockExplorerUrls: ['https://kairos.kaiascope.com']
      }]
    });
    console.log('✅ Kaia Testnet added to wallet');
    return true;
  } catch (error) {
    console.error('❌ Failed to add Kaia Testnet to wallet:', error);
    return false;
  }
};

export const getCurrentChainId = async (): Promise<number> => {
  if (!window.ethereum) {
    return 0;
  }
  
  try {
    const chainId = await window.ethereum.request({ method: 'eth_chainId' });
    return parseInt(chainId, 16);
  } catch (error) {
    console.error('Failed to get chain ID:', error);
    return 0;
  }
};

export const isKaiaNetwork = (chainId: number): boolean => {
  return chainId === KAIA_TESTNET_CHAIN_ID || chainId === KAIA_MAINNET_CHAIN_ID;
};
