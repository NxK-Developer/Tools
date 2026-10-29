export interface SocialContactLink {
  id: 'developer-instagram' | 'personal-instagram' | 'whatsapp';
  label: string;
  shortLabel: string;
  handleOrNumber: string;
  url: string;
  description: string;
}

export interface ProjectTechnology {
  name: string;
  role: string;
  description: string;
}

export const DEVELOPER_CONFIG = {
  productBrand: 'NxK Tools',
  tagline: 'Powerful Tools. Zero Hassle.',
  developerBrand: 'NxK Developer',
  founder: 'Nishant Singh',
  attribution: 'Designed & Developed by NxK Developer',
  instagram: {
    developer: {
      id: 'developer-instagram' as const,
      label: 'Developer Instagram',
      shortLabel: 'Instagram (@nxk-developer)',
      handleOrNumber: '@nxk-developer',
      url: 'https://www.instagram.com/nxk-developer/',
      description: 'Official updates, product releases, and web utility announcements from NxK Developer.',
    },
    personal: {
      id: 'personal-instagram' as const,
      label: 'Personal Instagram',
      shortLabel: 'Instagram (@_its.nishant)',
      handleOrNumber: '@_its.nishant',
      url: 'https://www.instagram.com/_its.nishant/',
      description: 'Connect directly with founder Nishant Singh on Instagram.',
    },
  },
  whatsapp: {
    id: 'whatsapp' as const,
    label: 'WhatsApp',
    shortLabel: 'WhatsApp (+91 7050809305)',
    handleOrNumber: '+91 7050809305',
    url: 'https://wa.me/917050809305',
    description: 'Direct WhatsApp chat for feedback, bug reports, or questions about NxK Tools.',
  },
  technologies: [
    {
      name: 'React',
      role: 'Component UI Architecture',
      description: 'Powers interactive tool workspaces, stateful inputs, and client-side routing.',
    },
    {
      name: 'Vite',
      role: 'Frontend Build & Bundling',
      description: 'Provides fast module bundling and optimized asset delivery.',
    },
    {
      name: 'JavaScript',
      role: 'Client-Side Processing Logic',
      description: 'Executes calculations, text parsing, QR encoding, and PDF assembly directly in your browser.',
    },
    {
      name: 'HTML',
      role: 'Semantic Structure & Canvas API',
      description: 'Delivers accessible landmarks, form controls, and HTML5 Canvas image processing.',
    },
    {
      name: 'CSS',
      role: 'Liquid Glass Styling & Themes',
      description: 'Implements responsive layouts, translucent glass surfaces, and adaptive Light and Dark modes.',
    },
  ] satisfies ProjectTechnology[],
} as const;

export function getContactLinks(): SocialContactLink[] {
  return [
    DEVELOPER_CONFIG.instagram.developer,
    DEVELOPER_CONFIG.instagram.personal,
    DEVELOPER_CONFIG.whatsapp,
  ];
}

export function buildWhatsAppMessageUrl(params: {
  name: string;
  topic?: string;
  message: string;
}): string {
  const lines = [
    `Hello ${DEVELOPER_CONFIG.developerBrand},`,
    `Name: ${params.name.trim()}`,
    params.topic?.trim() ? `Topic: ${params.topic.trim()}` : null,
    '',
    params.message.trim(),
  ].filter((line): line is string => line !== null);

  const text = encodeURIComponent(lines.join('\n'));
  return `${DEVELOPER_CONFIG.whatsapp.url}?text=${text}`;
}
