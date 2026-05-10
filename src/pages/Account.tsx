import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, User, MapPin, Heart, LogOut, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import OrdersList from "@/components/site/OrdersList";

interface Profile {
  full_name: string | null;
  phone: string | null;
  address_line1: string | null;
  address_line2: string | null;
  city: string | null;
  state: string | null;
  pincode: string | null;
  country: string | null;
}

const Account = () => {
  const { user, signOut, isAdmin } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => { document.title = "My Account — ANITROH STORE"; }, []);

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("*").eq("user_id", user.id).maybeSingle()
      .then(({ data }) => setProfile(data as Profile | null));
  }, [user]);

  const saveProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    const fd = new FormData(e.currentTarget);
    const updates = {
      full_name: String(fd.get("full_name") || ""),
      phone: String(fd.get("phone") || ""),
      address_line1: String(fd.get("address_line1") || ""),
      address_line2: String(fd.get("address_line2") || ""),
      city: String(fd.get("city") || ""),
      state: String(fd.get("state") || ""),
      pincode: String(fd.get("pincode") || ""),
    };
    const { error } = await supabase.from("profiles").update(updates).eq("user_id", user.id);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Profile saved");
    setProfile({ ...(profile || {} as Profile), ...updates });
  };

  return (
    <div className="container-x py-12">
      <div className="flex flex-wrap items-start justify-between gap-4 mb-10">
        <div>
          <h1 className="font-display text-4xl font-bold mb-2">My Account</h1>
          <p className="text-muted-foreground">{user?.email}</p>
        </div>
        <div className="flex gap-2">
          {isAdmin && (
            <Button asChild variant="outline"><Link to="/admin"><ShieldCheck size={16} className="mr-2" />Admin</Link></Button>
          )}
          <Button variant="ghost" onClick={signOut}><LogOut size={16} className="mr-2" />Sign out</Button>
        </div>
      </div>

      <Tabs defaultValue="profile" className="max-w-3xl">
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="profile"><User size={16} className="mr-2" />Profile</TabsTrigger>
          <TabsTrigger value="orders"><Package size={16} className="mr-2" />Orders</TabsTrigger>
          <TabsTrigger value="address"><MapPin size={16} className="mr-2" />Address</TabsTrigger>
          <TabsTrigger value="wishlist"><Heart size={16} className="mr-2" />Wishlist</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <form onSubmit={saveProfile} className="border border-border p-6 rounded-sm space-y-4 max-w-lg">
            <div><Label>Full name</Label><Input name="full_name" defaultValue={profile?.full_name || ""} /></div>
            <div><Label>Phone</Label><Input name="phone" defaultValue={profile?.phone || ""} /></div>
            <Button type="submit" variant="hero" disabled={saving}>Save Profile</Button>
          </form>
        </TabsContent>

        <TabsContent value="orders">
          <OrdersList userId={user?.id} />
        </TabsContent>

        <TabsContent value="address">
          <form onSubmit={saveProfile} className="border border-border p-6 rounded-sm space-y-4 max-w-lg">
            <div><Label>Address line 1</Label><Input name="address_line1" defaultValue={profile?.address_line1 || ""} /></div>
            <div><Label>Address line 2</Label><Input name="address_line2" defaultValue={profile?.address_line2 || ""} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>City</Label><Input name="city" defaultValue={profile?.city || ""} /></div>
              <div><Label>State</Label><Input name="state" defaultValue={profile?.state || ""} /></div>
            </div>
            <div><Label>Pincode</Label><Input name="pincode" defaultValue={profile?.pincode || ""} /></div>
            {/* hidden fields so saveProfile picks up profile fields */}
            <input type="hidden" name="full_name" value={profile?.full_name || ""} />
            <input type="hidden" name="phone" value={profile?.phone || ""} />
            <Button type="submit" variant="hero" disabled={saving}>Save Address</Button>
          </form>
        </TabsContent>

        <TabsContent value="wishlist">
          <Button asChild variant="hero"><Link to="/wishlist">View Full Wishlist</Link></Button>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Account;
