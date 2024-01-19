import React, {Component, ReactNode, ErrorInfo} from 'react';
import {formatLog} from '@helpers/format';
import './errorBoundary.scss';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  error?: Error;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor (props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      error: undefined,
    };
  }

  static getDerivedStateFromError (error: Error, errorInfo: ErrorInfo): ErrorBoundaryState {
    // eslint-disable-next-line no-console
    console.error('Error detected: ', error, errorInfo);
    return {error};
  }

  getErrorContentElements (): ReactNode[] {
    if (!this.state.error) {
      return [];
    }

    const elements: ReactNode[] = [];
    let errorJson: Record<string, any> = {};

    try {
      errorJson = JSON.parse(formatLog(this.state.error));
    } catch (err) {
      errorJson = {};
    }

    for (const key in errorJson) {
      const val = errorJson[key];
      let detailArr = [val];

      if (val && typeof val === 'string' && val.indexOf('\\n') !== -1) {
        detailArr = val.split('\\n');
      }

      elements.push(
        <div key={key} className={`error-content-item ${key}`}>
          <hr />
          <span className='key'>{key}:</span><br />
          <div className='detail'>
            {detailArr.map((detail, index) => {
              return (
                <p key={`${key}-${index}`}>{detail}</p>
              );
            })}
          </div>
        </div>
      );
    }

    return elements;
  }

  render (): ReactNode {
    return (
      <div className='error-boundary-box'>
        {this.state.error ? (
          <div className='error-box'>
            <h1 className='title'>Error Occurred</h1>
            <div className='content'>{this.getErrorContentElements()}</div>
          </div>
        ) : (
          this.props.children
        )}
      </div>
    );
  }
}

export default ErrorBoundary;
