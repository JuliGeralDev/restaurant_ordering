"use client";

import { useState } from "react";
import { Mail, Phone, User, UserCircle2, X } from "lucide-react";

import { useUserSession } from "@/features/users/hooks/useUserSession";
import type { UserProfile } from "@/shared/types/user";
import { Button } from "@/shared/ui/button";

interface UserProfileModalProps {
  isOpen: boolean;
  userProfile: UserProfile | null;
  onClose: () => void;
}

const DetailRow = ({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof User;
  label: string;
  value: string;
}) => (
  <div className="rounded-xl border-2 border-zinc-700 bg-zinc-900 px-3 py-2.5">
    <div className="flex items-center gap-2 text-[9px] uppercase tracking-wide text-zinc-500">
      <Icon className="h-3.5 w-3.5 text-green-400" />
      <span>{label}</span>
    </div>
    <p className="mt-1.5 text-[11px] leading-5 text-zinc-200">{value}</p>
  </div>
);

const TextField = ({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) => (
  <label className="block">
    <span className="mb-1.5 block text-[9px] uppercase tracking-[0.18em] text-zinc-500">
      {label}
    </span>
    <input
      type={type}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="w-full rounded-xl border-2 border-zinc-700 bg-zinc-900 px-3 py-2 text-[11px] text-zinc-200 outline-none focus:border-green-500"
    />
  </label>
);

export const UserProfileModal = ({
  isOpen,
  userProfile,
  onClose,
}: UserProfileModalProps) => {
  const { signIn, signOut, isLoading, error } = useUserSession();
  const [form, setForm] = useState({
    username: "",
    name: "",
    email: "",
    phone: "",
  });

  if (!isOpen) return null;

  const updateField = (field: keyof typeof form, value: string) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSignIn = async () => {
    await signIn({
      username: form.username,
      name: form.name,
      email: form.email,
      phone: form.phone,
      isDefault: false,
    });

    setForm({
      username: "",
      name: "",
      email: "",
      phone: "",
    });
    onClose();
  };

  const handleSignOut = () => {
    signOut();
    onClose();
  };

  return (
    <div className="absolute right-0 top-full z-[70] mt-2 w-[21rem] max-w-[calc(100vw-2rem)] overflow-hidden rounded-[1.35rem] border-[6px] border-zinc-500 bg-gradient-to-b from-zinc-400 via-zinc-300 to-zinc-400 shadow-2xl shadow-black/60">
      <div className="border-b-4 border-zinc-700 bg-zinc-600 px-3 py-2.5">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center">
          <span />
          <span className="justify-self-center text-[9px] font-bold uppercase tracking-[0.22em] text-green-400">
            {userProfile ? "User Profile" : "Sign In"}
          </span>
          <div className="justify-self-end">
            <Button
              variant="ghost"
              size="icon-xs"
              className="text-zinc-200 hover:bg-white/10 hover:text-white"
              onClick={onClose}
              aria-label="Close user panel"
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-zinc-800 px-3 py-3.5">
        {userProfile ? (
          <>
            <div className="mb-3 rounded-2xl border-4 border-zinc-700 bg-zinc-900 px-3 py-3 text-center">
              <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full border-4 border-green-500/40 bg-green-500/10">
                <UserCircle2 className="h-5.5 w-5.5 text-green-400" />
              </div>
              <p className="mt-2.5 text-[11px] font-bold uppercase tracking-wide text-zinc-100">
                {userProfile.name}
              </p>
            </div>

            <div className="space-y-2.5">
              <DetailRow icon={User} label="Username" value={userProfile.username} />
              <DetailRow icon={UserCircle2} label="User ID" value={userProfile.userId} />
              <DetailRow icon={Mail} label="Email" value={userProfile.email} />
              <DetailRow icon={Phone} label="Phone" value={userProfile.phone} />
            </div>

            <div className="mt-3 rounded-xl border-2 border-zinc-700 bg-zinc-900 px-3 py-2.5 text-center">
              <p className="text-[9px] uppercase tracking-[0.2em] text-zinc-500">Mode</p>
              <p className="mt-1.5 text-[10px] font-bold uppercase tracking-wide text-green-400">
                {userProfile.isDefault ? "Default User" : "Session User"}
              </p>
            </div>

            <div className="mt-3">
              <Button
                className="w-full rounded-lg border-2 border-red-800 bg-red-700 text-[10px] font-bold uppercase tracking-widest text-white hover:bg-red-600"
                onClick={handleSignOut}
              >
                Sign Out
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="mb-3 rounded-2xl border-4 border-zinc-700 bg-zinc-900 px-3 py-3 text-center">
              <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full border-4 border-green-500/40 bg-green-500/10">
                <UserCircle2 className="h-5.5 w-5.5 text-green-400" />
              </div>
              <p className="mt-2.5 text-[11px] font-bold uppercase tracking-wide text-zinc-100">
                Start Session
              </p>
              <p className="mt-1 text-[9px] uppercase tracking-[0.18em] text-zinc-500">
                Mock user record
              </p>
            </div>

            <div className="space-y-2.5">
              <TextField
                label="Username"
                value={form.username}
                onChange={(value) => updateField("username", value)}
              />
              <TextField
                label="Name"
                value={form.name}
                onChange={(value) => updateField("name", value)}
              />
              <TextField
                label="Email"
                type="email"
                value={form.email}
                onChange={(value) => updateField("email", value)}
              />
              <TextField
                label="Phone"
                value={form.phone}
                onChange={(value) => updateField("phone", value)}
              />
            </div>

            {error && (
              <p className="mt-3 text-[10px] leading-4 text-red-400">{error}</p>
            )}

            <div className="mt-3">
              <Button
                className="w-full rounded-lg border-2 border-green-800 bg-green-700 text-[10px] font-bold uppercase tracking-widest text-white hover:bg-green-600"
                onClick={handleSignIn}
                disabled={isLoading}
              >
                {isLoading ? "Signing In..." : "Sign In"}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
