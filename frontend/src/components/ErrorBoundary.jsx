import { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("[ErrorBoundary] Caught error:", error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-obsidian px-6 text-center">
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-rose/30 bg-rose-deep/10 text-rose">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <h1 className="font-display text-3xl text-ivory">Something went wrong</h1>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-smoke">
            An unexpected error occurred. Our team has been notified. Please return to the homepage and try again.
          </p>
          {import.meta.env.DEV && this.state.error && (
            <pre className="mt-6 max-w-lg overflow-auto rounded-xl border border-obsidian-border bg-obsidian-light/40 p-4 text-left text-[11px] text-rose/80">
              {this.state.error.message}
            </pre>
          )}
          <button
            onClick={this.handleReset}
            className="mt-8 rounded-full bg-gold px-6 py-3 text-sm font-semibold text-obsidian transition-colors hover:bg-gold-light"
          >
            Return to Homepage
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
