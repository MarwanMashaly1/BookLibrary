// import {
//   createContext,
//   useContext,
//   useEffect,
//   useState,
//   ReactNode,
// } from "react";
// import { supabase } from "~/utils/auth.client";
// import { Session } from "@supabase/supabase-js";

// // Initialize the context with null
// const AuthContext = createContext<Session | null>(null);

// interface AuthProviderProps {
//   children: ReactNode;
// }

// export const AuthProvider = ({ children }: AuthProviderProps) => {
//   const [session, setSession] = useState<Session | null>(null); // State to hold the session

//   useEffect(() => {
//     // Fetch the initial session when the component mounts
//     const getSession = async () => {
//       const {
//         data: { session },
//       } = await supabase.auth.getSession();
//       setSession(session); // Set the session state
//     };

//     getSession(); // Call to get the initial session state

//     // Set up the onAuthStateChange listener to respond to login/signup/logout
//     const {
//       data: { subscription },
//     } = supabase.auth.onAuthStateChange((_event, session) => {
//       setSession(session); // Automatically update session on any auth change
//     });

//     // Clean up the listener on unmount to prevent memory leaks
//     return () => subscription?.unsubscribe();
//   }, []);

//   return (
//     <AuthContext.Provider value={session}>{children}</AuthContext.Provider>
//   );
// };

// // Hook to use the Auth context
// export const useAuth = () => useContext(AuthContext);

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { supabase } from "~/utils/auth.client";
import { Session, User } from "@supabase/supabase-js";
import { redirect } from "@remix-run/node";
import { destroySession, getSession } from "~/utils/session.server";

interface AuthContextProps {
  session: Session | null;
  user: User | null;
  isAuthenticated: () => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null); // Store user data

  // Initialize session and auth state
  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null); // Set user if session exists
    };

    getSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => subscription?.unsubscribe();
  }, []);

  // Function to check if user is authenticated
  const isAuthenticated = async (): Promise<boolean> => {
    const { data } = await supabase.auth.getSession();
    return data?.session?.user != null;
  };

  // Function to log out and destroy session
  const logout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ session, user, isAuthenticated, logout }}>
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
