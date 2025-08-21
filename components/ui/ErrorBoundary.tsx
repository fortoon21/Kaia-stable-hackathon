"use client";

import React, { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="min-h-screen bg-[#08131f] flex items-center justify-center p-8">
            <div className="bg-[#0c1d2f] border border-[#14304e] rounded-2xl p-8 max-w-md w-full">
              <div className="text-center">
                <div className="text-6xl mb-4">⚠️</div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  Something went wrong
                </h2>
                <p className="text-[#728395] mb-6">
                  {this.state.error?.message || "An unexpected error occurred"}
                </p>
                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  className="bg-[#2ae5b9] text-black font-semibold px-6 py-3 rounded-lg hover:bg-[#17e3c2] transition-colors"
                >
                  Reload Page
                </button>
              </div>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
