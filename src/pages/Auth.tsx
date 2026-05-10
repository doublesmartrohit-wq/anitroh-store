import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const Auth = () => {
  const { session, loading } = useAuth();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);

  useEffect(() => { document.title = "Sign in — ANITROH STORE"; }, []);

  if (!loading && session) return <Navigate to="/account" replace />;

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBusy(true);
    const fd = new FormData(e.currentTarget);
    const { error } = await supabase.auth.signInWithPassword({
      email: String(fd.get("email")),
      password: String(fd.get("password")),
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Welcome back!");
    navigate("/account");
  };

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBusy(true);
    const fd = new FormData(e.currentTarget);
    const { error } = await supabase.auth.signUp({
      email: String(fd.get("email")),
      password: String(fd.get("password")),
      options: {
        emailRedirectTo: `${window.location.origin}/account`,
        data: { full_name: String(fd.get("name") || "") },
      },
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Account created successfully!.");
    navigate("/account");
  };

  const handleGoogle = async () => {
  setBusy(true);

const { error } = await supabase.auth.signInWithOAuth({
  provider: "google",
  options: {
    redirectTo: `${window.location.origin}/`,
  },
});


  if (error) {
    toast.error(error.message);
    setBusy(false);
  }
};

  return (
    <div className="container-x py-16 max-w-md">
      <h1 className="font-display text-4xl font-bold mb-2 text-center">ANITROH STORE</h1>
      <p className="text-center text-muted-foreground mb-8">Sign in to track orders & save favourites</p>

      <Button onClick={handleGoogle} variant="outline" className="w-full mb-6" disabled={busy}>
        Continue with Google
      </Button>

      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border" /></div>
        <div className="relative flex justify-center text-xs uppercase"><span className="bg-background px-2 text-muted-foreground">Or with email</span></div>
      </div>

      <Tabs defaultValue="login">
        <TabsList className="grid grid-cols-2 mb-6">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="register">Register</TabsTrigger>
        </TabsList>

        <TabsContent value="login">
          <form className="space-y-4" onSubmit={handleSignIn}>
            <div><Label>Email</Label><Input name="email" type="email" required /></div>
            <div><Label>Password</Label><Input name="password" type="password" required minLength={6} /></div>
            <Button type="submit" variant="hero" className="w-full" disabled={busy}>Sign In</Button>
          </form>
        </TabsContent>

        <TabsContent value="register">
          <form className="space-y-4" onSubmit={handleSignUp}>
            <div><Label>Full name</Label><Input name="name" required /></div>
            <div><Label>Email</Label><Input name="email" type="email" required /></div>
            <div><Label>Password</Label><Input name="password" type="password" required minLength={6} /></div>
            <Button type="submit" variant="hero" className="w-full" disabled={busy}>Create Account</Button>
          </form>
        </TabsContent>
      </Tabs>

      <p className="text-center text-xs text-muted-foreground mt-6">
        <Link to="/" className="hover:text-foreground">← Back to store</Link>
      </p>
    </div>
  );
};

export default Auth;
