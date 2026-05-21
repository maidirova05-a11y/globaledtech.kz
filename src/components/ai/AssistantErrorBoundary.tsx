import { Component, ReactNode } from "react";

type AssistantErrorBoundaryProps = {
  children: ReactNode;
};

type AssistantErrorBoundaryState = {
  hasError: boolean;
};

class AssistantErrorBoundary extends Component<
  AssistantErrorBoundaryProps,
  AssistantErrorBoundaryState
> {
  state: AssistantErrorBoundaryState = {
    hasError: false,
  };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch() {
    console.error("AI assistant UI crashed.");
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="ai-floating-root">
          <div className="ai-fallback-card" role="status" aria-live="polite">
            <p className="ai-fallback-title">AI assistant is temporarily unavailable</p>
            <p className="ai-fallback-text">Please refresh the page or try again in a moment.</p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default AssistantErrorBoundary;
