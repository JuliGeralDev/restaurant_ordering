import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useModifiersModal } from "../useModifiersModal";
import type { Modifiers } from "../../menu.types";

const modifiers: Modifiers = {
  protein: {
    required: true,
    max: 1,
    options: [
      { id: "chicken", name: "Chicken", price: 0 },
      { id: "beef", name: "Beef", price: 200000 },
    ],
  },
  sauces: {
    required: false,
    max: 2,
    options: [
      { id: "bbq", name: "BBQ", price: 50000 },
      { id: "mayo", name: "Mayo", price: 0 },
    ],
  },
};

const defaults = {
  isOpen: true,
  modifiers,
  basePrice: 1500000,
  quantity: 1,
  onAddItem: vi.fn(),
  onClose: vi.fn(),
};

describe("useModifiersModal", () => {
  beforeEach(() => vi.clearAllMocks());

  it("starts with empty selection and step 0", () => {
    const { result } = renderHook(() => useModifiersModal(defaults));
    expect(result.current.currentStep).toBe(0);
    expect(result.current.currentSelected).toEqual({});
  });

  it("runningTotal equals basePrice when nothing is selected", () => {
    const { result } = renderHook(() => useModifiersModal(defaults));
    expect(result.current.runningTotal).toBe(1500000);
  });

  it("toggle adds an option to the selection", () => {
    const { result } = renderHook(() => useModifiersModal(defaults));
    act(() => result.current.toggle("protein", "chicken", 1));
    expect(result.current.currentSelected["protein"]?.has("chicken")).toBe(true);
  });

  it("toggle removes an already-selected option", () => {
    const { result } = renderHook(() => useModifiersModal(defaults));
    act(() => result.current.toggle("protein", "chicken", 1));
    act(() => result.current.toggle("protein", "chicken", 1));
    expect(result.current.currentSelected["protein"]?.has("chicken")).toBe(false);
  });

  it("max=1 clears previous selection when a different option is picked", () => {
    const { result } = renderHook(() => useModifiersModal(defaults));
    act(() => result.current.toggle("protein", "chicken", 1));
    act(() => result.current.toggle("protein", "beef", 1));
    expect(result.current.currentSelected["protein"]?.has("chicken")).toBe(false);
    expect(result.current.currentSelected["protein"]?.has("beef")).toBe(true);
  });

  it("isCurrentStepValid is false when a required group has no selection", () => {
    const { result } = renderHook(() => useModifiersModal(defaults));
    expect(result.current.isCurrentStepValid).toBe(false);
  });

  it("isCurrentStepValid is true when all required groups are satisfied", () => {
    const { result } = renderHook(() => useModifiersModal(defaults));
    act(() => result.current.toggle("protein", "chicken", 1));
    expect(result.current.isCurrentStepValid).toBe(true);
  });

  it("additionalPriceCurrent sums prices of selected options", () => {
    const { result } = renderHook(() => useModifiersModal(defaults));
    act(() => result.current.toggle("protein", "beef", 1)); // +200000
    act(() => result.current.toggle("sauces", "bbq"));      // +50000
    expect(result.current.additionalPriceCurrent).toBe(250000);
  });

  it("runningTotal includes basePrice + selected extras", () => {
    const { result } = renderHook(() => useModifiersModal(defaults));
    act(() => result.current.toggle("protein", "beef", 1)); // +200000
    expect(result.current.runningTotal).toBe(1700000);
  });

  it("isLastStep is true when quantity=1", () => {
    const { result } = renderHook(() => useModifiersModal(defaults));
    expect(result.current.isLastStep).toBe(true);
  });

  describe("handleConfirm", () => {
    it("calls onAddItem and onClose when step is valid", () => {
      const onAddItem = vi.fn();
      const onClose = vi.fn();
      const { result } = renderHook(() =>
        useModifiersModal({ ...defaults, onAddItem, onClose })
      );
      act(() => result.current.toggle("protein", "chicken", 1));
      act(() => result.current.handleConfirm());
      expect(onAddItem).toHaveBeenCalledOnce();
      expect(onClose).toHaveBeenCalledOnce();
    });

    it("passes the flat modifier list to onAddItem", () => {
      const onAddItem = vi.fn();
      const { result } = renderHook(() =>
        useModifiersModal({ ...defaults, onAddItem })
      );
      act(() => result.current.toggle("protein", "chicken", 1));
      act(() => result.current.handleConfirm());
      expect(onAddItem).toHaveBeenCalledWith([
        { groupId: "protein", optionId: "chicken", name: "Chicken", price: 0 },
      ]);
    });

    it("does nothing when step is invalid", () => {
      const onAddItem = vi.fn();
      const onClose = vi.fn();
      const { result } = renderHook(() =>
        useModifiersModal({ ...defaults, onAddItem, onClose })
      );
      act(() => result.current.handleConfirm());
      expect(onAddItem).not.toHaveBeenCalled();
      expect(onClose).not.toHaveBeenCalled();
    });
  });

  describe("multi-step (quantity=2)", () => {
    const multiDefaults = { ...defaults, quantity: 2 };

    it("isLastStep is false on step 0", () => {
      const { result } = renderHook(() => useModifiersModal(multiDefaults));
      expect(result.current.isLastStep).toBe(false);
    });

    it("handleNext advances step and resets selection", () => {
      const onAddItem = vi.fn();
      const { result } = renderHook(() =>
        useModifiersModal({ ...multiDefaults, onAddItem })
      );
      act(() => result.current.toggle("protein", "chicken", 1));
      act(() => result.current.handleNext());
      expect(result.current.currentStep).toBe(1);
      expect(result.current.currentSelected).toEqual({});
      expect(onAddItem).toHaveBeenCalledOnce();
    });

    it("isLastStep is true on step 1 of 2", () => {
      const { result } = renderHook(() => useModifiersModal(multiDefaults));
      act(() => result.current.toggle("protein", "chicken", 1));
      act(() => result.current.handleNext());
      expect(result.current.isLastStep).toBe(true);
    });

    it("handleNext accumulates confirmedTotal across steps", () => {
      const { result } = renderHook(() => useModifiersModal(multiDefaults));
      act(() => result.current.toggle("protein", "beef", 1)); // step 1: 1500000+200000=1700000
      act(() => result.current.handleNext());
      // confirmedTotal=1700000; next step: runningTotal = 1700000 + 1500000 = 3200000
      expect(result.current.runningTotal).toBe(3200000);
    });

    it("handleNext does nothing when step is invalid", () => {
      const onAddItem = vi.fn();
      const { result } = renderHook(() =>
        useModifiersModal({ ...multiDefaults, onAddItem })
      );
      act(() => result.current.handleNext()); // protein not selected
      expect(result.current.currentStep).toBe(0);
      expect(onAddItem).not.toHaveBeenCalled();
    });
  });

  it("resets all state when isOpen transitions from false to true", () => {
    const { result, rerender } = renderHook(
      ({ isOpen }) => useModifiersModal({ ...defaults, isOpen }),
      { initialProps: { isOpen: true } }
    );
    act(() => result.current.toggle("protein", "chicken", 1));
    rerender({ isOpen: false });
    rerender({ isOpen: true });
    expect(result.current.currentSelected).toEqual({});
    expect(result.current.currentStep).toBe(0);
    expect(result.current.runningTotal).toBe(1500000);
  });
});
