import React from 'react';
import { AlertCircle, RefreshCcw, Home } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('App Crash Captured:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#fafafa] p-6 selection:bg-pink-100">
          <div className="max-w-md w-full bg-white rounded-[48px] p-12 shadow-2xl border border-gray-50 text-center space-y-8 animate-fade-in">
            <div className="w-24 h-24 bg-red-50 rounded-[32px] flex items-center justify-center mx-auto text-red-500 shadow-inner">
              <AlertCircle className="w-12 h-12" />
            </div>
            
            <div className="space-y-4">
              <h1 className="text-3xl font-black text-gray-900 tracking-tighter">Something went wrong</h1>
              <p className="text-gray-500 font-medium leading-relaxed">
                An unexpected error occurred while rendering the app. We've captured the report and are working on it.
              </p>
              
              {process.env.NODE_ENV === 'development' && (
                <div className="bg-gray-50 p-6 rounded-3xl text-left overflow-auto max-h-40 border border-gray-100">
                  <p className="text-[10px] font-black uppercase text-gray-400 mb-2 tracking-widest">Error Trace</p>
                  <code className="text-xs text-red-400 font-bold break-all leading-relaxed">
                    {this.state.error?.toString()}
                  </code>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-3 pt-4">
              <button 
                onClick={() => window.location.reload()}
                className="w-full bg-gray-900 text-white font-black py-5 rounded-3xl flex items-center justify-center gap-3 hover:bg-black transition-all shadow-xl active:scale-95"
              >
                <RefreshCcw className="w-5 h-5" /> Reload Application
              </button>
              <button 
                onClick={() => {
                  this.setState({ hasError: false });
                  window.location.href = '/';
                }}
                className="w-full bg-gray-50 text-gray-400 font-black py-5 rounded-3xl flex items-center justify-center gap-3 hover:bg-pink-50 hover:text-pink-500 transition-all active:scale-95"
              >
                <Home className="w-5 h-5" /> Back to Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
