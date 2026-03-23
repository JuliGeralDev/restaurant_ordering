"use client";

import { Mail, Phone, User, UserCircle2, X } from "lucide-react";

import type { UserProfile } from "@/shared/types/user";
import { Button } from "@/shared/ui/button";

interface UserProfileModalProps {
  isOpen: boolean;
  userProfile: UserProfile;
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

export const UserProfileModal = ({
  isOpen,
  userProfile,
  onClose,
}: UserProfileModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="absolute right-0 top-full z-[70] mt-2 w-[21rem] max-w-[calc(100vw-2rem)] overflow-hidden rounded-[1.35rem] border-[6px] border-zinc-500 bg-gradient-to-b from-zinc-400 via-zinc-300 to-zinc-400 shadow-2xl shadow-black/60">
      <div className="border-b-4 border-zinc-700 bg-zinc-600 px-3 py-2.5">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center">
          <span />
          <span className="justify-self-center text-[9px] font-bold uppercase tracking-[0.22em] text-green-400">
            User Profile
          </span>
          <div className="justify-self-end">
            <Button
              variant="ghost"
              size="icon-xs"
              className="text-zinc-200 hover:bg-white/10 hover:text-white"
              onClick={onClose}
              aria-label="Close user profile"
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-zinc-800 px-3 py-3.5">
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
            {userProfile.isDefault ? "Default User" : "Active User"}
          </p>
        </div>
      </div>
    </div>
  );
};
