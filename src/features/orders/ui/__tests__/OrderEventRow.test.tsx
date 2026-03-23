import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { OrderEventRow } from "../OrderEventRow";
import type { OrderEvent } from "@/features/orders/orders.types";

const makeEvent = (overrides: Partial<OrderEvent> = {}): OrderEvent => ({
  eventId: "evt-1",
  orderId: "order-1",
  correlationId: "corr-1",
  source: "web",
  userId: "user-1",
  timestamp: "2024-01-15T10:30:00.000Z",
  type: "CART_ITEM_ADDED",
  payload: { name: "Burger", quantity: 2, basePrice: 15000 },
  ...overrides,
});

describe("OrderEventRow", () => {
  describe("CART_ITEM_ADDED / UPDATED / REMOVED", () => {
    it("renders the product name", () => {
      render(<OrderEventRow event={makeEvent()} isLast={false} />);
      expect(screen.getByText("Burger")).toBeInTheDocument();
    });

    it("renders the formatted base price", () => {
      render(<OrderEventRow event={makeEvent()} isLast={false} />);
      expect(screen.getByText("$15.000")).toBeInTheDocument();
    });

    it("renders the quantity", () => {
      render(<OrderEventRow event={makeEvent()} isLast={false} />);
      expect(screen.getByText("2")).toBeInTheDocument();
    });

    it("renders 'Item Added' label for CART_ITEM_ADDED", () => {
      render(<OrderEventRow event={makeEvent()} isLast={false} />);
      expect(screen.getByText("Item Added")).toBeInTheDocument();
    });

    it("renders 'Item Removed' label for CART_ITEM_REMOVED", () => {
      render(
        <OrderEventRow
          event={makeEvent({ type: "CART_ITEM_REMOVED" })}
          isLast={false}
        />
      );
      expect(screen.getByText("Item Removed")).toBeInTheDocument();
    });

    it("renders 'Item Updated' label for CART_ITEM_UPDATED", () => {
      render(
        <OrderEventRow
          event={makeEvent({ type: "CART_ITEM_UPDATED" })}
          isLast={false}
        />
      );
      expect(screen.getByText("Item Updated")).toBeInTheDocument();
    });
  });

  describe("PRICING_CALCULATED", () => {
    const event = makeEvent({
      type: "PRICING_CALCULATED",
      payload: { subtotal: 30000, tax: 5700, serviceFee: 3000, total: 38700 },
    });

    it("renders the 'Pricing Calculated' label", () => {
      render(<OrderEventRow event={event} isLast={false} />);
      expect(screen.getByText("Pricing Calculated")).toBeInTheDocument();
    });

    it("renders the total amount", () => {
      render(<OrderEventRow event={event} isLast={false} />);
      expect(screen.getByText("$38.700")).toBeInTheDocument();
    });

    it("renders subtotal and tax", () => {
      render(<OrderEventRow event={event} isLast={false} />);
      expect(screen.getByText("$30.000")).toBeInTheDocument();
      expect(screen.getByText("$5.700")).toBeInTheDocument();
    });
  });

  describe("ORDER_STATUS_CHANGED", () => {
    const event = makeEvent({
      type: "ORDER_STATUS_CHANGED",
      payload: { from: "PENDING", to: "CONFIRMED" },
    });

    it("renders from and to status", () => {
      render(<OrderEventRow event={event} isLast={false} />);
      expect(screen.getByText("PENDING")).toBeInTheDocument();
      expect(screen.getByText("CONFIRMED")).toBeInTheDocument();
    });
  });

  describe("ORDER_PLACED", () => {
    it("renders the confirmation message", () => {
      render(
        <OrderEventRow
          event={makeEvent({ type: "ORDER_PLACED", payload: {} })}
          isLast={false}
        />
      );
      expect(screen.getByText("Order placed successfully.")).toBeInTheDocument();
    });
  });

  describe("VALIDATION_FAILED", () => {
    it("renders the reason from payload", () => {
      render(
        <OrderEventRow
          event={makeEvent({
            type: "VALIDATION_FAILED",
            payload: { reason: "Missing required modifier" },
          })}
          isLast={false}
        />
      );
      expect(screen.getByText("Missing required modifier")).toBeInTheDocument();
    });

    it("falls back to 'Validation failed.' when no reason or message", () => {
      render(
        <OrderEventRow
          event={makeEvent({ type: "VALIDATION_FAILED", payload: {} })}
          isLast={false}
        />
      );
      expect(screen.getByText("Validation failed.")).toBeInTheDocument();
    });
  });

  describe("Unknown event type (generic renderer)", () => {
    it("renders all payload keys and values", () => {
      render(
        <OrderEventRow
          event={makeEvent({ type: "CUSTOM_EVENT", payload: { foo: "bar", count: 42 } })}
          isLast={true}
        />
      );
      expect(screen.getByText("foo")).toBeInTheDocument();
      expect(screen.getByText("bar")).toBeInTheDocument();
      expect(screen.getByText("count")).toBeInTheDocument();
      expect(screen.getByText("42")).toBeInTheDocument();
    });

    it("renders fallback 'Event' label for unknown type", () => {
      render(
        <OrderEventRow
          event={makeEvent({ type: "CUSTOM_EVENT", payload: {} })}
          isLast={true}
        />
      );
      expect(screen.getByText("Event")).toBeInTheDocument();
    });
  });

  describe("Timeline rail", () => {
    it("renders the vertical connector line when not last", () => {
      const { container } = render(<OrderEventRow event={makeEvent()} isLast={false} />);
      expect(container.querySelector(".w-px")).toBeInTheDocument();
    });

    it("does not render the connector line when last", () => {
      const { container } = render(<OrderEventRow event={makeEvent()} isLast={true} />);
      expect(container.querySelector(".w-px")).toBeNull();
    });
  });
});
