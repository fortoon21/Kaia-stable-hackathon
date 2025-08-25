"use client";

import Image from "next/image";
import { LAYOUT } from "@/constants/layout";

export default function Footer() {
  return (
    <footer
      className={`mt-16 pt-8 border-t border-line-soft ${LAYOUT.MAX_WIDTH_CONTAINER} mx-auto px-6`}
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        {/* Company Info */}
        <div>
          <div className="flex items-center mb-4">
            <Image
              src="/tgif-wordmark.svg"
              alt="TGIF"
              width={120}
              height={48}
              className="h-8 w-auto"
            />
          </div>
          <p className="text-body text-sm mb-4">
            The future of DeFi lending and leveraged trading on Kaia Network.
          </p>
          <div className="flex space-x-4">
            <button
              type="button"
              className="text-body hover:text-primary-100 transition-colors"
            >
              <span className="sr-only">Twitter</span>🐦
            </button>
            <button
              type="button"
              className="text-body hover:text-primary-100 transition-colors"
            >
              <span className="sr-only">Discord</span>💬
            </button>
            <button
              type="button"
              className="text-body hover:text-primary-100 transition-colors"
            >
              <span className="sr-only">GitHub</span>📝
            </button>
          </div>
        </div>

        {/* Products */}
        <div>
          <h3 className="text-heading font-heading font-semibold mb-4">Products</h3>
          <ul className="space-y-2">
            <li>
              <button
                type="button"
                className="text-body hover:text-heading transition-colors text-sm text-left"
              >
                Lending
              </button>
            </li>
            <li>
              <button
                type="button"
                className="text-body hover:text-heading transition-colors text-sm text-left"
              >
                Markets
              </button>
            </li>
            <li>
              <button
                type="button"
                className="text-body hover:text-heading transition-colors text-sm text-left"
              >
                Analytics
              </button>
            </li>
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h3 className="text-heading font-heading font-semibold mb-4">Resources</h3>
          <ul className="space-y-2">
            <li>
              <button
                type="button"
                className="text-body hover:text-heading transition-colors text-sm text-left"
              >
                Documentation
              </button>
            </li>
            <li>
              <button
                type="button"
                className="text-body hover:text-heading transition-colors text-sm text-left"
              >
                FAQ
              </button>
            </li>
            <li>
              <button
                type="button"
                className="text-body hover:text-heading transition-colors text-sm text-left"
              >
                Security
              </button>
            </li>
            <li>
              <button
                type="button"
                className="text-body hover:text-heading transition-colors text-sm text-left"
              >
                Bug Bounty
              </button>
            </li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="text-heading font-heading font-semibold mb-4">Support</h3>
          <ul className="space-y-2">
            <li>
              <button
                type="button"
                className="text-body hover:text-heading transition-colors text-sm text-left"
              >
                Help Center
              </button>
            </li>
            <li>
              <button
                type="button"
                className="text-body hover:text-heading transition-colors text-sm text-left"
              >
                Contact Us
              </button>
            </li>
            <li>
              <button
                type="button"
                className="text-body hover:text-heading transition-colors text-sm text-left"
              >
                Terms of Service
              </button>
            </li>
            <li>
              <button
                type="button"
                className="text-body hover:text-heading transition-colors text-sm text-left"
              >
                Privacy Policy
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="pt-6 border-t border-line-soft flex flex-col md:flex-row justify-between items-center mb-8">
        <p className="text-body text-sm">
          © 2024 TGIF Finance. All rights reserved.
        </p>
        <div className="flex items-center space-x-4 mt-4 md:mt-0">
          <span className="text-body text-sm">Built on</span>
          <div className="flex items-center space-x-2">
            <Image
              src="https://raw.githubusercontent.com/EisenFinance/assets/main/assets/icons/chains/kaia/kaia.png"
              alt="Kaia"
              width={20}
              height={20}
              className="w-5 h-5 rounded-pill"
            />
            <span className="text-heading font-heading font-semibold text-sm">
              Kaia Network
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
