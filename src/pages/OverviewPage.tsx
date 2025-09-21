/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { useApp } from "../contexts/AppContext";
import {
  BookOpen,
  Users,
  DollarSign,
  TrendingUp,
  Star,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
} from "lucide-react";
import { useAppKitAccount } from "@reown/appkit/react";
import { Web3Service } from "../services/web3Service";
import { wagmiAdapter } from "../config/chains";
import { formatEther } from "viem";
import { getBalance } from "@wagmi/core";
import { useSupabase } from "../hooks/useSupabase";
import { Course } from "../types";

const OverviewPage: React.FC = () => {
  const { state } = useApp();
  const { address, isConnected } = useAppKitAccount();
  const [loading, setLoading] = useState(true);
  const [walletStats, setWalletStats] = useState({
    wallet: "",
    totalETHDeposited: 0,
    totalETHWithdrawn: 0,
    totalEarnings: 0,
    availableBalance: 0,
  });
  const [topCourses, setTopCourses] = useState<Course[]>([]);
  const { getCourses } = useSupabase();

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
    if (!address) return;

    const loadAnalytics = async () => {
      setLoading(true);
      try {
        await getWalletStats();

        getCourses(1, 4, {}, address).then((data) => setTopCourses(data));
      } catch (error) {
        console.error("Failed to load analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    if (isConnected) {
      loadAnalytics();
    }
  }, []);

  if (!isConnected) {
    return (
      <div className="text-center py-16 cyber-card border-cyber rounded-xl max-w-md mx-auto">
        <BarChart3 className="h-16 w-16 mx-auto mb-4 text-cyber-primary animate-cyber-pulse" />
        <h2 className="text-2xl font-semibold mb-4 text-white font-cyber neon-text-cyan">Connect Your Wallet</h2>
        <p className="mb-6 text-cyan-100">
          You need to connect your wallet to view your <span className="text-cyber-primary font-semibold">overview</span>
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="flex items-center space-x-3">
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 border-4 border-cyber-primary/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-cyber-primary border-t-transparent rounded-full animate-spin"></div>
            <div className="absolute inset-2 border-2 border-neon-cyan/30 rounded-full animate-spin animate-reverse"></div>
          </div>
          <span className="text-lg text-white font-cyber">Loading overview...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Cyber Welcome Section */}
      <div className="cyber-card border-cyber hover:cyber-glow transition-all duration-500 rounded-2xl p-8 relative overflow-hidden">
        {/* Holographic Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyber-primary/10 via-neon-cyan/5 to-cyber-secondary/10 animate-holographic"></div>
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyber-primary to-transparent animate-data-stream"></div>
        
        <div className="relative z-10">
          {/* Cyber Badge */}
          <div className="inline-flex items-center space-x-2 cyber-badge mb-4">
            <div className="w-2 h-2 bg-cyber-primary rounded-full animate-cyber-pulse"></div>
            <span className="text-cyber-primary font-cyber text-sm font-semibold neon-text-cyan">DASHBOARD OVERVIEW</span>
          </div>
          
          <h1 className="text-3xl font-bold mb-2 text-white font-cyber neon-text-cyan">
            Welcome back, <span className="text-cyber-primary">{state.user?.name}</span>!
          </h1>
          <p className="text-cyan-100 mb-6 font-semibold">
            Here's how your <span className="text-neon-orange font-bold">courses</span> are performing 
            <span className="text-cyber-primary"> today</span>.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="cyber-card border-cyber/50 hover:cyber-glow group transition-all duration-300 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-neon-orange/20 group-hover:bg-neon-orange/30 transition-colors">
                  <DollarSign className="h-8 w-8 text-neon-orange animate-cyber-pulse" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white font-cyber neon-text-orange">
                    {walletStats.totalEarnings} KAIA
                  </p>
                  <p className="text-sm text-cyan-100 font-cyber">Total Revenue</p>
                </div>
              </div>
            </div>
            <div className="cyber-card border-cyber/50 hover:cyber-glow group transition-all duration-300 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-cyber-primary/20 group-hover:bg-cyber-primary/30 transition-colors">
                  <Users className="h-8 w-8 text-cyber-primary animate-cyber-pulse" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white font-cyber neon-text-cyan">
                    {state.user?.totalStudents}
                  </p>
                  <p className="text-sm text-cyan-100 font-cyber">Total Students</p>
                </div>
              </div>
            </div>
            <div className="cyber-card border-cyber/50 hover:cyber-glow group transition-all duration-300 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-neon-green/20 group-hover:bg-neon-green/30 transition-colors">
                  <BookOpen className="h-8 w-8 text-neon-green animate-cyber-pulse" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white font-cyber neon-text-green">{state.user?.totalCourses}</p>
                  <p className="text-sm text-cyan-100 font-cyber">Active Courses</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cyber Key Metrics */}
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
            <h2 className="text-2xl font-bold text-white font-cyber neon-text-cyan">📊 Key Metrics</h2>
          <div className="flex-1 h-px bg-gradient-to-r from-cyber-primary via-transparent to-cyber-primary"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="cyber-card border-cyber hover:cyber-glow transition-all duration-300 rounded-xl p-6 group">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-neon-green/20 group-hover:bg-neon-green/30 transition-colors">
                <TrendingUp className="h-6 w-6 text-neon-green animate-cyber-pulse" />
              </div>
              <span className="text-sm text-neon-green font-cyber font-semibold flex items-center neon-text-green">
                <ArrowUpRight className="h-4 w-4 mr-1 animate-cyber-pulse" />
                +12%
              </span>
            </div>
            <p className="text-2xl font-bold text-white mb-1 font-cyber neon-text-green">
              {walletStats.totalEarnings} KAIA
            </p>
            <p className="text-sm text-cyan-100 font-cyber">Earnings</p>
          </div>

          <div className="cyber-card border-cyber hover:cyber-glow transition-all duration-300 rounded-xl p-6 group">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-cyber-primary/20 group-hover:bg-cyber-primary/30 transition-colors">
                <Users className="h-6 w-6 text-cyber-primary animate-cyber-pulse" />
              </div>
              <span className="text-sm text-cyber-primary font-cyber font-semibold flex items-center neon-text-cyan">
                <ArrowUpRight className="h-4 w-4 mr-1 animate-cyber-pulse" />
                +8%
              </span>
            </div>
            <p className="text-2xl font-bold text-white mb-1 font-cyber neon-text-cyan">
              {state.user?.totalStudents}
            </p>
            <p className="text-sm text-cyan-100 font-cyber">New Students</p>
          </div>

          <div className="cyber-card border-cyber hover:cyber-glow transition-all duration-300 rounded-xl p-6 group">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-neon-orange/20 group-hover:bg-neon-orange/30 transition-colors">
                <Star className="h-6 w-6 text-neon-orange animate-cyber-pulse" />
              </div>
              <span className="text-sm text-neon-orange font-cyber font-semibold flex items-center neon-text-orange">
                <ArrowUpRight className="h-4 w-4 mr-1 animate-cyber-pulse" />
                +0.1
              </span>
            </div>
            <p className="text-2xl font-bold text-white mb-1 font-cyber neon-text-orange">
              {state.user?.rating?.toFixed(2)}
            </p>
            <p className="text-sm text-cyan-100 font-cyber">Average Rating</p>
          </div>

          <div className="cyber-card border-cyber hover:cyber-glow transition-all duration-300 rounded-xl p-6 group">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-cyber-secondary/20 group-hover:bg-cyber-secondary/30 transition-colors">
                <Target className="h-6 w-6 text-cyber-secondary animate-cyber-pulse" />
              </div>
              <span className="text-sm text-red-400 font-cyber font-semibold flex items-center">
                <ArrowDownRight className="h-4 w-4 mr-1 animate-cyber-pulse" />
                -2%
              </span>
            </div>
            <p className="text-2xl font-bold text-white mb-1 font-cyber neon-text-purple">87%</p>
            <p className="text-sm text-cyan-100 font-cyber">Completion Rate</p>
          </div>
        </div>
      </div>

      {/* Cyber Top Courses */}
      <div className="cyber-card border-cyber hover:cyber-glow transition-all duration-500 rounded-xl p-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyber-primary/50 to-transparent"></div>
        
        <div className="relative z-10">
          <div className="flex items-center space-x-4 mb-6">
            <h3 className="text-lg font-semibold text-white font-cyber neon-text-cyan">
              🚀 Top Performing Courses
            </h3>
            <div className="flex-1 h-px bg-gradient-to-r from-cyber-primary via-transparent to-cyber-primary"></div>
          </div>
          <div className="space-y-4">
            {topCourses?.map((course: any, index: number) => (
              <div key={index} className="flex items-center justify-between cyber-card border-cyber/30 rounded-lg p-4 hover:cyber-glow transition-all duration-300">
                <div>
                  <h4 className="font-medium text-white font-cyber neon-text-cyan">{course.title}</h4>
                  <p className="text-sm text-cyan-100">
                    <span className="text-cyber-primary font-semibold">{course.totalStudents}</span> students
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-neon-orange font-cyber neon-text-orange">
                    {course.price} KAIA
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="cyber-card border-cyber hover:cyber-glow transition-all duration-500 rounded-xl p-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyber-primary/50 to-transparent"></div>
        
        <div className="relative z-10">
          <div className="flex items-center space-x-4 mb-6">
            <h3 className="text-lg font-semibold text-white font-cyber neon-text-cyan">
              ⚡ Quick Actions
            </h3>
            <div className="flex-1 h-px bg-gradient-to-r from-cyber-primary via-transparent to-cyber-primary"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="flex items-center space-x-3 p-4 text-left cyber-card border-cyber/50 hover:cyber-glow rounded-lg transition-all duration-300 group">
              <div className="p-2 rounded-lg bg-cyber-primary/20 group-hover:bg-cyber-primary/30 transition-colors">
                <BookOpen className="h-8 w-8 text-cyber-primary animate-cyber-pulse" />
              </div>
              <div>
                <h4 className="font-medium text-white font-cyber neon-text-cyan">Create New Course</h4>
                <p className="text-sm text-cyan-100">
                  Start building your next <span className="text-cyber-primary font-semibold">course</span>
                </p>
              </div>
            </button>
            <button className="flex items-center space-x-3 p-4 text-left cyber-card border-cyber/50 hover:cyber-glow rounded-lg transition-all duration-300 group">
              <div className="p-2 rounded-lg bg-neon-orange/20 group-hover:bg-neon-orange/30 transition-colors">
                <BarChart3 className="h-8 w-8 text-neon-orange animate-cyber-pulse" />
              </div>
              <div>
                <h4 className="font-medium text-white font-cyber neon-text-orange">View Analytics</h4>
                <p className="text-sm text-cyan-100">
                  Detailed <span className="text-neon-orange font-semibold">performance insights</span>
                </p>
              </div>
            </button>
            <button className="flex items-center space-x-3 p-4 text-left cyber-card border-cyber/50 hover:cyber-glow rounded-lg transition-all duration-300 group">
              <div className="p-2 rounded-lg bg-neon-green/20 group-hover:bg-neon-green/30 transition-colors">
                <Users className="h-8 w-8 text-neon-green animate-cyber-pulse" />
              </div>
              <div>
                <h4 className="font-medium text-white font-cyber neon-text-green">Engage Students</h4>
                <p className="text-sm text-cyan-100">
                  Connect with your <span className="text-neon-green font-semibold">community</span>
                </p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewPage;
