export function assetUrl(path: string): string {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) return path;

  // If already prefixed, avoid duplicate prefixing
  if (path.startsWith('/Santhiram-college/')) return path;
  if (path.startsWith('Santhiram-college/')) return `/${path}`;

  let base = process.env.NEXT_PUBLIC_BASE_PATH || '';

  // Client-side safety check: detect GitHub Pages repository path if in browser
  if (!base && typeof window !== 'undefined' && window.location.pathname.startsWith('/Santhiram-college')) {
    base = '/Santhiram-college';
  }

  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${base}${cleanPath}`;
}
