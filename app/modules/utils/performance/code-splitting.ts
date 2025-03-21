import React from 'react';

export function createLazyRoute(importFn: () => Promise<{ default: React.ComponentType }>) {
  return React.lazy(async () => {
    try {
      const module = await importFn();
      return { default: module.default };
    } catch (error) {
      // Log and handle route loading errors
      console.error('Route loading failed:', error);
      throw error;
    }
  });
}

export function withPerformanceTracking<P = {}>(
  WrappedComponent: React.ComponentType<P>
) {
  return class extends React.Component<P> {
    private renderStartTime: number = Date.now();

    componentDidMount() {
      const renderDuration = Date.now() - this.renderStartTime;
      
      if (renderDuration > 500) {  // Log if rendering takes more than 500ms
        console.warn(
          `Slow component render: ${WrappedComponent.name}`, 
          { duration: renderDuration }
        );
      }
    }

    render() {
      return React.createElement(WrappedComponent, this.props);
    }
  };
}
