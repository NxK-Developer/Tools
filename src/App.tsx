/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { SiteHeader } from './components/SiteHeader';
import { SiteFooter } from './components/SiteFooter';
import { HomePage } from './pages/HomePage';
import { ToolsDirectoryPage } from './pages/ToolsDirectoryPage';
import { CategoryPage } from './pages/CategoryPage';
import { ToolPage } from './pages/ToolPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { TermsPage } from './pages/TermsPage';
import { NotFoundPage } from './pages/NotFoundPage';

function ScrollToTopOnNavigate() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname]);

  return null;
}

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <ScrollToTopOnNavigate />
        <div className="flex min-h-screen flex-col bg-[var(--bg-canvas)] text-[var(--text-primary)]">
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-[var(--accent-primary)] focus:px-4 focus:py-2 focus:text-xs focus:font-semibold focus:text-[var(--accent-contrast)]"
          >
            Skip to main content
          </a>
          <SiteHeader />
          <main id="main-content" className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/tools" element={<ToolsDirectoryPage />} />
              <Route path="/tools/:toolId" element={<ToolPage />} />
              <Route path="/category/:categoryId" element={<CategoryPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          <SiteFooter />
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}
