import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import ProductNFT from '../contracts/ProductNFT.json';

const SEPOLIA_CHAIN_ID = '0xaa36a7'; // Sepolia testnet chain ID in hex
const DECIMAL_CHAIN_ID = '11155111'; // Sepolia testnet chain ID in decimal

export const useContract = () => {
  const [contract, setContract] = useState(null);
  const [signer, setSigner] = useState(null);
  const [account, setAccount] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [networkError, setNetworkError] = useState(null);

  // Initialize contract and check wallet connection
  useEffect(() => {
    const initContract = async () => {
      try {
        // Check if MetaMask is installed
        if (!window.ethereum) {
          setError('MetaMask is not installed. Please install MetaMask to use this application.');
          setIsLoading(false);
          return;
        }

        // Request account access
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
        setIsConnected(true);

        // Create provider and signer
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        setSigner(signer);

        // Check network
        const network = await provider.getNetwork();
        const currentChainId = network.chainId.toString();
        if (currentChainId !== DECIMAL_CHAIN_ID) {
          setNetworkError('Please connect to Sepolia testnet');
        } else {
          setNetworkError(null);
        }

        // Initialize contract
        const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;
        const contractInstance = new ethers.Contract(
          contractAddress,
          ProductNFT.abi,
          signer
        );
        setContract(contractInstance);
      } catch (err) {
        console.error('Error initializing contract:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    initContract();

    // Only add event listeners if MetaMask is available
    if (window.ethereum) {
      // Listen for account changes
      const handleAccountsChanged = (accounts) => {
        if (accounts.length === 0) {
          // User disconnected their wallet
          setAccount(null);
          setIsConnected(false);
          setContract(null);
          setSigner(null);
        } else {
          setAccount(accounts[0]);
        }
      };

      // Listen for chain changes
      const handleChainChanged = (chainId) => {
        const chainIdDecimal = parseInt(chainId, 16).toString();
        if (chainIdDecimal !== DECIMAL_CHAIN_ID) {
          setNetworkError('Please connect to Sepolia testnet');
        } else {
          setNetworkError(null);
        }
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, []);

  // Connect wallet function
  const connectWallet = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Request account access
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setAccount(accounts[0]);
      setIsConnected(true);

      // Create provider and signer
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      setSigner(signer);

      // Check network
      const network = await provider.getNetwork();
      const currentChainId = network.chainId.toString();
      if (currentChainId !== DECIMAL_CHAIN_ID) {
        setNetworkError('Please connect to Sepolia testnet');
      } else {
        setNetworkError(null);
      }

      // Initialize contract
      const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;
      const contractInstance = new ethers.Contract(
        contractAddress,
        ProductNFT.abi,
        signer
      );
      setContract(contractInstance);
    } catch (err) {
      console.error('Error connecting wallet:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Switch to Sepolia network
  const switchToSepolia = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: SEPOLIA_CHAIN_ID }],
      });
      setNetworkError(null);
    } catch (err) {
      if (err.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: SEPOLIA_CHAIN_ID,
                chainName: 'Sepolia',
                nativeCurrency: {
                  name: 'SepoliaETH',
                  symbol: 'ETH',
                  decimals: 18
                },
                rpcUrls: ['https://sepolia.infura.io/v3/'],
                blockExplorerUrls: ['https://sepolia.etherscan.io']
              }
            ]
          });
        } catch (addError) {
          console.error('Error adding Sepolia network:', addError);
          setError(addError.message);
        }
      } else {
        console.error('Error switching network:', err);
        setError(err.message);
      }
    }
  };

  return {
    contract,
    signer,
    account,
    isConnected,
    isLoading,
    error,
    networkError,
    connectWallet,
    switchToSepolia
  };
}; 