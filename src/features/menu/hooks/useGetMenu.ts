"use client";

import { useGetRequest } from "@/shared/hooks/useGetRequest";
import { mapGetMenuResponse } from "../menu.mappers";
import type { GetMenuResponse } from "../menu.types";

const MENU_ENDPOINT = "/menu";

export function useGetMenu() {
  const request = useGetRequest<GetMenuResponse>(MENU_ENDPOINT, []);

  return {
    ...request,
    data: mapGetMenuResponse(request.data),
  };
}
