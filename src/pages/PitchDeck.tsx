import React from "react";
import {
  Target,
  Rocket,
  Globe,
  Users,
  TrendingUp,
  Award,
  Zap,
  DollarSign,
  BookOpen,
  Star,
  CheckCircle,
  Home,
} from "lucide-react";
import Button from "../components/ui/Button";
import { useApp } from "../contexts/AppContext";

const PitchDeck: React.FC = () => {
  const { navigateTo } = useApp();
  return (
    <div className="min-h-screen cyber-hero cyber-grid">
      {/* Header */}
      <header className="sticky top-0 z-50 cyber-sidebar border-b border-cyber">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img src="/logo.png" alt="Wiza" className="h-10 w-10  rounded-lg" />
              <h1 className="text-2xl font-bold text-white neon-text-cyan">Wiza</h1>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-sm text-cyber-primary cyber-badge">Pitch Deck</div>
              <button
                onClick={() => navigateTo("/")}
                className="cyber-button flex items-center gap-2"
              >
                <span>Homepage</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-6 relative">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="cyber-badge inline-flex items-center space-x-2 mb-8">
            <Target className="w-5 h-5 text-cyber-primary" />
            <span className="text-cyber-primary font-medium">
              Strategic Objective
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Wiza Go-To-Market
            <span className="holographic">
              {" "}
              Strategy
            </span>
          </h1>
          <p className="text-xl text-slate-300 max-w-4xl mx-auto leading-relaxed">
            Launch, grow, and scale{" "}
            <strong className="text-cyber-primary neon-text-cyan">Wiza</strong> as the leading Web3
            education platform by strategically targeting learners, creators,
            and ecosystem partners. This GTM plan focuses on awareness, user
            acquisition, creator onboarding, and long-term partnerships.
          </p>
        </div>
      </section>

      {/* Phase Cards */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Phase 1 */}
            <div className="group relative">
              <div className="absolute inset-0 cyber-glow rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
              <div className="relative cyber-card p-8 quantum-float">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl flex items-center justify-center cyber-glow">
                    <Rocket className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white neon-text-cyan">
                      Phase 1: Launch
                    </h3>
                    <p className="text-cyber-primary">Mainnet Rollout</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <div className="flex items-center space-x-2 mb-3">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      <h4 className="font-semibold text-white">Goals</h4>
                    </div>
                    <ul className="space-y-2 text-slate-300 text-base">
                      <li>• Officially launch Wiza dApp on Kaia Mainnet</li>
                      <li>
                        • Drive user activity and mint real, on-chain
                        certificates
                      </li>
                      <li>
                        • Expand awareness with verified learning reputation
                        system
                      </li>
                    </ul>
                  </div>

                  <div>
                    <div className="flex items-center space-x-2 mb-3">
                      <Zap className="w-5 h-5 text-yellow-400" />
                      <h4 className="font-semibold text-white">Tactics</h4>
                    </div>
                    <ul className="space-y-2 text-slate-300 text-base">
                      <li>
                        • <strong>Mainnet XP Challenge:</strong> Complete
                        modules, mint certificates, climb leaderboard
                      </li>
                      <li>
                        • <strong>Verified NFT Certificates:</strong>{" "}
                        Tamper-proof soulbound credentials
                      </li>
                      <li>
                        • <strong>Social Quests:</strong> Twitter/X, Discord,
                        Galxe, Zealy engagement
                      </li>
                      <li>
                        • <strong>Bug Bounty Program:</strong> Incentives for
                        platform improvements
                      </li>
                    </ul>
                  </div>

                  <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-xl p-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <TrendingUp className="w-5 h-5 text-blue-400" />
                      <h4 className="font-semibold text-white">KPIs</h4>
                    </div>
                    <div className="grid grid-cols-1 gap-2 text-base">
                      <div className="flex justify-between">
                        <span className="text-slate-300">Mainnet Users</span>
                        <span className="text-blue-400 font-semibold">
                          2,000+
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-300">
                          Certificates Minted
                        </span>
                        <span className="text-blue-400 font-semibold">
                          500+
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-300">Feedback Reports</span>
                        <span className="text-blue-400 font-semibold">25+</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Phase 2 */}
            <div className="group relative">
              <div className="absolute inset-0 cyber-glow-purple rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
              <div className="relative cyber-card p-8 quantum-float">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">
                      Phase 2: Growth
                    </h3>
                    <p className="text-purple-200">Post-Mainnet Acceleration</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <div className="flex items-center space-x-2 mb-3">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      <h4 className="font-semibold text-white">Goals</h4>
                    </div>
                    <ul className="space-y-2 text-slate-300 text-base">
                      <li>
                        • Convert early users into active learners and creators
                      </li>
                      <li>
                        • Establish strong creator economy and education
                        liquidity
                      </li>
                      <li>• Introduce native token $LVN</li>
                    </ul>
                  </div>

                  <div>
                    <div className="flex items-center space-x-2 mb-3">
                      <Zap className="w-5 h-5 text-yellow-400" />
                      <h4 className="font-semibold text-white">Tactics</h4>
                    </div>
                    <ul className="space-y-2 text-slate-300 text-base">
                      <li>
                        • <strong>Creator Airdrop:</strong> Reward educators
                        deploying early courses
                      </li>
                      <li>
                        • <strong>Learn-to-Earn:</strong> Incentivize learners
                        with KAIA and LVN
                      </li>
                      <li>
                        • <strong>XP Leaderboard:</strong> Rank users by
                        progress and reward top performers
                      </li>
                      <li>
                        • <strong>Cert-to-Earn:</strong> Partner with DAOs for
                        certificate acceptance
                      </li>
                    </ul>
                  </div>

                  <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl p-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <TrendingUp className="w-5 h-5 text-purple-400" />
                      <h4 className="font-semibold text-white">KPIs</h4>
                    </div>
                    <div className="grid grid-cols-1 gap-2 text-base">
                      <div className="flex justify-between">
                        <span className="text-slate-300">Active Users</span>
                        <span className="text-purple-400 font-semibold">
                          10,000
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-300">On-chain Courses</span>
                        <span className="text-purple-400 font-semibold">
                          100+
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-300">Creator Earnings</span>
                        <span className="text-purple-400 font-semibold">
                          $50K+
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Phase 3 */}
            <div className="group relative">
              <div className="absolute inset-0 cyber-glow-green rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
              <div className="relative cyber-card p-8 quantum-float">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                    <Globe className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">
                      Phase 3: Partnerships
                    </h3>
                    <p className="text-emerald-200">Ecosystem Expansion</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <div className="flex items-center space-x-2 mb-3">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      <h4 className="font-semibold text-white">Goals</h4>
                    </div>
                    <ul className="space-y-2 text-slate-300 text-base">
                      <li>• Solidify network effects</li>
                      <li>
                        • Build integrations into hiring, bounty, and
                        credentialing protocols
                      </li>
                      <li>• Position Liven as credential layer for Web3</li>
                    </ul>
                  </div>

                  <div>
                    <div className="flex items-center space-x-2 mb-3">
                      <Zap className="w-5 h-5 text-yellow-400" />
                      <h4 className="font-semibold text-white">Tactics</h4>
                    </div>
                    <ul className="space-y-2 text-slate-300 text-base">
                      <li>
                        • <strong>DAO Partnerships:</strong> Gitcoin,
                        DeveloperDAO, TalentLayer
                      </li>
                      <li>
                        • <strong>Education Grants:</strong> Kaia, Arbitrum,
                        Optimism funding
                      </li>
                      <li>
                        • <strong>Platform Integrations:</strong> Lens,
                        Passport, Layer3
                      </li>
                      <li>
                        • <strong>Referral Program:</strong> 5-10% revenue share
                        for instructors
                      </li>
                    </ul>
                  </div>

                  <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-xl p-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <TrendingUp className="w-5 h-5 text-emerald-400" />
                      <h4 className="font-semibold text-white">KPIs</h4>
                    </div>
                    <div className="grid grid-cols-1 gap-2 text-base">
                      <div className="flex justify-between">
                        <span className="text-slate-300">Partnerships</span>
                        <span className="text-emerald-400 font-semibold">
                          10
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-300">Impressions</span>
                        <span className="text-emerald-400 font-semibold">
                          1M+
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-300">External Certs</span>
                        <span className="text-emerald-400 font-semibold">
                          1,000+
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stakeholder Documents */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-orange-500/20 to-red-500/20 backdrop-blur-sm border border-orange-500/30 rounded-full px-6 py-2 mb-6">
              <Users className="w-5 h-5 text-orange-400" />
              <span className="text-orange-200 font-medium">
                Stakeholder Resources
              </span>
            </div>
            <h2 className="text-4xl font-bold text-white mb-4">
              Documentation & Resources
            </h2>
            <p className="text-slate-300 max-w-2xl mx-auto">
              Tailored resources and documentation for each stakeholder group in
              the Liven ecosystem.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Investors */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mb-4">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                For Investors
              </h3>
              <ul className="space-y-2 text-slate-300 text-base">
                <li>• Platform vision and scalability</li>
                <li>
                  • Revenue model (creator % cut, cert minting fees, AI credits)
                </li>
                <li>• Token utility and long-term value accrual</li>
                <li>
                  • Roadmap alignment with emerging credentialing standards
                </li>
              </ul>
            </div>

            {/* Ecosystem Partners */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mb-4">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                For Ecosystem Partners
              </h3>
              <ul className="space-y-2 text-slate-300 text-base">
                <li>• API/SDK for verifying certificates</li>
                <li>• Creator wallet factory for rewards/bonuses</li>
                <li>
                  • Collaboration opportunities (skill badges, bounty boards)
                </li>
              </ul>
            </div>

            {/* Educators */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                For Educators
              </h3>
              <ul className="space-y-2 text-slate-300 text-base">
                <li>• Step-by-step onboarding guide</li>
                <li>• Revenue calculator and payout dashboard</li>
                <li>• Certificate customization tools</li>
                <li>• Marketing support via launch campaign</li>
              </ul>
            </div>

            {/* Learners */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center mb-4">
                <Star className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                For Learners
              </h3>
              <ul className="space-y-2 text-slate-300 text-base">
                <li>• Interactive learning path with XP</li>
                <li>• AI assistant onboarding tips</li>
                <li>• Wallet setup and credential preview</li>
                <li>• Rewards dashboard and leaderboard</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Summary */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-md border border-white/20 rounded-2xl p-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
                <Award className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white">
                Strategic Summary
              </h2>
            </div>
            <p className="text-lg text-slate-300 leading-relaxed">
              Liven's GTM strategy leverages{" "}
              <strong className="text-white">incentives</strong>,{" "}
              <strong className="text-white">reputation</strong>, and{" "}
              <strong className="text-white">Web3-native mechanics</strong> to
              bootstrap a powerful flywheel: learners earn, creators monetize,
              and protocols integrate. This strategy drives usage, trust, and
              ecosystem relevance.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-cyber">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <img src="/logo.png" alt="Wiza" className="h-8 w-8  rounded-lg" />
            <span className="text-xl font-bold text-white neon-text-cyan">Wiza</span>
          </div>
          <p className="text-cyber-muted">Leading Web3 Education Platform</p>
        </div>
      </footer>
    </div>
  );
};

export default PitchDeck;
