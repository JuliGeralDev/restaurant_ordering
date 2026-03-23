import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { MobileNavModal } from "../MobileNavModal";

describe("MobileNavModal", () => {
  it("renders navigation items when open", () => {
    render(
      <MobileNavModal
        isOpen
        cartItemsCount={3}
        userLabel="Juliana"
        onClose={vi.fn()}
        onOpenProfile={vi.fn()}
      />
    );

    expect(screen.getByText("Menu")).toBeInTheDocument();
    expect(screen.getByText("My Orders")).toBeInTheDocument();
    expect(screen.getByText("Cart")).toBeInTheDocument();
    expect(screen.getByText("Profile")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("calls onOpenProfile when profile is clicked", () => {
    const onOpenProfile = vi.fn();

    render(
      <MobileNavModal
        isOpen
        cartItemsCount={0}
        userLabel="Sign In"
        onClose={vi.fn()}
        onOpenProfile={onOpenProfile}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /profile/i }));

    expect(onOpenProfile).toHaveBeenCalledTimes(1);
  });
});
