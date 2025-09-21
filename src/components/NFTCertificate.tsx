import React, { useState } from "react";
import { useApp } from "../contexts/AppContext";
import {
  Award,
  Download,
  Share2,
  ExternalLink,
  Copy,
  CheckCircle,
  X,
  Calendar,
  User,
  BookOpen,
} from "lucide-react";
import { Course } from "../types";
import { formatAddress, Web3Service } from "../services/web3Service";
import { useAppKitAccount } from "@reown/appkit/react";
import { WIZA_CERTIFICATE_CONTRACT_ADDRESS } from "../contracts/abi/Liven";

interface NFTCertificateProps {
  course: Course;
  onClose: () => void;
}

const NFTCertificate: React.FC<NFTCertificateProps> = ({ course, onClose }) => {
  const { state, addNotification } = useApp();
  const { address } = useAppKitAccount();
  const [isMinting, setIsMinting] = useState(false);
  const [isMinted, setIsMinted] = useState(false);
  const [tokenId, setTokenId] = useState(-1);

  const handleMintNFT = async () => {
    if (!address) return;

    setIsMinting(true);

    const { tokenId } = await Web3Service.mintCertificateNonBlocking(
      address,
      JSON.stringify({
        name: course.certificateMetadata.title,
        description: course.certificateMetadata.description,
        image: course.certificateMetadata.imageUrl,
        attributes: course.certificateMetadata.attributes,
        issuer: course.certificateMetadata.issuer,
        external_url: `https://wiza-kaia.netlify.app/app/courses/${course.id}`,
      })
    );

    setTokenId(tokenId);
    setIsMinted(true);
    setIsMinting(false);

    addNotification({
      type: "success",
      title: "NFT Certificate Minted!",
      message:
        "Your certificate has been successfully minted on the blockchain",
    });
  };

  const handleCopyTokenId = () => {
    navigator.clipboard.writeText(tokenId.toString());
    addNotification({
      type: "success",
      title: "Copied!",
      message: "Token ID copied to clipboard",
    });
  };

  const handleShare = () => {
    const shareText = `I just completed "${course.title}" on Liven and earned an NFT certificate! 🎓 #Web3Education #NFT #Blockchain`;

    if (navigator.share) {
      navigator.share({
        title: "NFT Certificate Earned!",
        text: shareText,
        url: `https://wiza-kaia.netlify.app/certificate/${tokenId}`,
      });
    } else {
      navigator.clipboard.writeText(shareText);
      addNotification({
        type: "success",
        title: "Copied!",
        message: "Share text copied to clipboard",
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900/95 backdrop-blur-xl border border-cyan-500/30 rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">
              {isMinted ? "Certificate Minted!" : "Mint NFT Certificate"}
            </h2>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Certificate Preview */}
          <div className="relative mb-6">
            <div className="aspect-[4/3] rounded-xl border-4 border-cyan-500/30 p-8 bg-slate-800/50">
              {/* Certificate Background */}
              <div className="absolute inset-0 opacity-5">
                <div className="w-full h-full bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-600"></div>
              </div>

              {/* Certificate Content */}
              <div className="relative z-10 h-full flex flex-col justify-between text-center">
                <div>
                  <div className="mb-4">
                    <Award className="h-16 w-16 mx-auto text-yellow-400 mb-4" />
                    <h3 className="text-2xl font-bold mb-2 text-white">
                      Certificate of Completion
                    </h3>
                    <p className="text-sm text-slate-400">
                      Issued by Wiza Academy • Kaia
                    </p>
                  </div>

                  <div className="mb-6">
                    <p className="text-lg mb-2 text-slate-300">
                      This certifies that
                    </p>
                    <h4 className="text-2xl font-bold mb-4 text-white">
                      {state.user?.name}
                    </h4>
                    <p className="text-lg mb-2 text-slate-300">
                      has successfully completed
                    </p>
                    <h5 className="text-xl font-semibold text-cyan-400">
                      {course.title}
                    </h5>
                  </div>
                </div>

                <div className="flex justify-between items-end text-sm">
                  <div className="text-left">
                    <p className="text-slate-400">
                      Instructor
                    </p>
                    <p className="font-medium text-white">
                      {course.user?.name}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-slate-400">
                      Date Issued
                    </p>
                    <p className="font-medium text-white">
                      {new Date().toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Verification Badge */}
              {isMinted && (
                <div className="absolute top-4 right-4">
                  <div className="bg-green-500 text-white p-2 rounded-full">
                    <CheckCircle className="h-6 w-6" />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Certificate Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 rounded-lg border border-cyan-500/20 bg-slate-800/50">
            <div className="text-center">
              <User className="h-6 w-6 mx-auto mb-2 text-cyan-400" />
              <p className="text-sm font-medium text-white">
                Student
              </p>
              <p className="text-xs text-slate-400">
                {formatAddress(address!)}
              </p>
            </div>
            <div className="text-center">
              <BookOpen className="h-6 w-6 mx-auto mb-2 text-cyan-400" />
              <p className="text-sm font-medium text-white">
                Course
              </p>
              <p className="text-xs text-slate-400">
                {course.modules.length} modules
              </p>
            </div>
            <div className="text-center">
              <Calendar className="h-6 w-6 mx-auto mb-2 text-cyan-400" />
              <p className="text-sm font-medium text-white">
                Completed
              </p>
              <p className="text-xs text-slate-400">
                {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Skills Earned */}
          <div className="mb-6">
            <h4 className="text-lg font-semibold mb-3 text-white">
              Skills Earned
            </h4>
            <div className="flex flex-wrap gap-2">
              {course.certificateMetadata.attributes.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-full text-sm font-medium border border-cyan-500/30"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Token Information */}
          {isMinted && (
            <div className="p-4 rounded-lg border border-cyan-500/20 bg-slate-800/50 mb-6">
              <h4 className="font-semibold mb-2 text-white">
                NFT Details
              </h4>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">
                    Token ID
                  </p>
                  <p className="font-mono text-sm text-white">
                    #{tokenId}
                  </p>
                </div>
                <button
                  onClick={handleCopyTokenId}
                  className="p-2 rounded-lg hover:bg-slate-700 transition-colors text-slate-400 hover:text-white"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            {!isMinted ? (
              <button
                onClick={handleMintNFT}
                disabled={isMinting}
                className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 text-sm font-semibold rounded-lg border-2 transition-all duration-300 backdrop-blur-sm ${
                  isMinting
                    ? "border-slate-600 text-slate-500 cursor-not-allowed opacity-50"
                    : "border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-500 hover:shadow-cyber"
                }`}
              >
                {isMinting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-slate-400/30 border-t-slate-400 rounded-full animate-spin"></div>
                    <span>Minting NFT...</span>
                  </>
                ) : (
                  <>
                    <Award className="h-4 w-4" />
                    <span>Mint NFT Certificate</span>
                  </>
                )}
              </button>
            ) : (
              <>
                <button
                  onClick={handleShare}
                  className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 text-sm font-semibold rounded-lg border-2 border-cyber-primary/50 text-cyber-primary hover:bg-cyber-primary/10 hover:border-cyber-primary hover:shadow-cyber transition-all duration-300 backdrop-blur-sm"
                >
                  <Share2 className="h-4 w-4" />
                  <span>Share</span>
                </button>

                <button
                  className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 text-sm font-semibold rounded-lg border-2 border-cyber-primary/50 text-cyber-primary hover:bg-cyber-primary/10 hover:border-cyber-primary hover:shadow-cyber transition-all duration-300 backdrop-blur-sm"
                >
                  <Download className="h-4 w-4" />
                  <span>Download</span>
                </button>

                <a
                  href={`https://kairos.kaiascope.com/account/${WIZA_CERTIFICATE_CONTRACT_ADDRESS}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <button
                    className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 text-sm font-semibold rounded-lg border-2 border-cyber-primary/50 text-cyber-primary hover:bg-cyber-primary/10 hover:border-cyber-primary hover:shadow-cyber transition-all duration-300 backdrop-blur-sm"
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span>View on Chain</span>
                  </button>
                </a>
              </>
            )}
          </div>

          {/* Blockchain Info */}
          <div className="mt-6 p-4 rounded-lg border-l-4 border-cyan-500 bg-cyan-500/10">
            <h4 className="font-semibold mb-2 text-cyan-400">
              Blockchain Verified
            </h4>
            <p className="text-sm text-cyan-300">
              Your certificate is stored on the Kaia blockchain as an NFT,
              making it tamper-proof and verifiable forever. It can be viewed in
              any compatible Web3 wallet or marketplace.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NFTCertificate;
