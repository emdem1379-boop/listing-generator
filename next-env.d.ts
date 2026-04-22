import Link from 'next/link';

export function Header() {
  const appName = process.env.NEXT_PUBLIC_APP_NAME || 'Instant Marketplace Listing Kit';

  return (
    <header className="siteHeader">
      <div className="container headerInner">
        <Link href="/" className="brand">
          {appName}
        </Link>
        <nav className="nav">
          <Link href="/tool">Generator</Link>
          <a href="#pricing">Pricing</a>
        </nav>
      </div>
    </header>
  );
}
