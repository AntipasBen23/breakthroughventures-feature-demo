'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();

  const links = [
    { href: '/', label: 'Live Demo Day', icon: '🔴' },
    { href: '/investor', label: 'Investor Portal', icon: '💼' },
    { href: '/founder', label: 'Founder Dashboard', icon: '🚀' },
    { href: '/scan', label: 'QR Scanner', icon: '📱' },
    { href: '/admin', label: 'Admin Center', icon: '⚙️' },
  ];

  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-full px-2 py-2 shadow-2xl">
      <div className="flex items-center gap-1">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all
              ${pathname === link.href 
                ? 'bg-blue-500 text-white shadow-lg' 
                : 'text-gray-400 hover:text-white hover:bg-white/5'
              }
            `}
          >
            <span>{link.icon}</span>
            <span className="hidden md:inline">{link.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}