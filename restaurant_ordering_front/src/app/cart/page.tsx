"use client";

import { useCartPage } from "@/features/cart/hooks/useCartPage";
import { CartContent } from "@/features/cart/ui/CartContent";
import { CartEmptyState } from "@/features/cart/ui/CartEmptyState";
import { RetroModifiersModal } from "@/features/menu/ui/RetroModifiersModal";

export default function CartPage() {
  const {
    order,
    sortedItems,
    isEmpty,
    isConfirming,
    confirmOrder,
    handleIncrement,
    handleDecrement,
    handleRemoveAll,
    editingItem,
    editingMenuItem,
    editingInitialSelections,
    openEditor,
    closeEditor,
    handleEditSubmit,
  } = useCartPage();

  return (
    <>
      <div className="container xl:w-[70%] px-4 py-8 m-auto">
        <h1 className="m-auto mb-6 text-xl text-center font-bold uppercase tracking-widest">
          MY CART
        </h1>

        {isEmpty || !order ? (
          <CartEmptyState />
        ) : (
          <CartContent
            items={sortedItems}
            pricing={order.pricing}
            onIncrement={handleIncrement}
            onDecrement={handleDecrement}
            onRemoveAll={handleRemoveAll}
            onEdit={openEditor}
            onConfirm={confirmOrder}
            isConfirming={isConfirming}
          />
        )}
      </div>

      {editingItem && editingMenuItem?.modifiers && (
        <RetroModifiersModal
          isOpen
          onClose={closeEditor}
          productName={editingItem.name}
          basePrice={editingItem.basePrice}
          quantity={editingItem.totalQuantity}
          modifiers={editingMenuItem.modifiers}
          initialSelections={editingInitialSelections}
          confirmLabel="SAVE CHANGES"
          onSubmit={handleEditSubmit}
        />
      )}
    </>
  );
}
