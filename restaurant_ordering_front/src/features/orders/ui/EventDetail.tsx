import type { OrderEventPayload } from "@/features/orders/orders.types";
import { EVENT_RENDERERS, renderGenericEvent } from "./orderEvent.renderers";

interface EventDetailProps {
  type: string;
  payload: OrderEventPayload;
}

export const EventDetail = ({ type, payload }: EventDetailProps) => {
  const render = EVENT_RENDERERS[type] ?? renderGenericEvent;
  return <>{render(payload)}</>;
};
