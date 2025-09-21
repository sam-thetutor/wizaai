import React, { useState, useEffect } from "react";
import { useAppKitAccount } from "@reown/appkit/react";
import { useApp } from "../contexts/AppContext";
import { useSupabase } from "../hooks/useSupabase";
import { useWeb3 } from "../hooks/useWeb3";
import Button from "../components/ui/Button";
import {
  Wallet,
  Copy,
  ExternalLink,
  ArrowUpRight,
  ArrowDownLeft,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Download,
  Send,
  Plus,
  CreditCard,
  Shield,
} from "lucide-react";
import { Transaction } from "../types";
import { Web3Service } from "../services/web3Service";
import { formatEther, parseEther } from "viem";
import { getBalance } from "@wagmi/core";
import { wagmiAdapter } from "../config/chains";

const WalletPage: React.FC = () => {
  const { addNotification } = useApp();
  const { address, isConnected } = useAppKitAccount();
  const { isPending } = useWeb3();
  const { getUserTransactions, createTransaction } = useSupabase();
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [depositAmount, setDepositAmount] = useState("");
  const [walletStats, setWalletStats] = useState({
    wallet: "",
    totalETHDeposited: 0,
    totalETHWithdrawn: 0,
    totalEarnings: 0,
    availableBalance: 0,
  });
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const getWalletStats = async () => {
    if (!address) return;

    const wallet = await Web3Service.getWallet(address);

    // Check if wallet exists (not zero address)
    const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
    if (wallet === ZERO_ADDRESS) {
      // User doesn't have a wallet yet - set default values
      setWalletStats({
        wallet: "",
        totalETHDeposited: 0,
        totalETHWithdrawn: 0,
        totalEarnings: 0,
        availableBalance: 0,
      });
      return;
    }

    const { value: ethBalance } = await getBalance(wagmiAdapter.wagmiConfig, {
      address: wallet as `0x${string}`,
    });

    const stats = await Web3Service.getSummary(wallet);

    setWalletStats({
      wallet,
      totalETHDeposited: Number(formatEther(stats.totalETHDeposited)),
      totalETHWithdrawn: Number(formatEther(stats.totalETHWithdrawn)),
      totalEarnings: Number(formatEther(stats.totalEarnings)),
      availableBalance: Number(formatEther(ethBalance)),
    });
  };

  useEffect(() => {
    const loadWalletData = async () => {
      if (!address) return;

      setLoading(true);
      try {
        await getWalletStats();

        const transactionData = await getUserTransactions(address);
        setTransactions(transactionData);
      } catch (error) {
        console.error("Failed to load wallet data:", error);
        addNotification({
          type: "error",
          title: "Loading Failed",
          message: "Failed to load wallet data",
        });
      } finally {
        setLoading(false);
      }
    };

    loadWalletData();
  }, []);

  const handleWithdraw = async () => {
    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) {
      addNotification({
        type: "error",
        title: "Invalid Amount",
        message: "Please enter a valid withdrawal amount",
      });
      return;
    }

    if (parseFloat(withdrawAmount) > walletStats.availableBalance) {
      addNotification({
        type: "error",
        title: "Insufficient Balance",
        message: "Withdrawal amount exceeds available balance",
      });
      return;
    }

    try {
      const txHash = await Web3Service.withdrawETH(
        walletStats.wallet,
        parseEther(withdrawAmount)
      );

      // Create withdrawal transaction
      await createTransaction({
        userId: address!,
        type: "withdrawal",
        amount: parseFloat(withdrawAmount),
        description: "Withdrawal to external wallet",
        status: "completed",
        txHash,
      });

      getWalletStats();

      const transactionData = await getUserTransactions(address!);
      setTransactions(transactionData);

      setShowWithdrawModal(false);
      setWithdrawAmount("");

      addNotification({
        type: "success",
        title: "Withdrawal Initiated",
        message: `${withdrawAmount} KAIA withdrawal has been initiated`,
      });
    } catch (error) {
      addNotification({
        type: "error",
        title: "Withdrawal Failed",
        message: "Failed to process withdrawal. Please try again.",
      });
    }
  };

  const handleDeposit = async () => {
    if (!depositAmount || parseFloat(depositAmount) <= 0) {
      addNotification({
        type: "error",
        title: "Invalid Amount",
        message: "Please enter a valid deposit amount",
      });
      return;
    }

    try {
      const txHash = await Web3Service.depositETH(
        walletStats.wallet,
        parseEther(depositAmount)
      );

      // Create deposit transaction
      await createTransaction({
        userId: address!,
        type: "deposit",
        amount: parseFloat(depositAmount),
        description: "Deposit from external wallet",
        status: "completed",
        txHash,
      });

      getWalletStats();

      const transactionData = await getUserTransactions(address!);
      setTransactions(transactionData);

      setShowDepositModal(false);
      setDepositAmount("");

      addNotification({
        type: "success",
        title: "Deposit Initiated",
        message: `${depositAmount} KAIA deposit has been initiated`,
      });
    } catch (error) {
      addNotification({
        type: "error",
        title: "Deposit Failed",
        message: "Failed to process deposit. Please try again.",
      });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    addNotification({
      type: "success",
      title: "Copied!",
      message: "Address copied to clipboard",
    });
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "earning":
        return <ArrowDownLeft className="h-4 w-4 text-green-600" />;
      case "withdrawal":
        return <ArrowUpRight className="h-4 w-4 text-blue-600" />;
      case "deposit":
        return <ArrowDownLeft className="h-4 w-4 text-purple-600" />;
      case "fee":
        return <DollarSign className="h-4 w-4 text-orange-600" />;
      default:
        return <DollarSign className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case "failed":
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  if (!isConnected) {
    return (
      <div className="text-center py-16 cyber-card border-cyber rounded-xl max-w-md mx-auto">
        <Wallet className="h-16 w-16 mx-auto mb-4 text-cyber-primary animate-cyber-pulse" />
        <h2 className="text-2xl font-semibold mb-4 text-white font-cyber neon-text-cyan">Connect Your Wallet</h2>
        <p className="mb-6 text-cyan-100">
          You need to connect your wallet to view <span className="text-cyber-primary font-semibold">wallet information</span>
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Cyber Wallet Overview */}
      <div className="cyber-card border-cyber hover:cyber-glow transition-all duration-500 rounded-2xl p-8 relative overflow-hidden">
        {/* Holographic Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyber-primary/10 via-neon-cyan/5 to-cyber-secondary/10 animate-holographic"></div>
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyber-primary to-transparent animate-data-stream"></div>
        
        {loading ? (
          <div className="relative z-10 flex items-center justify-center py-8">
            <div className="relative w-12 h-12">
              <div className="absolute inset-0 border-4 border-cyber-primary/20 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-cyber-primary border-t-transparent rounded-full animate-spin"></div>
              <div className="absolute inset-2 border-2 border-neon-cyan/30 rounded-full animate-spin animate-reverse"></div>
            </div>
          </div>
        ) : (
          <>
            <div className="relative z-10 flex items-center justify-between mb-6">
              <div>
                {/* Cyber Badge */}
                <div className="inline-flex items-center space-x-2 cyber-badge mb-4">
                  <div className="w-2 h-2 bg-cyber-primary rounded-full animate-cyber-pulse"></div>
                  <span className="text-cyber-primary font-cyber text-sm font-semibold neon-text-cyan">WALLET OVERVIEW</span>
                </div>
                
                <h2 className="text-2xl font-bold mb-2 text-white font-cyber neon-text-cyan">Total Balance</h2>
                <p className="text-4xl font-bold text-cyber-primary neon-text-cyan font-cyber">
                  {walletStats.availableBalance.toLocaleString()} KAIA
                </p>
                <p className="text-cyan-100 mt-2 font-semibold">
                  ≈ $<span className="text-neon-orange">{(walletStats.availableBalance * 0.074624).toLocaleString()}</span> USD
                </p>
              </div>
              <div className="p-4 cyber-card border-cyber/50 rounded-xl group hover:cyber-glow transition-all duration-300">
                <Wallet className="h-12 w-12 text-cyber-primary animate-cyber-pulse" />
              </div>
            </div>

            <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="cyber-card border-cyber/50 hover:cyber-glow transition-all duration-300 rounded-lg p-4 group">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-6 w-6 text-neon-green animate-cyber-pulse" />
                  <div>
                    <p className="text-lg font-semibold text-white font-cyber">
                      {walletStats.availableBalance.toLocaleString()} KAIA
                    </p>
                    <p className="text-sm text-cyan-100 font-cyber">Available Balance</p>
                  </div>
                </div>
              </div>
              <div className="cyber-card border-cyber/50 hover:cyber-glow transition-all duration-300 rounded-lg p-4 group">
                <div className="flex items-center space-x-3">
                  <Clock className="h-6 w-6 text-neon-orange animate-cyber-pulse" />
                  <div>
                    <p className="text-lg font-semibold text-white font-cyber">{0} KAIA</p>
                    <p className="text-sm text-cyan-100 font-cyber">Pending Balance</p>
                  </div>
                </div>
              </div>
              <div className="cyber-card border-cyber/50 hover:cyber-glow transition-all duration-300 rounded-lg p-4 group">
                <div className="flex items-center space-x-3">
                  <TrendingUp className="h-6 w-6 text-cyber-primary animate-cyber-pulse" />
                  <div>
                    <p className="text-lg font-semibold text-white font-cyber">
                      {walletStats.totalETHDeposited.toLocaleString()} KAIA
                    </p>
                    <p className="text-sm text-cyan-100 font-cyber">Deposited</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Wallet Address */}
      <div className="cyber-card border-cyber hover:cyber-glow transition-all duration-500 rounded-xl p-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyber-primary/50 to-transparent"></div>
        
        <div className="relative z-10">
          <div className="flex items-center space-x-4 mb-6">
            <h3 className="text-lg font-semibold text-white font-cyber neon-text-cyan">
              🔗 Wallet Address
            </h3>
            <div className="flex-1 h-px bg-gradient-to-r from-cyber-primary via-transparent to-cyber-primary"></div>
          </div>
          
          <div className="flex items-center justify-between p-4 cyber-card border-cyber/50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-cyber-primary/20 rounded-lg">
                <Wallet className="h-5 w-5 text-cyber-primary animate-cyber-pulse" />
              </div>
              <div>
                <p className="font-mono text-sm text-white font-cyber">
                  {formatAddress(walletStats.wallet || "")}
                </p>
                <p className="text-xs text-cyan-100 font-cyber">Kaia Testnet</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => copyToClipboard(walletStats.wallet || "")}
                className="p-2 cyber-card border-cyber/50 hover:cyber-glow text-cyber-primary rounded-lg transition-all duration-300"
              >
                <Copy className="h-4 w-4 animate-cyber-pulse" />
              </button>
              <a
                href={`https://kairos.kaiascope.com/account/${walletStats.wallet}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 cyber-card border-cyber/50 hover:cyber-glow text-cyber-primary rounded-lg transition-all duration-300"
              >
                <ExternalLink className="h-4 w-4 animate-cyber-pulse" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-bold text-white font-cyber neon-text-cyan">⚡ Quick Actions</h2>
          <div className="flex-1 h-px bg-gradient-to-r from-cyber-primary via-transparent to-cyber-primary"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button
            onClick={() => setShowDepositModal(true)}
            className="cyber-card border-cyber hover:cyber-glow hover:scale-105 transition-all duration-300 rounded-xl p-6 text-left group"
          >
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-neon-green/20 group-hover:bg-neon-green/30 rounded-lg transition-colors">
                <Plus className="h-6 w-6 text-neon-green animate-cyber-pulse" />
              </div>
              <div>
                <h3 className="font-semibold text-white font-cyber neon-text-green">Deposit Funds</h3>
                <p className="text-sm text-cyan-100">Add KAIA to your wallet</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => setShowWithdrawModal(true)}
            className="cyber-card border-cyber hover:cyber-glow hover:scale-105 transition-all duration-300 rounded-xl p-6 text-left group"
          >
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-cyber-primary/20 group-hover:bg-cyber-primary/30 rounded-lg transition-colors">
                <Send className="h-6 w-6 text-cyber-primary animate-cyber-pulse" />
              </div>
              <div>
                <h3 className="font-semibold text-white font-cyber neon-text-cyan">Withdraw Funds</h3>
                <p className="text-sm text-cyan-100">
                  Send KAIA to external wallet
                </p>
              </div>
            </div>
          </button>

          <button className="cyber-card border-cyber hover:cyber-glow hover:scale-105 transition-all duration-300 rounded-xl p-6 text-left group">
            <a
              href="https://coinmarketcap.com/currencies/kaia/"
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-neon-orange/20 group-hover:bg-neon-orange/30 rounded-lg transition-colors">
                  <CreditCard className="h-6 w-6 text-neon-orange animate-cyber-pulse" />
                </div>
                <div>
                  <h3 className="font-semibold text-white font-cyber neon-text-orange">Buy KAIA</h3>
                  <p className="text-sm text-cyan-100">Purchase from exchange</p>
                </div>
              </div>
            </a>
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-bold text-white font-cyber neon-text-cyan">📊 Statistics</h2>
          <div className="flex-1 h-px bg-gradient-to-r from-cyber-primary via-transparent to-cyber-primary"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="cyber-card border-cyber hover:cyber-glow transition-all duration-300 rounded-xl p-6 group">
            <div className="flex items-center space-x-3">
              <div className="p-3 rounded-lg bg-neon-green/20 group-hover:bg-neon-green/30 transition-colors">
                <TrendingUp className="h-6 w-6 text-neon-green animate-cyber-pulse" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white font-cyber neon-text-green">
                  {walletStats.totalEarnings} KAIA
                </p>
                <p className="text-sm text-cyan-100 font-cyber">Total Earnings</p>
              </div>
            </div>
          </div>

          <div className="cyber-card border-cyber hover:cyber-glow transition-all duration-300 rounded-xl p-6 group">
            <div className="flex items-center space-x-3">
              <div className="p-3 rounded-lg bg-cyber-primary/20 group-hover:bg-cyber-primary/30 transition-colors">
                <ArrowUpRight className="h-6 w-6 text-cyber-primary animate-cyber-pulse" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white font-cyber neon-text-cyan">
                  {walletStats.totalETHWithdrawn} KAIA
                </p>
                <p className="text-sm text-cyan-100 font-cyber">Total Withdrawals</p>
              </div>
            </div>
          </div>

          <div className="cyber-card border-cyber hover:cyber-glow transition-all duration-300 rounded-xl p-6 group">
            <div className="flex items-center space-x-3">
              <div className="p-3 rounded-lg bg-neon-orange/20 group-hover:bg-neon-orange/30 transition-colors">
                <Shield className="h-6 w-6 text-neon-orange animate-cyber-pulse" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white font-cyber neon-text-orange">100%</p>
                <p className="text-sm text-cyan-100 font-cyber">Security Score</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction History */}
      <div className="cyber-card border-cyber hover:cyber-glow transition-all duration-500 rounded-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyber-primary to-transparent animate-data-stream"></div>
        
        <div className="p-6 border-b border-cyber relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h3 className="text-lg font-semibold text-white font-cyber neon-text-cyan">
                📜 Transaction History
              </h3>
              <div className="flex-1 h-px bg-gradient-to-r from-cyber-primary via-transparent to-cyber-primary"></div>
            </div>
            <button className="cyber-gradient-button cyber-glow px-4 py-2 rounded-lg font-cyber text-sm transition-all duration-300 hover:scale-105">
              <Download className="h-4 w-4 mr-2 animate-cyber-pulse" />
              Export
            </button>
          </div>
        </div>

        <div className="overflow-x-auto relative z-10">
          <table className="w-full">
            <thead className="cyber-card border-b border-cyber">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-cyber font-semibold text-cyber-primary uppercase tracking-wider neon-text-cyan">
                  🔄 Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-cyber font-semibold text-cyber-primary uppercase tracking-wider neon-text-cyan">
                  📝 Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-cyber font-semibold text-cyber-primary uppercase tracking-wider neon-text-cyan">
                  💰 Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-cyber font-semibold text-cyber-primary uppercase tracking-wider neon-text-cyan">
                  📊 Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-cyber font-semibold text-cyber-primary uppercase tracking-wider neon-text-cyan">
                  📅 Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-cyber font-semibold text-cyber-primary uppercase tracking-wider neon-text-cyan">
                  🔗 Transaction
                </th>
              </tr>
            </thead>
            <tbody className="cyber-card divide-y divide-cyber/30">
              {transactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-cyber-primary/5 transition-colors duration-300">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {getTransactionIcon(transaction.type)}
                      <span className="text-sm font-medium text-white capitalize font-cyber">
                        {transaction.type}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm text-white font-cyber">
                        {transaction.description}
                      </p>
                      {transaction.courseTitle && (
                        <p className="text-xs text-cyan-100">
                          {transaction.courseTitle}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`text-sm font-medium font-cyber ${
                        transaction.type === "earning" ||
                        transaction.type === "deposit"
                          ? "text-neon-green neon-text-green"
                          : transaction.type === "withdrawal"
                          ? "text-cyber-primary neon-text-cyan"
                          : "text-neon-orange neon-text-orange"
                      }`}
                    >
                      {transaction.type === "earning" ||
                      transaction.type === "deposit"
                        ? "+"
                        : "-"}
                      {transaction.amount} {transaction.currency}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(transaction.status)}
                      <span
                        className={`text-sm capitalize font-cyber ${
                          transaction.status === "completed"
                            ? "text-neon-green"
                            : transaction.status === "pending"
                            ? "text-neon-orange"
                            : "text-red-400"
                        }`}
                      >
                        {transaction.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-cyan-100 font-cyber">
                    {transaction.date.toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {transaction.txHash ? (
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-mono text-cyber-primary neon-text-cyan">
                          {formatAddress(transaction.txHash)}
                        </span>
                        <button
                          onClick={() => copyToClipboard(transaction.txHash!)}
                          className="p-1 cyber-card border-cyber/50 hover:cyber-glow rounded transition-all duration-300"
                        >
                          <Copy className="h-3 w-3 text-cyber-primary animate-cyber-pulse" />
                        </button>
                        <a
                          href={`https://kairos.kaiascope.com/tx/${transaction.txHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1 cyber-card border-cyber/50 hover:cyber-glow rounded transition-all duration-300"
                        >
                          <ExternalLink className="h-3 w-3 text-cyber-primary animate-cyber-pulse" />
                        </a>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400 font-cyber">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {transactions.length === 0 && (
          <div className="text-center py-12 relative z-10">
            <DollarSign className="h-12 w-12 mx-auto mb-4 text-cyber-primary animate-cyber-pulse" />
            <p className="text-cyan-100 font-cyber">💳 No transactions yet</p>
          </div>
        )}
      </div>

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900/95 backdrop-blur-xl border border-cyan-500/30 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-white">
                  Withdraw Funds
                </h3>
                <p className="text-sm text-slate-400 mt-1">Transfer KAIA to your wallet</p>
              </div>
              <button
                onClick={() => setShowWithdrawModal(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Available Balance */}
            <div className="bg-slate-800/50 border border-cyan-500/20 rounded-lg p-4 mb-6">
              <p className="text-sm text-cyan-400 mb-1">Available Balance</p>
              <p className="text-2xl font-bold text-white">
                {walletStats.availableBalance.toLocaleString()} <span className="text-cyan-400">KAIA</span>
              </p>
            </div>

            {/* Form */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Withdrawal Amount (KAIA)
              </label>
              <input
                type="number"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                className="w-full px-4 py-3 bg-slate-800/50 border border-cyan-500/30 rounded-lg text-white placeholder-slate-400 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/20"
                placeholder="0.00"
                max={walletStats.availableBalance}
                step="0.01"
              />
              <div className="flex items-center mt-3 text-xs text-slate-400">
                <Shield className="h-4 w-4 mr-2 text-cyan-400" />
                Destination: <span className="text-cyan-400 ml-1">{formatAddress(address || "")}</span>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex space-x-3">
              <button
                onClick={handleWithdraw}
                disabled={isPending}
                className="flex-1 px-4 py-2 text-sm font-semibold rounded-lg border-2 border-cyber-primary/50 text-cyber-primary hover:bg-cyber-primary/10 hover:border-cyber-primary hover:shadow-cyber transition-all duration-300 backdrop-blur-sm disabled:opacity-50"
              >
                {isPending ? (
                  <div className="flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin mr-2"></div>
                    Processing...
                  </div>
                ) : (
                  "Withdraw"
                )}
              </button>
              <button
                onClick={() => setShowWithdrawModal(false)}
                className="flex-1 px-4 py-2 text-sm font-semibold rounded-lg border-2 border-cyber-primary/50 text-cyber-primary hover:bg-cyber-primary/10 hover:border-cyber-primary hover:shadow-cyber transition-all duration-300 backdrop-blur-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Deposit Modal */}
      {showDepositModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900/95 backdrop-blur-xl border border-cyan-500/30 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-white">
                  Deposit Funds
                </h3>
                <p className="text-sm text-slate-400 mt-1">Add KAIA to your platform wallet</p>
              </div>
              <button
                onClick={() => setShowDepositModal(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Form */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Deposit Amount (KAIA)
              </label>
              <input
                type="number"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                className="w-full px-4 py-3 bg-slate-800/50 border border-cyan-500/30 rounded-lg text-white placeholder-slate-400 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/20"
                placeholder="0.00"
                step="0.01"
              />
              <div className="flex items-center mt-3 text-xs text-slate-400">
                <Shield className="h-4 w-4 mr-2 text-cyan-400" />
                Send to: <span className="text-cyan-400 ml-1">{formatAddress(address || "")}</span>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex space-x-3">
              <button
                onClick={handleDeposit}
                disabled={isPending}
                className="flex-1 px-4 py-2 text-sm font-semibold rounded-lg border-2 border-cyber-primary/50 text-cyber-primary hover:bg-cyber-primary/10 hover:border-cyber-primary hover:shadow-cyber transition-all duration-300 backdrop-blur-sm disabled:opacity-50"
              >
                {isPending ? (
                  <div className="flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin mr-2"></div>
                    Processing...
                  </div>
                ) : (
                  "Confirm Deposit"
                )}
              </button>
              <button
                onClick={() => setShowDepositModal(false)}
                className="flex-1 px-4 py-2 text-sm font-semibold rounded-lg border-2 border-cyber-primary/50 text-cyber-primary hover:bg-cyber-primary/10 hover:border-cyber-primary hover:shadow-cyber transition-all duration-300 backdrop-blur-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletPage;
