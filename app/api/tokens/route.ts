// app/api/tokens/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getAccount, getAssociatedTokenAddress } from "@solana/spl-token";
import { connection, SUPPORTED_TOKENS, getSupportedTokensWithPrices } from "@/app/lib/constants";
import { PublicKey } from "@solana/web3.js";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const address = searchParams.get("address") as string;

    if (!address) {
      return NextResponse.json({ error: "Address is required" }, { status: 400 });
    }

    const tokensWithPrices = await getSupportedTokensWithPrices();
    
    const balances = await Promise.all(
      tokensWithPrices.map((token) => getAccountBalance(token, address))
    );

    const filteredBalances = balances.filter(b => b !== null);

    return NextResponse.json({
      address,
      balances: filteredBalances,
      totalValueUSD: filteredBalances.reduce((acc, b) => acc + (b?.usdValue || 0), 0)
    });

  } catch (error) {
    console.error("Error fetching balances:", error);
    return NextResponse.json({ error: "Failed to fetch balances" }, { status: 500 });
  }
}

async function getAccountBalance(
  token: {
    name: string;
    mint: string;
    price: number;
  },
  address: string
) {
  try {
    const ata = await getAssociatedTokenAddress(
      new PublicKey(token.mint),
      new PublicKey(address)
    );
    
    const account = await getAccount(connection, ata);
    const balance = Number(account.amount) / Math.pow(10, 6); // Assuming 6 decimals for USDC/USDT

    return {
      token: token.name,
      mint: token.mint,
      balance: balance,
      price: token.price,
      usdValue: balance * token.price,
    };
  } catch (error) {
    // Account doesn't exist or other error
    console.log(`No account found for ${token.name}`);
    return null;
  }
}