import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "./supabase";
 
// 로그인 상태(세션)를 돌려주는 훅. 로그인/로그아웃하면 자동으로 갱신돼요.
export function useSession() {
  const [session, setSession] = useState<Session | null>(null);
 
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data } = supabase.auth.onAuthStateChange((_event, s) => setSession(s));
    return () => data.subscription.unsubscribe();
  }, []);
 
  return session;
}