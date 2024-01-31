"use client";

import { createContext, ReactNode, useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/supabase";

export const AuthContext = createContext<Session | null>(null);

interface Props {
  children?: ReactNode;
}

export const AuthProvider: React.FC<Props> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [isSessionLoading, setIsSessionLoading] = useState<boolean>(true);

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
      });
      setIsSessionLoading(false);
    };

    getSession();
  }, []);

  if (isSessionLoading) return <div></div>;

  return (
    <AuthContext.Provider value={session}>{children}</AuthContext.Provider>
  );
};
