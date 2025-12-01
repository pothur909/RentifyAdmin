'use client';

import { ReactNode, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAdminAuth } from '../context/AuthContext'; // path is from /app/components

const PUBLIC_ROUTES = ['/admin-login'];

type AdminShellProps = {
  children: ReactNode;
};

export function AdminShell({ children }: AdminShellProps) {
  const { user, loading } = useAdminAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;

    // if not logged in and trying to open protected route
    if (!user && !PUBLIC_ROUTES.includes(pathname)) {
      router.replace('/admin-login');
    }
  }, [user, loading, pathname, router]);

  // while checking auth for protected pages, show a simple loader
  if (!user && !loading && !PUBLIC_ROUTES.includes(pathname)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-slate-600 text-sm">Checking access…</p>
      </div>
    );
  }

  return <>{children}</>;
}
