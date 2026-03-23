import type { UserProfile } from "@/shared/types/user";

export interface CreateSessionUserRequest {
  userId?: string;
  username: string;
  name: string;
  email: string;
  phone: string;
  isDefault?: boolean;
}

export type SessionUserResponse = UserProfile;
