import type { ComponentProps } from "react";

import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import type { OrderEvent } from "@/features/orders/orders.types";
import { OrderTimeline } from "../OrderTimeline";

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

const renderTimeline = (
  overrides: Partial<ComponentProps<typeof OrderTimeline>> = {}
) => {
  const props: ComponentProps<typeof OrderTimeline> = {
    events: [makeEvent()],
    isLoading: false,
    error: null,
    pageIndex: 0,
    pageSize: 10,
    isPageTransitioning: false,
    canGoToPreviousPage: false,
    canGoToNextPage: true,
    onPreviousPage: vi.fn(),
    onNextPage: vi.fn(),
    onPageSizeChange: vi.fn(),
    ...overrides,
  };

  render(<OrderTimeline {...props} />);
  return props;
};

describe("OrderTimeline", () => {
  it("renders pagination controls with current page and size", () => {
    renderTimeline({ pageIndex: 1, pageSize: 20, canGoToPreviousPage: true });

    expect(screen.getByText("Page 2")).toBeInTheDocument();
    expect(screen.getByLabelText("Rows")).toHaveValue("20");
    expect(screen.getByRole("button", { name: /previous/i })).toBeEnabled();
  });

  it("calls next page handler when next is clicked", () => {
    const props = renderTimeline();

    fireEvent.click(screen.getByRole("button", { name: /next/i }));

    expect(props.onNextPage).toHaveBeenCalledTimes(1);
  });

  it("calls previous page handler when previous is clicked", () => {
    const props = renderTimeline({ pageIndex: 1, canGoToPreviousPage: true });

    fireEvent.click(screen.getByRole("button", { name: /previous/i }));

    expect(props.onPreviousPage).toHaveBeenCalledTimes(1);
  });

  it("calls page size handler when the page size changes", () => {
    const props = renderTimeline();

    fireEvent.change(screen.getByLabelText("Rows"), {
      target: { value: "50" },
    });

    expect(props.onPageSizeChange).toHaveBeenCalledWith(50);
  });
});
