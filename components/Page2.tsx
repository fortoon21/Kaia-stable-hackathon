import { mockMarketsData } from "@/lib/mockApi";

export default function Page2() {
  const { stablecoinFixed, stablecoinNew, trending, marketsTable } =
    mockMarketsData;

  return (
    <div className="min-h-screen bg-[#08131f] text-white">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">Markets</h1>
            <div className="flex items-center space-x-4">
              <button className="flex items-center space-x-2 text-[#2ae5b9]">
                <span>📊</span>
                <span>Deploy Pool</span>
              </button>
            </div>
          </div>

          {/* Top Cards Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Stablecoin Top Fixed APY */}
            <div className="bg-[#0c1d2f] border border-[#14304e] rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[#2ae5b9] font-semibold">
                  Stablecoin Top Fixed APY
                </h3>
                <a href="#" className="text-[#2ae5b9] text-sm">
                  See All →
                </a>
              </div>
              <div className="space-y-3">
                {stablecoinFixed.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-black font-bold text-sm">
                        {item.symbol[0]}
                      </div>
                      <div>
                        <div className="font-semibold">{item.symbol}</div>
                        <div className="text-[#728395] text-sm">
                          {item.days} days
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[#23c09b] font-semibold">
                        {item.apy}
                      </div>
                      <div className="text-[#728395] text-sm">fixed APY</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Stablecoin Top New Markets */}
            <div className="bg-[#0c1d2f] border border-[#14304e] rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[#2ae5b9] font-semibold">
                  Stablecoin Top New Markets
                </h3>
                <a href="#" className="text-[#2ae5b9] text-sm">
                  See All →
                </a>
              </div>
              <div className="space-y-3">
                {stablecoinNew.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {item.symbol[0]}
                      </div>
                      <div>
                        <div className="font-semibold">{item.symbol}</div>
                        <div className="text-[#728395] text-sm">
                          {item.days} days
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[#23c09b] font-semibold">
                        {item.volume}
                      </div>
                      <div className="text-[#728395] text-sm">24h volume</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Trending Markets */}
            <div className="bg-[#0c1d2f] border border-[#14304e] rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-orange-500 font-semibold">
                  🔥 Trending Markets
                </h3>
                <a href="#" className="text-[#2ae5b9] text-sm">
                  See All →
                </a>
              </div>
              <div className="space-y-3">
                {trending.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {item.symbol[0]}
                      </div>
                      <div>
                        <div className="font-semibold">{item.symbol}</div>
                        <div className="text-[#728395] text-sm">
                          {item.days} days
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[#23c09b] font-semibold">
                        {item.apy}
                      </div>
                      <div className="text-[#728395] text-sm">fixed APY</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Filter Section */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <button className="flex items-center space-x-2 px-4 py-2 bg-[#0c1d2f] border border-[#14304e] rounded-lg">
                <span>⭐</span>
                <span>Prime</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 bg-[#0c1d2f] border border-[#14304e] rounded-lg">
                <span>⭐</span>
                <span>Favorites</span>
              </button>
              <select className="px-4 py-2 bg-[#0c1d2f] border border-[#14304e] rounded-lg text-white">
                <option>All Categories</option>
              </select>
              <button className="px-4 py-2 bg-[#0c1d2f] border border-[#14304e] rounded-lg">
                Clear Filters
              </button>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex bg-[#0c1d2f] border border-[#14304e] rounded-lg">
                <button className="p-2">📋</button>
                <button className="p-2">📊</button>
                <button className="p-2">📈</button>
              </div>
              <input
                type="text"
                placeholder="Search name or paste address"
                className="px-4 py-2 bg-[#0c1d2f] border border-[#14304e] rounded-lg text-white placeholder-[#728395] w-64"
              />
              <button className="p-2 bg-[#0c1d2f] border border-[#14304e] rounded-lg">
                🔍
              </button>
            </div>
          </div>

          {/* Tip Banner */}
          <div className="bg-gradient-to-r from-orange-500/20 to-yellow-500/20 border border-orange-500/30 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">💡</span>
              <div>
                <div className="font-semibold text-orange-200">
                  Hold or stake selected
                </div>
                <div className="text-orange-300 text-sm">
                  tokens to save gas when
                </div>
                <div className="text-orange-300 text-sm">using preferences</div>
              </div>
            </div>
          </div>
        </div>

        {/* Markets Table */}
        <div className="bg-[#0c1d2f] border border-[#14304e] rounded-2xl overflow-hidden">
          <div className="p-6">
            <div className="grid grid-cols-6 gap-4 text-[#728395] text-sm font-semibold mb-4">
              <div>Asset</div>
              <div className="text-center">Total Liquidity</div>
              <div className="text-center">Total 24h Vol</div>
              <div className="text-center">Best Long Yield APY</div>
              <div className="text-center">Best Fixed APY</div>
              <div></div>
            </div>

            {/* USDC Row */}
            <div className="grid grid-cols-6 gap-4 items-center py-4 border-b border-[#14304e]">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                  U
                </div>
                <div>
                  <div className="font-semibold">USDC</div>
                  <div className="text-[#728395] text-sm">2 Markets</div>
                </div>
              </div>
              <div className="text-center">
                <div className="font-semibold">$102.50M</div>
                <div className="text-[#23c09b] text-sm">+6.05%</div>
              </div>
              <div className="text-center font-semibold">$119.26M</div>
              <div className="text-center">
                <div className="text-[#23c09b] font-semibold">-100%</div>
              </div>
              <div className="text-center">
                <div className="text-[#23c09b] font-semibold">13.45%</div>
              </div>
              <div className="text-center">
                <button className="text-[#2ae5b9]">↗</button>
              </div>
            </div>

            {/* Markets Rows */}
            {marketsTable.map((market, index) => (
              <div
                key={index}
                className="border-b border-[#14304e] last:border-b-0"
              >
                <div className="grid grid-cols-6 gap-4 items-center py-4">
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                      style={{ backgroundColor: market.color }}
                    >
                      {market.symbol[0]}
                    </div>
                    <div>
                      <div className="font-semibold">{market.symbol}</div>
                      <div className="text-[#728395] text-sm">
                        {market.description}
                      </div>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold">{market.liquidity}</div>
                    <div className="text-[#728395] text-sm">
                      {market.liquidityDetail}
                    </div>
                  </div>
                  <div className="text-center font-semibold">
                    {market.volume24h}
                  </div>
                  <div className="text-center">
                    <div className="bg-[#14304e] px-3 py-1 rounded text-sm">
                      YT
                    </div>
                    <div className="text-[#728395] text-sm mt-1">
                      {market.ytYield}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="bg-[#14304e] px-3 py-1 rounded text-sm">
                      PT
                    </div>
                    <div className="text-[#23c09b] text-sm mt-1">
                      {market.ptFixed}
                    </div>
                  </div>
                  <div className="text-center">
                    <button className="text-[#2ae5b9]">↗</button>
                  </div>
                </div>

                {/* Expandable content for some markets */}
                {market.markets && (
                  <div className="pl-16 pb-4">
                    <div className="text-[#2ae5b9] text-sm mb-2">
                      {market.markets} Markets
                    </div>
                    <div className="grid grid-cols-6 gap-4 text-sm">
                      <div></div>
                      <div className="text-center text-[#728395]">
                        <div>{market.totalLiquidity}</div>
                        <div>Total LTV</div>
                      </div>
                      <div className="text-center">
                        <div className="bg-[#14304e] px-2 py-1 rounded text-xs">
                          YT
                        </div>
                        <div className="text-[#728395] mt-1">
                          {market.ytPercentage}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="bg-[#14304e] px-2 py-1 rounded text-xs">
                          PT
                        </div>
                        <div className="text-[#23c09b] mt-1">
                          {market.ptPercentage}
                        </div>
                      </div>
                      <div></div>
                      <div></div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom feedback */}
        <div className="mt-8 text-center">
          <div className="bg-[#0c1d2f] border border-[#14304e] rounded-lg p-4 inline-block">
            <div className="text-[#2ae5b9] font-semibold">💬 Feedback</div>
            <div className="text-[#728395] text-sm mt-1">
              Having issues? Let us know
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
