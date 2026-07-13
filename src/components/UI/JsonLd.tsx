import { useEffect } from 'react';

/**
 * Injects a JSON-LD <script> into <head> for the lifetime of the component.
 * Used for per-page structured data (e.g. Product schema on card pages).
 */
export default function JsonLd({ data, id }: { data: unknown; id: string }) {
  useEffect(() => {
    const elId = `jsonld-${id}`;
    let el = document.getElementById(elId) as HTMLScriptElement | null;
    if (!el) {
      el = document.createElement('script');
      el.type = 'application/ld+json';
      el.id = elId;
      document.head.appendChild(el);
    }
    el.textContent = JSON.stringify(data);
    return () => { el?.remove(); };
  }, [data, id]);
  return null;
}
