import React, { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Code,
  Database,
  Cpu,
  Cloud,
  Zap,
  Globe,
  Rocket,
  Target,
  Home,
} from "lucide-react";
import { useApp } from "../contexts/AppContext";

const TechnicalDocs: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      title: "Project Overview",
      subtitle: "Wi – Web3 Education Platform",
      icon: <Target className="w-8 h-8" />,
      content: (
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white neon-text-cyan">
                Key Features
              </h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-slate-300">On-chain verifiable learning platform</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-slate-300">Built on Kaia Mainnet</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-slate-300">ERC751-style credentials with AI-powered learning</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-slate-300">Borderless payment system</span>
                </li>
              </ul>
            </div>
            <div className="cyber-stat-card p-6 rounded-xl">
              <h3 className="text-xl font-semibold text-white neon-text-purple mb-4">
                Tech Stack
              </h3>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <Code className="w-5 h-5 text-blue-600" />
                  <span className="text-slate-300">Solidity Smart Contracts</span>
                </div>
                <div className="flex items-center gap-3">
                  <Database className="w-5 h-5 text-green-600" />
                  <span className="text-slate-300">Supabase Backend</span>
                </div>
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-purple-600" />
                  <span className="text-slate-300">React Frontend</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 2,
      title: "System Architecture Overview",
      subtitle: "High-level system design and component interactions",
      icon: <Cpu className="w-8 h-8" />,
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-8 rounded-xl">
            <div className="text-center space-y-6">
              <div className="flex justify-center items-center space-x-8 flex-wrap gap-4">
                <div className="bg-white p-4 rounded-lg shadow-md min-w-[150px]">
                  <Globe className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                  <div className="text-sm font-medium">Frontend</div>
                  <div className="text-xs text-gray-600">
                    React + TypeScript
                  </div>
                </div>
                <ChevronRight className="w-6 h-6 text-gray-400" />
                <div className="bg-white p-4 rounded-lg shadow-md min-w-[150px]">
                  <Database className="w-8 h-8 mx-auto mb-2 text-green-600" />
                  <div className="text-sm font-medium">Backend</div>
                  <div className="text-xs text-gray-600">Supabase</div>
                </div>
                <ChevronRight className="w-6 h-6 text-gray-400" />
                <div className="bg-white p-4 rounded-lg shadow-md min-w-[150px]">
                  <Code className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                  <div className="text-sm font-medium">Smart Contracts</div>
                  <div className="text-xs text-gray-600">Solidity</div>
                </div>
              </div>
              <div className="flex justify-center">
                <ChevronRight className="w-6 h-6 text-gray-400 rotate-90" />
              </div>
              <div className="flex justify-center space-x-8 flex-wrap gap-4">
                <div className="bg-white p-4 rounded-lg shadow-md min-w-[150px]">
                  <Cloud className="w-8 h-8 mx-auto mb-2 text-orange-600" />
                  <div className="text-sm font-medium">Kaia Mainnet</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-md min-w-[150px]">
                  <Zap className="w-8 h-8 mx-auto mb-2 text-yellow-600" />
                  <div className="text-sm font-medium">OpenAI API</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-md min-w-[150px]">
                  <Database className="w-8 h-8 mx-auto mb-2 text-indigo-600" />
                  <div className="text-sm font-medium">IPFS Storage</div>
                  <div className="text-xs text-gray-600">(Future)</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 3,
      title: "Smart Contract Design – Liven.sol",
      subtitle: "Main contract for certificate issuance and wallet management",
      icon: <Code className="w-8 h-8" />,
      content: (
        <div className="space-y-6">
          <div className="bg-gray-900 text-green-400 p-6 rounded-xl font-mono text-sm overflow-x-auto">
            <pre>{`// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import {Wallet} from "./Wallet.sol";
import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract Liven is ERC721, Ownable {
    uint256 public certIdCounter;
    mapping(address => address) public userWallets;
    mapping(uint256 => string) public certificateURIs;

    event WalletCreated(address indexed user, address wallet);
    event CertificateMinted(address indexed to, uint256 tokenId, string uri);

    constructor() ERC721("LivenCertificate", "LVN") Ownable(_msgSender()) {}

    function createWallet() external returns (address wallet) { /* ... */ }
    function mintCertificate(address to, string memory uri) external onlyOwner returns (uint256) { /* ... */ }
    function getWallet(address user) external view returns (address) { /* ... */ }
    function tokenURI(uint256 tokenId) public view override returns (string memory) { /* ... */ }
}`}</pre>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-blue-50 p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-blue-800 mb-4">
                Responsibilities
              </h3>
              <ul className="space-y-2 text-blue-700">
                <li>• Issue ERC721-based soulbound credentials</li>
                <li>• Deploy Wallet contracts per user</li>
                <li>• Store and return metadata URIs</li>
              </ul>
            </div>
            <div className="bg-purple-50 p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-purple-800 mb-4">
                Key Features
              </h3>
              <ul className="space-y-2 text-purple-700">
                <li>• Non-transferable certificates</li>
                <li>• Automated wallet deployment</li>
                <li>• Metadata management</li>
              </ul>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 4,
      title: "Smart Contract Design – Wallet.sol",
      subtitle: "Individual user wallet contract for fund management",
      icon: <Code className="w-8 h-8" />,
      content: (
        <div className="space-y-6">
          <div className="bg-gray-900 text-green-400 p-6 rounded-xl font-mono text-sm overflow-x-auto">
            <pre>{`// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Wallet {
    address public immutable factory;
    address public owner;
    uint256 public totalEarnings;

    constructor(address _owner) {
        factory = msg.sender;
        owner = _owner;
    }

    function depositETH() external payable { /* ... */ }
    function withdrawETH(uint256 amount) external { /* ... */ }
    function fund(address token, uint256 amount) external payable { /* ... */ }
    function getSummary() external view returns (uint256, uint256, uint256, address) { /* ... */ }
}`}</pre>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-green-50 p-4 rounded-xl text-center">
              <div className="text-2xl font-bold text-green-600">ETH</div>
              <div className="text-sm text-green-700">Native Token Support</div>
            </div>
            <div className="bg-blue-50 p-4 rounded-xl text-center">
              <div className="text-2xl font-bold text-blue-600">ERC20</div>
              <div className="text-sm text-blue-700">Token Compatibility</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-xl text-center">
              <div className="text-2xl font-bold text-purple-600">Access</div>
              <div className="text-sm text-purple-700">Owner Control</div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 5,
      title: "Supabase Schema Overview",
      subtitle: "Database structure and authentication system",
      icon: <Database className="w-8 h-8" />,
      content: (
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-800">
                Database Tables
              </h3>
              <div className="space-y-3">
                {[
                  { name: "users", desc: "User profiles and wallet linkage" },
                  { name: "courses", desc: "Metadata and access rules" },
                  { name: "modules", desc: "Module ordering and content" },
                  { name: "quizzes", desc: "Linked to modules" },
                  {
                    name: "certificates",
                    desc: "Linked to smart contract cert IDs",
                  },
                  { name: "transactions", desc: "Wallet activity logs" },
                ].map((table, index) => (
                  <div
                    key={index}
                    className="bg-white border border-gray-200 p-4 rounded-lg"
                  >
                    <div className="font-semibold text-blue-600">
                      {table.name}
                    </div>
                    <div className="text-sm text-gray-600">{table.desc}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-green-50 to-blue-50 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Authentication
                </h3>
                <ul className="space-y-2">
                  <li>• Wallet login</li>
                  <li>• Row-level security (RLS) enforced</li>
                  <li>• Multi-factor authentication support (Coming soon)</li>
                </ul>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Storage
                </h3>
                <ul className="space-y-2">
                  <li>• Video content storage</li>
                  <li>• Cover images and media</li>
                  <li>• Certificate artwork</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 6,
      title: "AI Assistant Integration",
      subtitle: "GPT-powered learning enhancement features",
      icon: <Zap className="w-8 h-8" />,
      content: (
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-6 rounded-xl">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                AI Capabilities
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span>Summarizing modules</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <span>Answering questions</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span>Generating quiz recommendations</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span>Guiding user learning</span>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Technology Stack
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-blue-600" />
                  <span>React + Agent context state</span>
                </div>
                <div className="flex items-center gap-3">
                  <Database className="w-5 h-5 text-green-600" />
                  <span>Backend context memory (Supabase)</span>
                </div>
                <div className="flex items-center gap-3">
                  <Zap className="w-5 h-5 text-yellow-600" />
                  <span>GPT-4 / GPT-4o APIs</span>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-indigo-100 to-purple-100 p-6 rounded-xl">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              AI Learning Flow
            </h3>
            <div className="flex justify-between items-center flex-wrap gap-4">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold mb-2">
                  1
                </div>
                <div className="text-sm">User Interaction</div>
              </div>
              <ChevronRight className="w-6 h-6 text-gray-400" />
              <div className="text-center">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold mb-2">
                  2
                </div>
                <div className="text-sm">Context Analysis</div>
              </div>
              <ChevronRight className="w-6 h-6 text-gray-400" />
              <div className="text-center">
                <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center text-white font-bold mb-2">
                  3
                </div>
                <div className="text-sm">AI Processing</div>
              </div>
              <ChevronRight className="w-6 h-6 text-gray-400" />
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold mb-2">
                  4
                </div>
                <div className="text-sm">Personalized Response</div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 7,
      title: "Deployment Overview",
      subtitle: "Production deployment across multiple platforms",
      icon: <Cloud className="w-8 h-8" />,
      content: (
        <div className="space-y-6">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center gap-2">
                <Code className="w-5 h-5" />
                Smart Contracts
              </h3>
              <ul className="space-y-2 text-blue-700 text-sm">
                <li>• Liven.sol deployed to Kaia Mainnet</li>
                <li>• Wallet.sol deployed dynamically per user</li>
                <li>• Verified on block explorer</li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-teal-50 p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-green-800 mb-4 flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Frontend
              </h3>
              <ul className="space-y-2 text-green-700 text-sm">
                <li>• Deployed to Vercel</li>
                <li>• Connected with Supabase</li>
                <li>• Wallet integration via Ethers.js</li>
                <li>• MetaMask/WalletConnect support</li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-purple-800 mb-4 flex items-center gap-2">
                <Database className="w-5 h-5" />
                Backend
              </h3>
              <ul className="space-y-2 text-purple-700 text-sm">
                <li>• Supabase hosted DB</li>
                <li>• Storage & Auth services</li>
                <li>• Edge Functions</li>
              </ul>
            </div>
          </div>
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-8 rounded-xl">
            <h3 className="text-xl font-semibold text-gray-800 mb-6 text-center">
              Deployment Pipeline
            </h3>
            <div className="flex justify-between items-center flex-wrap gap-4">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white mb-3">
                  <Code className="w-8 h-8" />
                </div>
                <div className="font-medium">Development</div>
                <div className="text-sm text-gray-600">Local testing</div>
              </div>
              <ChevronRight className="w-6 h-6 text-gray-400" />
              <div className="text-center">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white mb-3">
                  <Rocket className="w-8 h-8" />
                </div>
                <div className="font-medium">Smart Contracts</div>
                <div className="text-sm text-gray-600">Kaia deployment</div>
              </div>
              <ChevronRight className="w-6 h-6 text-gray-400" />
              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center text-white mb-3">
                  <Database className="w-8 h-8" />
                </div>
                <div className="font-medium">Backend</div>
                <div className="text-sm text-gray-600">Supabase setup</div>
              </div>
              <ChevronRight className="w-6 h-6 text-gray-400" />
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center text-white mb-3">
                  <Globe className="w-8 h-8" />
                </div>
                <div className="font-medium">Frontend</div>
                <div className="text-sm text-gray-600">Vercel deployment</div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 8,
      title: "Future Enhancements",
      subtitle: "Roadmap for upcoming features and improvements",
      icon: <Rocket className="w-8 h-8" />,
      content: (
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-blue-800 mb-4">
                  Protocol Upgrades
                </h3>
                <ul className="space-y-2 text-blue-700">
                  <li>• Upgrade to ERC752 for richer metadata</li>
                  <li>• Expiration dates for certificates</li>
                  <li>• Enhanced credential verification</li>
                </ul>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-teal-50 p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-green-800 mb-4">
                  User Experience
                </h3>
                <ul className="space-y-2 text-green-700">
                  <li>• Credential explorer UI</li>
                  <li>• Token-gated content access via $LVN</li>
                  <li>• Advanced learning analytics</li>
                </ul>
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-purple-800 mb-4">
                  Infrastructure
                </h3>
                <ul className="space-y-2 text-purple-700">
                  <li>• Fully decentralized metadata (IPFS + Pinata)</li>
                  <li>• Multichain deployment support</li>
                  <li>• Layer 2 scaling solutions</li>
                </ul>
              </div>
              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-yellow-800 mb-4">
                  Tokenomics
                </h3>
                <ul className="space-y-2 text-yellow-700">
                  <li>• $LVN token launch</li>
                  <li>• Staking rewards for learners</li>
                  <li>• DAO governance implementation</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-indigo-100 to-purple-100 p-8 rounded-xl">
            <h3 className="text-xl font-semibold text-gray-800 mb-6 text-center">
              Development Timeline
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <div className="font-semibold">
                    Q1 2025: Core Platform Enhancement
                  </div>
                  <div className="text-sm text-gray-600">
                    ERC752 upgrade, UI improvements, advanced analytics
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <div className="font-semibold">Q2 2025: Token Launch</div>
                  <div className="text-sm text-gray-600">
                    $LVN token, staking mechanisms, governance
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
                <div className="flex-1">
                  <div className="font-semibold">
                    Q3 2025: Multichain Expansion
                  </div>
                  <div className="text-sm text-gray-600">
                    Cross-chain deployment, Layer 2 integration
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                <div className="flex-1">
                  <div className="font-semibold">Q4 2025: Decentralization</div>
                  <div className="text-sm text-gray-600">
                    Full IPFS integration, DAO launch
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 9,
      title: "Summary",
      subtitle: "Liven's comprehensive Web3 education ecosystem",
      icon: <Target className="w-8 h-8" />,
      content: (
        <div className="space-y-6">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Liven's Modular, Composable Architecture
            </h3>
            <p className="text-lg text-gray-600">
              Delivering the future of verifiable education
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl">
                <h4 className="text-lg font-semibold text-blue-800 mb-4">
                  Core Capabilities
                </h4>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Deliver on-chain credentials</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Empower creators with earning tools</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span>Guide learners with AI</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span>Enable verifiable reputation across Web3</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-teal-50 p-6 rounded-xl">
                <h4 className="text-lg font-semibold text-green-800 mb-4">
                  Technology Foundation
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Code className="w-5 h-5 text-blue-600" />
                    <span>Solidity / Kaia</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Database className="w-5 h-5 text-green-600" />
                    <span>Supabase / React</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Zap className="w-5 h-5 text-yellow-600" />
                    <span>AI + Tokenized Education Mechanics</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-8 rounded-xl">
              <h4 className="text-lg font-semibold text-purple-800 mb-6">
                Impact Metrics
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">100%</div>
                  <div className="text-sm text-purple-700">
                    Verifiable Credentials
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">∞</div>
                  <div className="text-sm text-blue-700">Borderless Access</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">AI</div>
                  <div className="text-sm text-green-700">Powered Learning</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-600 flex items-center justify-center">
                    <Globe className="w-8 h-8" />
                  </div>
                  <div className="text-sm text-yellow-700">Global Reach</div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center bg-gradient-to-r from-indigo-100 to-purple-100 p-8 rounded-xl">
            <h4 className="text-xl font-semibold text-gray-800 mb-4">
              Ready for Production
            </h4>
            <p className="text-gray-600 mb-6">
              Liven represents the next evolution in education technology,
              combining the security of blockchain, the intelligence of AI, and
              the accessibility of modern web platforms.
            </p>
            <div className="flex justify-center space-x-4">
              <div className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium">
                Scalable Architecture
              </div>
              <div className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium">
                Production Ready
              </div>
              <div className="px-4 py-2 bg-purple-500 text-white rounded-lg text-sm font-medium">
                Future Focused
              </div>
            </div>
          </div>
        </div>
      ),
    },
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const currentSlideData = slides[currentSlide];

  const { navigateTo } = useApp();

  return (
    <div className="min-h-screen cyber-hero cyber-grid">
      {/* Header */}
      <div className="cyber-sidebar border-b border-cyber sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigateTo("/")}
              className="cyber-button flex items-center gap-2"
            >
              <Home className="w-4 h-4" />
              Home
            </button>
            <h1 className="text-2xl font-bold text-white neon-text-cyan">
              🛠️ Wiza Technical Architecture & Deployment Slides
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-cyber-primary cyber-badge">
              {currentSlide + 1} of {slides.length}
            </span>
          </div>
        </div>
      </div>

      {/* Slide Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="cyber-card rounded-2xl min-h-[600px] overflow-hidden">
          {/* Slide Header */}
          <div className="bg-gradient-to-r from-cyan-600 to-purple-600 text-white p-8 cyber-glow">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-white/20 rounded-lg">
                {currentSlideData.icon}
              </div>
              <div>
                <div className="text-sm opacity-80">
                  Slide {currentSlideData.id}
                </div>
                <h2 className="text-3xl font-bold">{currentSlideData.title}</h2>
                <p className="text-lg opacity-90 mt-2">
                  {currentSlideData.subtitle}
                </p>
              </div>
            </div>
          </div>

          {/* Slide Body */}
          <div className="p-8">{currentSlideData.content}</div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8">
            <button
              onClick={prevSlide}
              disabled={currentSlide === 0}
              className="flex items-center gap-2 px-6 py-3 cyber-card border-cyber rounded-lg hover:cyber-glow disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="w-5 h-5 text-cyber-primary" />
              <span className="text-white">Previous</span>
            </button>

          {/* Slide Indicators */}
          <div className="flex gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentSlide
                    ? "bg-cyber-primary cyber-glow"
                    : "bg-slate-600 hover:bg-slate-500"
                }`}
              />
            ))}
          </div>

            <button
              onClick={nextSlide}
              disabled={currentSlide === slides.length - 1}
              className="cyber-button flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
              <ChevronRight className="w-5 h-5" />
            </button>
        </div>
      </div>
    </div>
  );
};

export default TechnicalDocs;
