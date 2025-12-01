// // 'use client';

// // import { createContext, useContext, useEffect, useState } from 'react';

// // type AdminRole = 'super-admin' | 'admin' | 'sub-admin';

// // export type AdminUser = {
// //   id: string;
// //   name: string;
// //   email: string;
// //   role: AdminRole;
// //   token: string;
// //   allowedRoutes: string[];
// // };

// // type AdminAuthContextType = {
// //   user: AdminUser | null;
// //   loading: boolean;
// //   login: (user: AdminUser) => void;
// //   logout: () => void;
// // };

// // const AdminAuthContext = createContext<AdminAuthContextType | undefined>(
// //   undefined
// // );

// // export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
// //   const [user, setUser] = useState<AdminUser | null>(null);
// //   const [loading, setLoading] = useState(true);

// //   // hydrate from localStorage on first load
// //   useEffect(() => {
// //     if (typeof window === 'undefined') return;

// //     try {
// //       const raw = window.localStorage.getItem('adminUser');
// //       if (raw) {
// //         const parsed = JSON.parse(raw);
// //         setUser(parsed);
// //       }
// //     } catch (err) {
// //       console.error('Failed to parse adminUser from localStorage', err);
// //     } finally {
// //       setLoading(false);
// //     }
// //   }, []);

// //   const login = (newUser: AdminUser) => {
// //     setUser(newUser);
// //     if (typeof window !== 'undefined') {
// //       window.localStorage.setItem('adminUser', JSON.stringify(newUser));
// //     }
// //   };

// //   const logout = () => {
// //     setUser(null);
// //     if (typeof window !== 'undefined') {
// //       window.localStorage.removeItem('adminUser');
// //     }
// //   };

// //   return (
// //     <AdminAuthContext.Provider value={{ user, loading, login, logout }}>
// //       {children}
// //     </AdminAuthContext.Provider>
// //   );
// // }

// // export function useAdminAuth() {
// //   const ctx = useContext(AdminAuthContext);
// //   if (!ctx) {
// //     throw new Error('useAdminAuth must be used inside AdminAuthProvider');
// //   }
// //   return ctx;
// // }


// 'use client';

// import { createContext, useContext, useEffect, useState } from 'react';
// import { useRouter, usePathname } from 'next/navigation';

// // type AdminUser = {
// //   id: string;
// //   name: string;
// //   role: 'super-admin' | 'admin';
// // };

// export type AdminUser = {
//   id: string;
//   name: string;
//   email: string;
//   role: 'super-admin' | 'admin' | 'sub-admin';
//   allowedRoutes: string[];
// };


// type AdminAuthContextValue = {
//   user: AdminUser | null;
//   token: string | null;
//   loading: boolean;
//   login: (user: AdminUser, token: string) => void;
//   logout: () => void;
// };

// const AdminAuthContext = createContext<AdminAuthContextValue | undefined>(undefined);

// export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
//   const [user, setUser] = useState<AdminUser | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     try {
//       const stored = localStorage.getItem('rentify_admin_auth');
//       if (stored) {
//         const parsed = JSON.parse(stored);
//         setUser(parsed.user);
//       }
//     } catch (e) {
//       console.error('Failed to read admin auth from localStorage', e);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   const login = (user: AdminUser, token: string) => {
//     setUser(user);
//     localStorage.setItem(
//       'rentify_admin_auth',
//       JSON.stringify({ user, token })
//     );
//   };

//   const logout = () => {
//     setUser(null);
//     localStorage.removeItem('rentify_admin_auth');
//   };

//   return (
//     <AdminAuthContext.Provider value={{ user, token, loading, login, logout }}>
//       {children}
//     </AdminAuthContext.Provider>
//   );
// }

// export function useAdminAuth() {
//   const ctx = useContext(AdminAuthContext);
//   if (!ctx) {
//     throw new Error('useAdminAuth must be used inside AdminAuthProvider');
//   }
//   return ctx;
// }



'use client';

import { createContext, useContext, useEffect, useState } from 'react';

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: 'super-admin' | 'admin' | 'sub-admin';
  allowedRoutes: string[];
};

type AdminAuthContextValue = {
  user: AdminUser | null;
  token: string | null;
  loading: boolean;
  login: (user: AdminUser, token: string) => void;
  logout: () => void;
};

const AdminAuthContext = createContext<AdminAuthContextValue | undefined>(
  undefined
);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('rentify_admin_auth');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.user) {
          setUser(parsed.user);
        }
        if (parsed.token) {
          setToken(parsed.token);
        }
      }
    } catch (e) {
      console.error('Failed to read admin auth from localStorage', e);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (user: AdminUser, token: string) => {
    setUser(user);
    setToken(token);
    localStorage.setItem('rentify_admin_auth', JSON.stringify({ user, token }));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('rentify_admin_auth');
  };

  return (
    <AdminAuthContext.Provider
      value={{ user, token, loading, login, logout }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) {
    throw new Error('useAdminAuth must be used inside AdminAuthProvider');
  }
  return ctx;
}
