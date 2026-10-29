import { useEffect } from 'react';

export interface PageMetaOptions {
  title: string;
  description: string;
}

export function formatDocumentTitle(pageTitle: string): string {
  const trimmed = pageTitle.trim();
  if (!trimmed || trimmed === 'NxK Tools') {
    return 'NxK Tools — Powerful Tools. Zero Hassle.';
  }
  if (trimmed.includes('NxK Tools')) {
    return trimmed;
  }
  return `${trimmed} | NxK Tools`;
}

export function usePageMeta({ title, description }: PageMetaOptions): void {
  useEffect(() => {
    const fullTitle = formatDocumentTitle(title);
    document.title = fullTitle;

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', description);
    }

    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', fullTitle);
    }

    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) {
      ogDescription.setAttribute('content', description);
    }
  }, [title, description]);
}
