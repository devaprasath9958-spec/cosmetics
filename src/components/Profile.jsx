import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, MapPin, Package, Shield, Edit3, Save, Trash2, Plus, Check, Star, LogOut, ArrowRight, Eye, Sparkles, ChevronDown } from "lucide-react";
import { supabase } from "../supabaseClient";
import { fetchOrders } from "../services/api.js";

export default function Profile() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("personal");
  
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({});
  const [profileSuccess, setProfileSuccess] = useState(false);

  const [addresses, setAddresses] = useState([]);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [addressForm, setAddressForm] = useState({
    label: "Shipping",
    name: "",
    address: "",
    cityStateZip: "",
    phone: ""
  });

  const [orders, setOrders] = useState([]);

  const [securityForm, setSecurityForm] = useState({
    newPassword: "",
    confirmPassword: ""
  });
  const [securityLoading, setSecurityLoading] = useState(false);
  const [securitySuccess, setSecuritySuccess] = useState(false);
  const [securityError, setSecurityError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/login");
        return;
      }
      
      const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
      if (profile) {
        setUserInfo(profile);
        setProfileForm(profile);
        setAddresses(profile.addresses || []);
      }

      const userOrders = await fetchOrders();
      setOrders(userOrders);
      
      setLoading(false);
    };
    fetchData();
  }, [navigate]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    const { data: { user } } = await supabase.auth.getUser();
    
    await supabase.from("profiles").update({
      name: profileForm.name,
      phone: profileForm.phone
    }).eq("id", user.id);
    
    setUserInfo({ ...userInfo, ...profileForm });
    setIsEditingProfile(false);
    setProfileSuccess(true);
    setTimeout(() => setProfileSuccess(false), 2500);
  };

  const handleSetDefaultAddress = async (id) => {
    const updated = addresses.map((addr) => ({
      ...addr,
      isDefault: addr.id === id,
      label: addr.id === id ? "Primary Shipping" : addr.label
    }));
    setAddresses(updated);
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from("profiles").update({ addresses: updated }).eq("id", user.id);
  };

  const handleDeleteAddress = async (id) => {
    const updated = addresses.filter((addr) => addr.id !== id);
    setAddresses(updated);
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from("profiles").update({ addresses: updated }).eq("id", user.id);
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    const newAddress = {
      id: Date.now(),
      isDefault: addresses.length === 0,
      ...addressForm
    };
    const updated = [...addresses, newAddress];
    setAddresses(updated);
    setIsAddingAddress(false);
    setAddressForm({
      label: "Shipping", name: "", address: "", cityStateZip: "", phone: ""
    });
    
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from("profiles").update({ addresses: updated }).eq("id", user.id);
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (!securityForm.newPassword || !securityForm.confirmPassword) {
      setSecurityError("All password fields are required.");
      return;
    }
    if (securityForm.newPassword !== securityForm.confirmPassword) {
      setSecurityError("New passwords do not match.");
      return;
    }
    setSecurityError("");
    setSecurityLoading(true);

    const { error } = await supabase.auth.updateUser({
      password: securityForm.newPassword
    });

    setSecurityLoading(false);
    if (error) {
      setSecurityError(error.message);
    } else {
      setSecuritySuccess(true);
      setSecurityForm({ newPassword: "", confirmPassword: "" });
      setTimeout(() => setSecuritySuccess(false), 2500);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  if (loading) {
    return <div className="min-h-screen pt-32 text-center text-ivory">Loading profile...</div>;
  }

  const tabItems = [
    { id: "personal", label: "Account Info", icon: User },
    { id: "addresses", label: "Address Book", icon: MapPin },
    { id: "orders", label: "Recent Orders", icon: Package },
    { id: "security", label: "Security & Pass", icon: Shield }
  ];

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
      {/* Breadcrumbs */}
      <div className="mb-8 flex items-center justify-between text-xs uppercase tracking-widest text-smoke/70">
        <div className="flex items-center gap-2">
          <Link to="/" className="hover:text-gold transition-colors">Home</Link>
          <span>/</span>
          <span className="text-gold font-medium">Profile</span>
        </div>
        <span className="text-[10px] text-smoke italic">{userInfo?.membership}</span>
      </div>

      {/* Profile Welcome Header */}
      <div className="relative mb-12 overflow-hidden rounded-3xl border border-obsidian-border bg-obsidian-light/40 p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="absolute right-0 top-0 -z-10 h-72 w-72 rounded-full bg-radial-fade blur-3xl opacity-60" />
        
        <div className="flex items-center gap-5 flex-col md:flex-row text-center md:text-left">
          <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-tr from-gold to-rose-deep text-obsidian font-display text-2xl font-bold shadow-glow">
            {userInfo?.name?.split(" ").map(w => w[0]).join("")}
            <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-obsidian border border-gold/30 text-[10px] text-gold">
              <Star size={10} className="fill-gold" />
            </span>
          </div>
          <div>
            <h1 className="font-display text-2xl font-normal text-ivory tracking-wide flex items-center gap-2 justify-center md:justify-start">
              Welcome, {userInfo?.name}
            </h1>
            <p className="text-xs text-smoke mt-1 leading-relaxed">
              Member since {new Date(userInfo?.joined_date).toLocaleDateString()} &bull; <strong className="text-gold font-medium">{userInfo?.membership}</strong>
            </p>
          </div>
        </div>

        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 rounded-full border border-obsidian-border bg-obsidian-light/50 px-5 py-2.5 text-xs text-smoke hover:border-rose/30 hover:text-rose transition-colors"
        >
          <LogOut size={13} />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Account Dashboard Layout */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <aside className="lg:col-span-3 space-y-2">
          <div className="hidden lg:block space-y-1">
            {tabItems.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3.5 text-sm transition-all ${
                  activeTab === tab.id
                    ? "bg-gold/10 text-gold border border-gold/30 font-medium"
                    : "text-smoke hover:bg-obsidian-light/50 hover:text-ivory border border-transparent"
                }`}
              >
                <tab.icon size={15} />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          <div className="lg:hidden relative">
            <select
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value)}
              className="w-full appearance-none rounded-xl border border-obsidian-border bg-obsidian-light/60 p-4 text-sm text-ivory outline-none focus:border-gold"
            >
              {tabItems.map((tab) => (
                <option key={tab.id} value={tab.id}>
                  {tab.label}
                </option>
              ))}
            </select>
            <ChevronDown size={16} className="absolute right-4 top-4.5 pointer-events-none text-smoke" />
          </div>
        </aside>

        <main className="lg:col-span-9 rounded-2xl border border-obsidian-border bg-obsidian-light/35 p-6 md:p-8 min-h-[400px]">
          
          {/* 1. PERSONAL DETAILS TAB */}
          {activeTab === "personal" && (
            <div className="space-y-6 animate-fade-up">
              <div className="flex items-center justify-between border-b border-obsidian-border/50 pb-4">
                <div>
                  <h3 className="font-display text-lg text-ivory">Personal Information</h3>
                  <p className="text-xs text-smoke mt-0.5">Manage your profile credentials.</p>
                </div>
                {!isEditingProfile && (
                  <button
                    onClick={() => {
                      setProfileForm({ ...userInfo });
                      setIsEditingProfile(true);
                    }}
                    className="flex items-center gap-1.5 text-xs text-gold hover:text-gold-light"
                  >
                    <Edit3 size={13} />
                    <span>Edit Profile</span>
                  </button>
                )}
              </div>

              {profileSuccess && (
                <div className="flex items-center gap-2 rounded-xl bg-gold/10 text-gold p-4 text-xs border border-gold/30">
                  <Check size={14} strokeWidth={2.5} />
                  <span>Profile updated successfully!</span>
                </div>
              )}

              {isEditingProfile ? (
                <form onSubmit={handleSaveProfile} className="space-y-4 max-w-md">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-wider text-gold font-medium block">Full Name</label>
                    <input
                      type="text"
                      required
                      value={profileForm.name}
                      onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                      className="w-full rounded-xl border border-obsidian-border bg-obsidian/40 px-4 py-3 text-sm text-ivory outline-none focus:border-gold/40"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-wider text-gold font-medium block">Email Address (Cannot Edit)</label>
                    <input
                      type="email"
                      disabled
                      value={profileForm.email}
                      className="w-full rounded-xl border border-obsidian-border bg-obsidian-border/40 px-4 py-3 text-sm text-smoke outline-none cursor-not-allowed"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-wider text-gold font-medium block">Phone Number</label>
                    <input
                      type="tel"
                      value={profileForm.phone || ""}
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                      className="w-full rounded-xl border border-obsidian-border bg-obsidian/40 px-4 py-3 text-sm text-ivory outline-none focus:border-gold/40"
                    />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsEditingProfile(false)}
                      className="flex-1 rounded-full border border-obsidian-border py-2.5 text-xs text-smoke hover:text-ivory"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 rounded-full bg-gold py-2.5 text-xs font-semibold text-obsidian hover:bg-gold-light flex items-center justify-center gap-1.5"
                    >
                      <Save size={13} />
                      <span>Save Changes</span>
                    </button>
                  </div>
                </form>
              ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 max-w-2xl">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-smoke/70 block">Full Name</span>
                    <span className="text-sm font-medium text-ivory block mt-1">{userInfo?.name}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-smoke/70 block">Email Address</span>
                    <span className="text-sm font-medium text-ivory block mt-1">{userInfo?.email}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-smoke/70 block">Phone Number</span>
                    <span className="text-sm font-medium text-ivory block mt-1">{userInfo?.phone || "Not provided"}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-smoke/70 block">VIP Status</span>
                    <span className="inline-flex items-center gap-1 text-xs text-gold font-semibold mt-1 bg-gold/15 px-2 py-0.5 rounded border border-gold/30">
                      <Sparkles size={11} />
                      {userInfo?.membership}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 2. ADDRESS BOOK TAB */}
          {activeTab === "addresses" && (
            <div className="space-y-6 animate-fade-up">
              <div className="flex items-center justify-between border-b border-obsidian-border/50 pb-4">
                <div>
                  <h3 className="font-display text-lg text-ivory">Address Book</h3>
                  <p className="text-xs text-smoke mt-0.5">Manage your shipping destinations.</p>
                </div>
                {!isAddingAddress && (
                  <button
                    onClick={() => setIsAddingAddress(true)}
                    className="flex items-center gap-1 text-xs text-gold hover:text-gold-light"
                  >
                    <Plus size={14} />
                    <span>Add New Address</span>
                  </button>
                )}
              </div>

              {isAddingAddress ? (
                <form onSubmit={handleAddAddress} className="space-y-4 max-w-md">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase tracking-wider text-gold block">Address Label</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Shipping, Office"
                        value={addressForm.label}
                        onChange={(e) => setAddressForm({ ...addressForm, label: e.target.value })}
                        className="w-full rounded-xl border border-obsidian-border bg-obsidian/40 px-4 py-2.5 text-xs text-ivory outline-none focus:border-gold/40"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase tracking-wider text-gold block">Contact Name</label>
                      <input
                        type="text"
                        required
                        placeholder="Recipient name"
                        value={addressForm.name}
                        onChange={(e) => setAddressForm({ ...addressForm, name: e.target.value })}
                        className="w-full rounded-xl border border-obsidian-border bg-obsidian/40 px-4 py-2.5 text-xs text-ivory outline-none focus:border-gold/40"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-wider text-gold block">Street Address</label>
                    <input
                      type="text"
                      required
                      placeholder="Street address, Suite, Apt"
                      value={addressForm.address}
                      onChange={(e) => setAddressForm({ ...addressForm, address: e.target.value })}
                      className="w-full rounded-xl border border-obsidian-border bg-obsidian/40 px-4 py-2.5 text-xs text-ivory outline-none focus:border-gold/40"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase tracking-wider text-gold block">City, State, Zip</label>
                      <input
                        type="text"
                        required
                        placeholder="New York, NY 10001"
                        value={addressForm.cityStateZip}
                        onChange={(e) => setAddressForm({ ...addressForm, cityStateZip: e.target.value })}
                        className="w-full rounded-xl border border-obsidian-border bg-obsidian/40 px-4 py-2.5 text-xs text-ivory outline-none focus:border-gold/40"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase tracking-wider text-gold block">Phone Number</label>
                      <input
                        type="tel"
                        required
                        placeholder="+1 (555) 000-0000"
                        value={addressForm.phone}
                        onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                        className="w-full rounded-xl border border-obsidian-border bg-obsidian/40 px-4 py-2.5 text-xs text-ivory outline-none focus:border-gold/40"
                      />
                    </div>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsAddingAddress(false)}
                      className="flex-1 rounded-full border border-obsidian-border py-2.5 text-xs text-smoke hover:text-ivory"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 rounded-full bg-gold py-2.5 text-xs font-semibold text-obsidian hover:bg-gold-light"
                    >
                      Save Address
                    </button>
                  </div>
                </form>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {addresses.length === 0 && <div className="text-sm text-smoke">No addresses saved.</div>}
                  {addresses.map((addr) => (
                    <div
                      key={addr.id}
                      className={`relative flex flex-col justify-between rounded-xl border p-5 space-y-4 bg-obsidian-light/40 transition-colors ${
                        addr.isDefault ? "border-gold/40" : "border-obsidian-border"
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className={`text-[10px] uppercase tracking-wider font-semibold ${addr.isDefault ? "text-gold" : "text-smoke"}`}>
                            {addr.label}
                          </span>
                          {addr.isDefault && (
                            <span className="text-[9px] font-bold text-obsidian bg-gold rounded px-1.5 py-0.5 uppercase tracking-wide">
                              Default
                            </span>
                          )}
                        </div>
                        <h4 className="text-sm font-semibold text-ivory mt-3">{addr.name}</h4>
                        <p className="text-xs text-smoke leading-relaxed mt-1.5">{addr.address}</p>
                        <p className="text-xs text-smoke leading-relaxed">{addr.cityStateZip}</p>
                        <p className="text-xs text-smoke/70 mt-1 leading-none">Ph: {addr.phone}</p>
                      </div>

                      <div className="flex items-center justify-between border-t border-obsidian-border pt-4 text-xs">
                        {!addr.isDefault ? (
                          <button
                            onClick={() => handleSetDefaultAddress(addr.id)}
                            className="text-smoke hover:text-gold font-medium"
                          >
                            Set Default
                          </button>
                        ) : (
                          <span className="text-gold/50 cursor-default flex items-center gap-1">
                            <Check size={11} strokeWidth={2.5} /> Active Destination
                          </span>
                        )}

                        <button
                          onClick={() => handleDeleteAddress(addr.id)}
                          className="text-smoke/60 hover:text-rose p-1 transition-colors"
                          aria-label="Delete address"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 3. RECENT ORDERS TAB */}
          {activeTab === "orders" && (
            <div className="space-y-6 animate-fade-up">
              <div className="flex items-center justify-between border-b border-obsidian-border/50 pb-4">
                <div>
                  <h3 className="font-display text-lg text-ivory">Recent Orders</h3>
                  <p className="text-xs text-smoke mt-0.5">Your latest beauty curations.</p>
                </div>
                <Link
                  to="/orders"
                  className="flex items-center gap-1 text-xs text-gold hover:text-gold-light font-semibold"
                >
                  <span>View All Order History</span>
                  <ArrowRight size={13} />
                </Link>
              </div>

              <div className="space-y-4">
                {orders.length === 0 && <div className="text-sm text-smoke">No recent orders found.</div>}
                {orders.slice(0, 3).map((order) => (
                  <div
                    key={order.id}
                    onClick={() => navigate("/orders")}
                    className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-obsidian-border bg-obsidian-light/60 hover:border-gold/20 cursor-pointer transition-colors"
                  >
                    <div className="grid grid-cols-2 gap-4 sm:flex-1 sm:grid-cols-4 text-xs">
                      <div>
                        <span className="text-smoke/60 block uppercase tracking-wider text-[9px]">Reference</span>
                        <span className="font-semibold text-ivory block mt-0.5">#{order.id.slice(-8)}</span>
                      </div>
                      <div>
                        <span className="text-smoke/60 block uppercase tracking-wider text-[9px]">Date Placed</span>
                        <span className="text-smoke block mt-0.5">{new Date(order.created_at).toLocaleDateString()}</span>
                      </div>
                      <div>
                        <span className="text-smoke/60 block uppercase tracking-wider text-[9px]">Status</span>
                        <span className="text-smoke block mt-0.5 truncate max-w-xs">{order.statusText}</span>
                      </div>
                      <div>
                        <span className="text-smoke/60 block uppercase tracking-wider text-[9px]">Total Cost</span>
                        <span className="font-medium text-gold block mt-0.5">${order.total.toFixed(2)}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between border-t border-obsidian-border pt-3 sm:border-none sm:pt-0">
                      <span className="inline-flex rounded-full border border-gold/30 bg-gold/15 px-2.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-gold">
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. SECURITY & SECURITY TAB */}
          {activeTab === "security" && (
            <div className="space-y-6 animate-fade-up">
              <div className="border-b border-obsidian-border/50 pb-4">
                <h3 className="font-display text-lg text-ivory">Update Credentials</h3>
                <p className="text-xs text-smoke mt-0.5">Secure your customer portal credentials.</p>
              </div>

              {securitySuccess && (
                <div className="flex items-center gap-2 rounded-xl bg-gold/10 text-gold p-4 text-xs border border-gold/30">
                  <Check size={14} strokeWidth={2.5} />
                  <span>Password updated successfully!</span>
                </div>
              )}

              {securityError && (
                <p className="text-xs text-rose font-medium bg-rose-deep/10 p-3 rounded-xl border border-rose/30 max-w-md">
                  {securityError}
                </p>
              )}

              <form onSubmit={handleUpdatePassword} className="space-y-4 max-w-md">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider text-gold font-medium block">New Password</label>
                  <input
                    type="password"
                    required
                    value={securityForm.newPassword}
                    onChange={(e) => setSecurityForm({ ...securityForm, newPassword: e.target.value })}
                    className="w-full rounded-xl border border-obsidian-border bg-obsidian/40 px-4 py-3 text-sm text-ivory outline-none focus:border-gold/40"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider text-gold font-medium block">Confirm New Password</label>
                  <input
                    type="password"
                    required
                    value={securityForm.confirmPassword}
                    onChange={(e) => setSecurityForm({ ...securityForm, confirmPassword: e.target.value })}
                    className="w-full rounded-xl border border-obsidian-border bg-obsidian/40 px-4 py-3 text-sm text-ivory outline-none focus:border-gold/40"
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={securityLoading}
                  className="w-full rounded-full bg-gold py-3.5 text-xs font-semibold text-obsidian hover:bg-gold-light mt-3 flex items-center justify-center gap-1.5 shadow-glow disabled:opacity-70"
                >
                  {securityLoading ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-obsidian border-t-transparent" />
                  ) : (
                    <Shield size={14} />
                  )}
                  <span>Change Password</span>
                </button>
              </form>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
