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

  componentDidCatch(_error: Error, _errorInfo: React.ErrorInfo) {
    // ErrorBoundary caught an error
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="min-h-screen bg-bg-main flex items-center justify-center p-8">
            <div className="bg-surface-1 border border-line-soft rounded-lg p-8 max-w-md w-full shadow-2">
              <div className="text-center">
                <div className="text-6xl mb-4">⚠️</div>
                <h2 className="text-2xl font-bold text-heading mb-2 font-heading">
                  Something went wrong
                </h2>
                <p className="text-body mb-6">
                  {this.state.error?.message || "An unexpected error occurred"}
                </p>
                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  className="bg-primary-100 text-black font-semibold px-6 py-3 rounded-md hover:bg-primary-200 transition-colors font-heading"
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
