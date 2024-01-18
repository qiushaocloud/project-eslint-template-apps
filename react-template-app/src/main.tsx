import * as React from 'react';
import * as ReactDOM from 'react-dom/client';

import App from './App';

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const root = ReactDOM.createRoot(document.getElementById('app')!);
// v18 的新方法
root.render(<App />);