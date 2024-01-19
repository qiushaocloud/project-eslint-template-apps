import React from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import ErrorBoundary from './ErrorBoundary/ErrorBoundary';
import HomePage from '@pages/Home';
import AboutPage from '@pages/About';
import BlogPage from '@pages/Blog';

const Router: React.FC = () => {
  return (
    <ErrorBoundary>

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/blog" element={<BlogPage />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
};

export default Router;
