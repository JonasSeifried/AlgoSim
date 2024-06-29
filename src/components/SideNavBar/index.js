'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

const SideNavBar = () => {
  const pathname = usePathname();
  const routes = [
    { name: 'Home', path: '/' },
    { name: 'Boids', path: '/boids' },
    { name: 'Fractal Tree', path: '/fractals/tree' },
  ];

  return (
    <div className={`h-full transition-all pl-6 pt-4 pr-8 flex flex-col rounded-e-3xl shadow-2xl`}>
      <Link href="/" className="text-xl text-nowrap">
        Algo Sim
      </Link>
      <hr className="my-2 border-1 border-slate-500" />

      <nav className="flex flex-col">
        {routes.map((r) => (
          <Link
            key={r.path}
            href={r.path}
            className={`w-fit p-1 text-nowrap ${pathname === r.path ? 'rounded-xl bg-gray-300' : ''}`}
          >
            {r.name}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default SideNavBar;
