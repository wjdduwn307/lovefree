import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "./lib/supabase";
import LoginModal from "./LoginModal";
import Home from "./Home";

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => data.subscription.unsubscribe();
  }, []);

  return (
    <>
      <Home
        loggedIn={!!session}
        onLoginClick={() => setShowLogin(true)}
        onLogout={() => supabase.auth.signOut()}
      />
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </>
  );
}