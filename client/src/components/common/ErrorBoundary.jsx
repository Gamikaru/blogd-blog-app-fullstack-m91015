import { Button } from '@components';
import { logger } from '@utils';
import React from 'react';

class ErrorBoundary extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
        };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({ errorInfo });
        logger.error('Error Boundary caught an error:', { error, errorInfo });
    }

    handleRetry = () => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null,
        });
    };

    render() {
        const { hasError, error, errorInfo } = this.state;

        if (hasError) {
            return (
                <div className="error-boundary">
                    <h3>Something went wrong</h3>
                    <Button
                        variant="submit"
                        className="button button-retry"
                        onClick={this.handleRetry}
                    >
                        Retry
                    </Button>
                    {process.env.NODE_ENV === 'development' && (
                        <details style={{ whiteSpace: 'pre-wrap', marginTop: '1rem' }}>
                            <summary>Error Details</summary>
                            {error && error.toString()}
                            <br />
                            {errorInfo?.componentStack}
                        </details>
                    )}
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
