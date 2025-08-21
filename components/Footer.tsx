"use client";

export default function Footer() {
  return (
    <footer className="mt-16 pt-8 border-t border-[#14304e] max-w-[1400px] mx-auto px-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        {/* Company Info */}
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-6 h-6 bg-[#2ae5b9] rounded-full flex items-center justify-center">
              <span className="text-black text-sm font-bold">C</span>
            </div>
            <span className="text-white font-semibold text-lg">COZY</span>
          </div>
          <p className="text-[#728395] text-sm mb-4">
            The future of DeFi lending and leveraged trading on Kaia Network.
          </p>
          <div className="flex space-x-4">
            <button
              type="button"
              className="text-[#728395] hover:text-[#2ae5b9] transition-colors"
            >
              <span className="sr-only">Twitter</span>🐦
            </button>
            <button
              type="button"
              className="text-[#728395] hover:text-[#2ae5b9] transition-colors"
            >
              <span className="sr-only">Discord</span>💬
            </button>
            <button
              type="button"
              className="text-[#728395] hover:text-[#2ae5b9] transition-colors"
            >
              <span className="sr-only">GitHub</span>📝
            </button>
          </div>
        </div>

        {/* Products */}
        <div>
          <h3 className="text-white font-semibold mb-4">Products</h3>
          <ul className="space-y-2">
            <li>
              <button
                type="button"
                className="text-[#728395] hover:text-white transition-colors text-sm text-left"
              >
                Lending
              </button>
            </li>
            <li>
              <button
                type="button"
                className="text-[#728395] hover:text-white transition-colors text-sm text-left"
              >
                Markets
              </button>
            </li>
            <li>
              <button
                type="button"
                className="text-[#728395] hover:text-white transition-colors text-sm text-left"
              >
                Analytics
              </button>
            </li>
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h3 className="text-white font-semibold mb-4">Resources</h3>
          <ul className="space-y-2">
            <li>
              <button
                type="button"
                className="text-[#728395] hover:text-white transition-colors text-sm text-left"
              >
                Documentation
              </button>
            </li>
            <li>
              <button
                type="button"
                className="text-[#728395] hover:text-white transition-colors text-sm text-left"
              >
                FAQ
              </button>
            </li>
            <li>
              <button
                type="button"
                className="text-[#728395] hover:text-white transition-colors text-sm text-left"
              >
                Security
              </button>
            </li>
            <li>
              <button
                type="button"
                className="text-[#728395] hover:text-white transition-colors text-sm text-left"
              >
                Bug Bounty
              </button>
            </li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="text-white font-semibold mb-4">Support</h3>
          <ul className="space-y-2">
            <li>
              <button
                type="button"
                className="text-[#728395] hover:text-white transition-colors text-sm text-left"
              >
                Help Center
              </button>
            </li>
            <li>
              <button
                type="button"
                className="text-[#728395] hover:text-white transition-colors text-sm text-left"
              >
                Contact Us
              </button>
            </li>
            <li>
              <button
                type="button"
                className="text-[#728395] hover:text-white transition-colors text-sm text-left"
              >
                Terms of Service
              </button>
            </li>
            <li>
              <button
                type="button"
                className="text-[#728395] hover:text-white transition-colors text-sm text-left"
              >
                Privacy Policy
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="pt-6 border-t border-[#14304e] flex flex-col md:flex-row justify-between items-center mb-8">
        <p className="text-[#728395] text-sm">
          © 2024 COZY Finance. All rights reserved.
        </p>
        <div className="flex items-center space-x-4 mt-4 md:mt-0">
          <span className="text-[#728395] text-sm">Built on</span>
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 bg-[#2ae5b9] rounded-full flex items-center justify-center">
              <span className="text-black text-xs font-bold">K</span>
            </div>
            <span className="text-white font-semibold text-sm">
              Kaia Network
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
