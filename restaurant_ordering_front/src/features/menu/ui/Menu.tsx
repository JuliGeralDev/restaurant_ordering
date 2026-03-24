"use client";

import { useEffect, useState } from "react";

import { useAddToCart } from "@/features/cart/hooks/useAddToCart";
import { useGetMenu } from "../hooks/useGetMenu";
import { RetroMenuCard } from "./RetroMenuCard";

export const Menu = () => {
    const { data, isLoading, error } = useGetMenu();
    const { addToCart } = useAddToCart();
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    useEffect(() => {
        if (!successMessage) {
            return;
        }

        const timeoutId = window.setTimeout(() => {
            setSuccessMessage(null);
        }, 2500);

        return () => window.clearTimeout(timeoutId);
    }, [successMessage]);

    const handleAddToCart = async (
        productId: string,
        quantity: number,
        selectedModifiers?: Array<{ groupId: string; optionId: string; name: string; price: number }>
    ) => {
        try {
            await addToCart(productId, quantity, selectedModifiers);
            setSuccessMessage("Producto agregado al carrito exitosamente");
        } catch (error) {
            console.error("Failed to add item to cart:", error);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-lg text-muted-foreground">Loading menu...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-lg text-destructive">Error loading menu: {error}</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {successMessage && (
                <div className="fixed inset-x-4 top-20 z-40 mx-auto max-w-sm rounded-2xl border-4 border-green-900 bg-green-500 px-4 py-3 text-center text-[10px] leading-4 text-white shadow-2xl shadow-green-950/40 sm:inset-x-auto sm:right-6 sm:top-24">
                    {successMessage}
                </div>
            )}

            <h1 className="mb-8 text-center text-4xl font-bold">Our Menu</h1>

            <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
                {data.map((item) => (
                    <RetroMenuCard
                        key={item.id}
                        productId={item.id}
                        name={item.name}
                        description={item.description}
                        price={item.price}
                        image={item.imageUrl || "/placeholder-image.jpg"}
                        modifiers={item.modifiers}
                        onAddToCart={(qty, mods) => handleAddToCart(item.id, qty, mods)}
                    />
                ))}
            </div>
        </div>
    );
};
