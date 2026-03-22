"use client";

import { useGetMenu } from "../hooks/useGetMenu";
import { RetroMenuCard } from "@/components/ui/RetroMenuCard"


export const Menu = () => {
    const { data, isLoading, error } = useGetMenu();

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
            
            {/* Grid responsive: 1 columna en móvil, 2 en tablet, 3 en desktop */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10  ">
                {data.map((item) => {
                    const hasModifiers = !!(item.modifiers && 
                        (item.modifiers.protein || item.modifiers.toppings || item.modifiers.sauces));
                    
                    return (
                        <RetroMenuCard
                            key={item.id}
                            name={item.name}
                            price={item.price}
                            image={item.imageUrl || "/placeholder-image.jpg"}
                            hasModifiers={hasModifiers}
                        />
                    );
                })}
            </div>
        </div>
    );
};
