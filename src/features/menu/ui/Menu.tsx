"use client";

import { useGetMenu } from "../hooks/useGetMenu";
import { RetroMenuCard } from "./RetroMenuCard";
import { useAddToCart } from "@/features/cart/hooks/useAddToCart";


export const Menu = () => {
    const { data, isLoading, error } = useGetMenu();
    const { addToCart, isLoading: isAddingToCart } = useAddToCart();

    const handleAddToCart = async (productId: string, quantity: number, selectedModifiers?: Array<{type: string; value: string}>) => {
        try {
            await addToCart(productId, quantity, selectedModifiers);
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
            <h1 className="text-4xl font-bold mb-8 text-center">Our Menu</h1>
            
            {/* Grid responsive: 1 columna en mÃ³vil, 2 en tablet, 3 en desktop */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10  ">
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
