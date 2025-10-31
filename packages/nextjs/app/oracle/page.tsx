"use client";

import { useEffect, useState } from "react";
import type { NextPage } from "next";

interface PriceData {
  symbol: string;
  price: number;
  change24h: number;
  lastUpdate: Date;
}

const PriceCard = ({ data, isLoading }: { data: PriceData; isLoading: boolean }) => {
  return (
    <div className="card w-96 bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title justify-center">{data.symbol}/USD</h2>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : (
          <>
            <div className="stats shadow">
              <div className="stat">
                <div className="stat-title">Current Price</div>
                <div className="stat-value text-primary">${data.price.toLocaleString()}</div>
                <div className="stat-desc flex items-center gap-2">
                  <span className={data.change24h >= 0 ? "text-success" : "text-error"}>
                    {data.change24h >= 0 ? "↗" : "↘"} {Math.abs(data.change24h).toFixed(2)}%
                  </span>
                  <span>24h change</span>
                </div>
              </div>
            </div>
            <div className="text-xs text-center text-gray-500 mt-2">
              Last updated: {data.lastUpdate.toLocaleTimeString()}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const Oracle: NextPage = () => {
  const [ethData, setEthData] = useState<PriceData>({
    symbol: "ETH",
    price: 0,
    change24h: 0,
    lastUpdate: new Date(),
  });

  const [btcData, setBtcData] = useState<PriceData>({
    symbol: "BTC",
    price: 0,
    change24h: 0,
    lastUpdate: new Date(),
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPrices = async () => {
    try {
      setIsLoading(true);
      setError("");

      const response = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=ethereum,bitcoin&vs_currencies=usd&include_24hr_change=true",
      );

      if (!response.ok) {
        throw new Error("Failed to fetch prices");
      }

      const data = await response.json();

      setEthData({
        symbol: "ETH",
        price: data.ethereum.usd,
        change24h: data.ethereum.usd_24h_change,
        lastUpdate: new Date(),
      });

      setBtcData({
        symbol: "BTC",
        price: data.bitcoin.usd,
        change24h: data.bitcoin.usd_24h_change,
        lastUpdate: new Date(),
      });

      setIsLoading(false);
    } catch (err) {
      console.error("Error fetching prices:", err);
      setError("Failed to fetch prices. Please try again.");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPrices();
    // Refresh every 30 seconds
    const interval = setInterval(fetchPrices, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-center mb-4">🔮 Live Price Feeds</h1>
        <p className="text-center text-gray-600">Real-time cryptocurrency prices powered by CoinGecko API</p>
      </div>

      {error && (
        <div className="alert alert-error mb-6 max-w-2xl mx-auto">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{error}</span>
        </div>
      )}

      <div className="flex justify-center items-center gap-6 flex-col sm:flex-row">
        <PriceCard data={ethData} isLoading={isLoading} />
        <PriceCard data={btcData} isLoading={isLoading} />
      </div>

      <div className="flex justify-center mt-6">
        <button className="btn btn-outline" onClick={fetchPrices} disabled={isLoading}>
          {isLoading ? (
            <>
              <span className="loading loading-spinner loading-xs"></span>
              Refreshing...
            </>
          ) : (
            "Refresh Prices"
          )}
        </button>
      </div>
    </div>
  );
};

export default Oracle;
