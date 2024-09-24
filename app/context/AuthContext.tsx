// import React, {
//   createContext,
//   useContext,
//   useEffect,
//   useState,
//   ReactNode,
// } from "react";
// import { Session, User } from "@supabase/supabase-js";
// import { getAuthSession } from "~/utils/auth.server";


// interface AuthContextProps {
//   session: Session | null;
//   user: User | null;
//   isAuthenticated: () => Promise<boolean>;
// }

// const AuthContext = createContext<AuthContextProps | null>(null);

// interface AuthProviderProps {
//   children: ReactNode;
//   initialSession: Session | null;
// }

// export const AuthProvider = ({ children, initialSession }: AuthProviderProps) => {
//   const [session, setSession] = useState<Session | null>(initialSession);
//   const [user, setUser] = useState<User | null>(initialSession?.user ?? null); // Store user data
//   const [loading, setLoading] = useState(!initialSession); // Add loading state

//   // Initialize session and auth state
//   useEffect(() => {
//     if (!initialSession) {
//       const initializeAuth = async () => {
//         const session = await getAuthSession();
//         setSession(session);
//         setUser(session?.user ?? null); // Set user if session exists
//         setLoading(false); // Set loading to false after fetching session
//       };

//       initializeAuth();
//     }
//   }, [initialSession]);

//   // Function to check if user is authenticated
//   const isAuthenticated = async (): Promise<boolean> => {
//     const session = await getAuthSession();
//     return session?.user != null;
//   };

//   if (loading) {
//     return <div>Loading...</div>; // Render loader while loading
//   }

//   return (
//     <AuthContext.Provider value={{ session, user, isAuthenticated }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// // Hook to use the AuthContext
// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error("useAuth must be used within an AuthProvider");
//   }
//   return context;
// };
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Session, User } from "@supabase/supabase-js";

interface AuthContextProps {
  session: Session | null;
  user: User | null;
  isAuthenticated: () => boolean;
}

const AuthContext = createContext<AuthContextProps | null>(null);

interface AuthProviderProps {
  children: ReactNode;
  initialSession: Session | null;
}

export const AuthProvider = ({ children, initialSession }: AuthProviderProps) => {
  const [session, setSession] = useState<Session | null>(initialSession);
  const [user, setUser] = useState<User | null>(initialSession?.user ?? null);

  useEffect(() => {
    setSession(initialSession);
    setUser(initialSession?.user ?? null);
  }, [initialSession]);

  const isAuthenticated = (): boolean => {
    return !!user; // Check if the user is authenticated
  };

  return (
    <AuthContext.Provider value={{ session, user, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
