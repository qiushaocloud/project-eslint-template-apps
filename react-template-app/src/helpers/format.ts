interface ExtendedError {
    message: string;
    stack?: string;
}

interface ErrorEvent {
    message: string;
    filename?: string;
    lineno?: number;
    colno?: number;
    stack?: string;
    error?: ExtendedError;
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const formatLog = (logarg: any): string => {
  let str = '';

  try {
    if (typeof logarg === 'function') {
      str += Object.prototype.toString.call(logarg);
    } else if (typeof logarg === 'object') {
      if (
        Object.prototype.toString.call(logarg) === '[object ErrorEvent]'
          || logarg instanceof Error
      ) {
        const evjson: ErrorEvent = {
          message: logarg.message,
          filename: logarg.filename,
          lineno: logarg.lineno,
          colno: logarg.colno
        };

        if (logarg.stack) evjson.stack = logarg.stack;

        if (logarg.error && typeof logarg.error === 'object') {
          const error: ExtendedError = {
            message: logarg.error.message,
          };

          if (logarg.error.stack) {
            error.stack = logarg.error.stack;
          }

          evjson.error = error;
        }

        str += JSON.stringify(evjson);
      } else if (Array.isArray(logarg)) {
        str += JSON.stringify(logarg);
      } else if (logarg instanceof HTMLElement) {
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        str = `HTMLElement[${logarg.id || `${logarg}`}]`;
      } else {
        str += JSON.stringify(logarg);
      }
    } else {
      str += logarg;
    }
  } catch (e) {
    // console.error('_formatLog err:', e);
    str += logarg;
  }

  return str;
};
