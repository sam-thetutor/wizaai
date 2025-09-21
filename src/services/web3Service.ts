import {
  writeContract,
  waitForTransactionReceipt,
  readContract,
  signMessage,
} from "@wagmi/core";
import {
  WizaABI,
  WIZA_CERTIFICATE_CONTRACT_ADDRESS,
  WalletABI,
} from "../contracts/abi/Liven";
import { supabase } from "../lib/supabase";
import { hexToNumber, zeroAddress } from "viem";
import { wagmiAdapter } from "../config/chains";

export class Web3Service {
  static async createWallet(): Promise<string> {
    try {
      const hash = await writeContract(wagmiAdapter.wagmiConfig, {
        address: WIZA_CERTIFICATE_CONTRACT_ADDRESS,
        abi: WizaABI,
        functionName: "createWallet",
      });

      await waitForTransactionReceipt(wagmiAdapter.wagmiConfig, { hash });

      return hash;
    } catch (error) {
      console.error("Failed to get wallet address:", error);
      throw new Error("Failed to get wallet address");
    }
  }

  static async getWallet(user: string): Promise<`0x${string}`> {
    try {
      return await readContract(wagmiAdapter.wagmiConfig, {
        address: WIZA_CERTIFICATE_CONTRACT_ADDRESS,
        abi: WizaABI,
        functionName: "getWallet",
        args: [user as `0x${string}`],
      });
    } catch (error) {
      console.error("Failed to get wallet address:", error);
      throw new Error("Failed to get wallet address");
    }
  }

  static async addFundsToWalletNonBlocking(
    user: string,
    token: string,
    amount: bigint
  ): Promise<string> {
    try {
      const hash = await writeContract(wagmiAdapter.wagmiConfig, {
        address: WIZA_CERTIFICATE_CONTRACT_ADDRESS,
        abi: WizaABI,
        functionName: "addFundsToWalletNonBlocking",
        args: [user as `0x${string}`, token as `0x${string}`, amount],
        value: token === zeroAddress ? BigInt(amount) : undefined,
      });

      await waitForTransactionReceipt(wagmiAdapter.wagmiConfig, { hash });

      return hash;
    } catch (error) {
      console.error("Failed to create wallet:", error);
      throw new Error("Failed to create wallet");
    }
  }

  static async depositETH(wallet: string, amount: bigint): Promise<string> {
    try {
      const hash = await writeContract(wagmiAdapter.wagmiConfig, {
        address: wallet as `0x${string}`,
        abi: WalletABI,
        functionName: "depositETH",
        value: amount,
      });

      await waitForTransactionReceipt(wagmiAdapter.wagmiConfig, { hash });

      return hash;
    } catch (error) {
      console.error("Failed to create wallet:", error);
      throw new Error("Failed to create wallet");
    }
  }

  static async withdrawETH(wallet: string, amount: bigint): Promise<string> {
    try {
      const hash = await writeContract(wagmiAdapter.wagmiConfig, {
        address: wallet as `0x${string}`,
        abi: WalletABI,
        functionName: "withdrawETH",
        args: [amount],
      });

      await waitForTransactionReceipt(wagmiAdapter.wagmiConfig, { hash });

      return hash;
    } catch (error) {
      console.error("Failed to create wallet:", error);
      throw new Error("Failed to create wallet");
    }
  }

  static async getSummary(wallet: string): Promise<{
    totalETHDeposited: bigint;
    totalETHWithdrawn: bigint;
    totalEarnings: bigint;
    owner: string;
  }> {
    try {
      const result = (await readContract(wagmiAdapter.wagmiConfig, {
        address: wallet as `0x${string}`,
        abi: WalletABI,
        functionName: "getSummary",
      })) as any;

      return {
        totalETHDeposited: result[0],
        totalETHWithdrawn: result[1],
        totalEarnings: result[2],
        owner: result[3],
      };
    } catch (error) {
      console.error("Failed to get wallet summary:", error);
      throw new Error("Failed to get wallet summary");
    }
  }

  static async mintCertificateNonBlocking(
    studentAddress: string,
    metadataURI: string
  ): Promise<{ tokenId: number; transactionHash: string }> {
    try {
      const hash = await writeContract(wagmiAdapter.wagmiConfig, {
        address: WIZA_CERTIFICATE_CONTRACT_ADDRESS,
        abi: WizaABI,
        functionName: "mintCertificateNonBlocking",
        args: [studentAddress as `0x${string}`, metadataURI],
      });

      const { logs } = await waitForTransactionReceipt(
        wagmiAdapter.wagmiConfig,
        { hash }
      );

      const tokenId = hexToNumber(logs[0].topics[3] as `0x${string}`);

      return {
        tokenId,
        transactionHash: hash,
      };
    } catch (error) {
      console.error("Failed to mint NFT certificate:", error);
      throw new Error("Failed to mint NFT certificate");
    }
  }

  static async storeCertificateInDatabase(
    courseId: string,
    userId: string,
    tokenId: string,
    contractAddress: string,
    transactionHash: string,
    metadataURI: string
  ): Promise<void> {
    const { error } = await supabase.from("nft_certificates").insert({
      course_id: courseId,
      user_id: userId,
      token_id: tokenId,
      contract_address: contractAddress,
      transaction_hash: transactionHash,
      metadata_uri: metadataURI,
    });

    if (error) {
      throw new Error("Failed to store certificate in database");
    }
  }

  static async signMessage(message: string) {
    await signMessage(wagmiAdapter.wagmiConfig, {
      message: `${Date.now()}:${message}`,
    });
  }
}

export const formatAddress = (address: string): string => {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};
