import { Cluster } from "@solana/web3.js";
import { ENV as ENVChainId } from "@solana/spl-token-registry";

export interface JupiterToken {
    chainId: number; // 101,
    address: string; // 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
    symbol: string; // 'USDC',
    name: string; // 'Wrapped USDC',
    decimals: number; // 6,
    logoURI: string; // 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/BXXkv6z8ykpG1yuvUDPgh732wzVHB69RnB9YgSYh3itW/logo.png',
    tags: string[]; // [ 'stablecoin' ]
}

export const SHDW_TOKEN: JupiterToken = {
    chainId: 0,
    address: "",
    symbol: "",
    name: "",
    decimals: 0,
    logoURI: "",
    tags: []
}

// Endpoints, connection
export const ENV: Cluster = "mainnet-beta";
export const CHAIN_ID = ENVChainId.MainnetBeta;

export const SOLANA_RPC_ENDPOINT = "https://solana-api.projectserum.com";

// Token Mints
export const SOL_MINT = "So11111111111111111111111111111111111111112";
export const SHDW_MINT = "SHDWyBxihqiCj6YekG2GUr7wqKLeLAMK1gHZck9pL6y";

