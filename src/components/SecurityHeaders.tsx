
import { useEffect } from 'react';

const SecurityHeaders = () => {
  useEffect(() => {
    // Set security headers via meta tags for client-side protection
    const metaElements = [
      {
        name: 'referrer',
        content: 'strict-origin-when-cross-origin'
      },
      {
        name: 'x-content-type-options',
        content: 'nosniff'
      },
      {
        name: 'x-frame-options',
        content: 'DENY'
      },
      {
        name: 'x-xss-protection',
        content: '1; mode=block'
      }
    ];

    metaElements.forEach(({ name, content }) => {
      const existingMeta = document.querySelector(`meta[name="${name}"]`);
      if (!existingMeta) {
        const meta = document.createElement('meta');
        meta.name = name;
        meta.content = content;
        document.head.appendChild(meta);
      }
    });

    // Add CSP via meta tag
    const cspMeta = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
    if (!cspMeta) {
      const meta = document.createElement('meta');
      meta.httpEquiv = 'Content-Security-Policy';
      meta.content = "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.gpteng.co; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://*.supabase.co; font-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self';";
      document.head.appendChild(meta);
    }
  }, []);

  return null;
};

export default SecurityHeaders;
