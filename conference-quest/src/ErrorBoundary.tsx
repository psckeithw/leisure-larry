import { Component, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '20px',
          background: '#1a0000',
          color: '#ff6b6b',
          fontFamily: 'monospace',
          minHeight: '100vh'
        }}>
          <h1 style={{ color: '#ff4444' }}>Render Error</h1>
          <pre style={{ 
            whiteSpace: 'pre-wrap', 
            fontSize: '14px',
            background: '#2a0000',
            padding: '16px',
            borderRadius: '4px',
            overflow: 'auto',
            maxHeight: '80vh'
          }}>
            {this.state.error?.message}
            {'\n\n'}
            {this.state.error?.stack}
          </pre>
        </div>
      );
    }

    return this.props.children;
  }
}
