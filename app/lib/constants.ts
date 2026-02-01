// app/lib/constants.ts
import { Connection } from "@solana/web3.js";
import axios from "axios";

let LAST_UPDATE: number | null = null;
const TOKEN_PRICE_REFRESH_INTERVAL = 60 * 1000; // 1 minute
let cachedPrices: { [key: string]: number } = {};

export const SUPPORTED_TOKENS: {
  name: string;
  mint: string;
  symbol: string; // For price API
}[] = [
  {
    name: "USDC",
    mint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    symbol: "USDC",
  },
  {
    name: "USDT",
    mint: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
    symbol: "USDT",
  },
  {
    name: "SOL",
    mint: "So11111111111111111111111111111111111111112",
    symbol: "SOL",
  },
];

export const connection = new Connection(
  process.env.NEXT_PUBLIC_SOLANA_RPC || "https://api.devnet.solana.com",
  "confirmed"
);

export async function getSupportedTokensWithPrices() {
  if (
    !LAST_UPDATE ||
    new Date().getTime() - LAST_UPDATE > TOKEN_PRICE_REFRESH_INTERVAL
  ) {
    await fetchPrices();
    LAST_UPDATE = new Date().getTime();
  }

  return SUPPORTED_TOKENS.map((token) => ({
    ...token,
    price: cachedPrices[token.symbol] || 0,
  }));
}

async function fetchPrices() {
  try {
    // Fetch prices from CoinGecko (free, no API key needed)
    const response = await axios.get(
      "https://api.coingecko.com/api/v3/simple/price",
      {
        params: {
          ids: "solana,usd-coin,tether",
          vs_currencies: "usd",
        },
      }
    );

    cachedPrices = {
      SOL: response.data.solana?.usd || 0,
      USDC: response.data["usd-coin"]?.usd || 1,
      USDT: response.data.tether?.usd || 1,
    };

    console.log("Updated prices:", cachedPrices);
  } catch (error) {
    console.error("Error fetching prices:", error);
    // Fallback prices
    cachedPrices = {
      SOL: 0,
      USDC: 1,
      USDT: 1,
    };
  }
}

// Alternative: Using Binance API
async function fetchPricesFromBinance() {
  try {
    const symbols = ["SOLUSDT", "USDCUSDT"];
    const prices = await Promise.all(
      symbols.map((symbol) =>
        axios.get(`https://api.binance.com/api/v3/ticker/price?symbol=${symbol}`)
      )
    );

    cachedPrices = {
      SOL: parseFloat(prices[0].data.price),
      USDC: parseFloat(prices[1].data.price),
      USDT: 1,
    };
  } catch (error) {
    console.error("Error fetching prices from Binance:", error);
  }
}