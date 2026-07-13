import { Component, type ReactNode, type ErrorInfo } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Global error boundary to catch rendering errors gracefully.
 * Prevents the entire app from crashing on unhandled exceptions.
 */
export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[var(--bg)] p-8 text-center">
          <div className="text-6xl">💥</div>
          <h1 className="text-2xl font-bold text-[var(--text)]">Something went wrong</h1>
          <p className="max-w-md text-[var(--muted)]">
            An unexpected error occurred. Please try refreshing the page.
          </p>
          <pre className="mt-2 max-w-lg overflow-auto rounded-lg bg-[var(--bg-card)] p-4 text-left text-xs text-[var(--muted)]">
            {this.state.error?.message}
          </pre>
          <button
            onClick={() => {
              this.setState({ hasError: false, error: null });
              window.location.href = '/PokeGuru/';
            }}
            className="mt-4 rounded-lg bg-[var(--accent)] px-6 py-2.5 font-medium text-white hover:bg-[#dc2626] transition-colors"
          >
            Go Home
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
