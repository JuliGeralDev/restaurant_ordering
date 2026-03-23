import { describe, it, expect } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
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
  payload: { name: "Burger", quantity: 2, basePrice: 1500000 },
  ...overrides,
});

const renderExpanded = (event: OrderEvent, isLast = false) => {
  render(<OrderEventRow event={event} isLast={isLast} />);
  fireEvent.click(screen.getByRole("button", { name: /show event details/i }));
};

describe("OrderEventRow", () => {
  describe("CART_ITEM_ADDED / UPDATED / REMOVED", () => {
    it("renders the product name", () => {
      renderExpanded(makeEvent());
      expect(screen.getByText("Burger")).toBeInTheDocument();
    });

    it("renders the formatted base price", () => {
      renderExpanded(makeEvent());
      expect(screen.getByText("$15.000")).toBeInTheDocument();
    });

    it("renders the quantity", () => {
      renderExpanded(makeEvent());
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
      payload: {
        subtotal: 3000000,
        tax: 570000,
        serviceFee: 300000,
        total: 3870000,
      },
    });

    it("renders the 'Pricing Calculated' label", () => {
      render(<OrderEventRow event={event} isLast={false} />);
      expect(screen.getByText("Pricing Calculated")).toBeInTheDocument();
    });

    it("renders the total amount", () => {
      renderExpanded(event);
      expect(screen.getByText("$38.700")).toBeInTheDocument();
    });

    it("renders subtotal and tax", () => {
      renderExpanded(event);
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
      renderExpanded(event);
      expect(screen.getByText("PENDING")).toBeInTheDocument();
      expect(screen.getByText("CONFIRMED")).toBeInTheDocument();
    });
  });

  describe("ORDER_PLACED", () => {
    it("renders the confirmation message", () => {
      renderExpanded(makeEvent({ type: "ORDER_PLACED", payload: {} }));
      expect(screen.getByText("Order placed successfully.")).toBeInTheDocument();
    });
  });

  describe("VALIDATION_FAILED", () => {
    it("renders the reason from payload", () => {
      renderExpanded(
        makeEvent({
          type: "VALIDATION_FAILED",
          payload: { reason: "Missing required modifier" },
        })
      );
      expect(screen.getByText("Missing required modifier")).toBeInTheDocument();
    });

    it("falls back to 'Validation failed.' when no reason or message", () => {
      renderExpanded(makeEvent({ type: "VALIDATION_FAILED", payload: {} }));
      expect(screen.getByText("Validation failed.")).toBeInTheDocument();
    });
  });

  describe("Unknown event type (generic renderer)", () => {
    it("renders all payload keys and values", () => {
      renderExpanded(
        makeEvent({ type: "CUSTOM_EVENT", payload: { foo: "bar", count: 42 } }),
        true
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

  describe("Collapse behavior", () => {
    it("keeps details collapsed by default", () => {
      render(<OrderEventRow event={makeEvent()} isLast={false} />);
      expect(screen.queryByText("Burger")).not.toBeInTheDocument();
      expect(screen.getByRole("button", { name: /show event details/i })).toBeInTheDocument();
    });

    it("toggles details when the button is clicked", () => {
      render(<OrderEventRow event={makeEvent()} isLast={false} />);

      const button = screen.getByRole("button", { name: /show event details/i });
      fireEvent.click(button);

      expect(screen.getByText("Burger")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /hide event details/i })).toBeInTheDocument();
    });
  });
});
