import { NextResponse } from "next/server";

type PriceData = {
  asset: string;
  amount: string;
  decimals: number;
  symbol: string;
};

function convertPrice(price: PriceData): number {
  return Number(price.amount) / Math.pow(10, price.decimals);
}
export async function GET() {
  try {
    const res = await fetch(
      "https://app-backend.worldcoin.dev/public/v1/miniapps/prices?cryptoCurrencies=WLD&fiatCurrencies=USD",
      { cache: "no-store" }
    );

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch price" },
        { status: 500 }
      );
    }

    const data = await res.json();
    const priceData: PriceData = data.result.prices.WLD.USD;
    const price_ = convertPrice(priceData);
    const price = Number((5 / price_).toFixed(2));

    return NextResponse.json({ WLD_USD: price });
  } catch (e) {
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}
