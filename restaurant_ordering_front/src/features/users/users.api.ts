import type {
  CreateSessionUserRequest,
  SessionUserResponse,
} from "@/features/users/users.types";
import { apiRequest } from "@/shared/lib/api/httpClient";

export const createSessionUserRequest = (payload: CreateSessionUserRequest) =>
  apiRequest<SessionUserResponse, CreateSessionUserRequest>({
    method: "POST",
    url: "/users/session",
    data: payload,
  });

export const getUserByIdRequest = (userId: string) =>
  apiRequest<SessionUserResponse>({
    method: "GET",
    url: `/users/${userId}`,
  });
