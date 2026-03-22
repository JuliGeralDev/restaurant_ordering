"use client";

import { useGetMenu } from "../hooks/useGetMenu";
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardAction,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"


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
                    const hasModifiers = item.modifiers && 
                        (item.modifiers.protein || item.modifiers.toppings || item.modifiers.sauces);
                    
                    return (
                        <Card key={item.id} className="relative overflow-hidden pt-0 flex flex-col max-w-sm">
                            <div className="relative aspect-video w-full overflow-hidden">
                                <img
                                    src={item.imageUrl || "/placeholder-image.jpg"}
                                    alt={item.name}
                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                />
                            </div>
                            
                            <CardHeader className="flex-grow">
                                <div className="flex items-start justify-between gap-2 mb-2">
                                    <CardTitle className="text-xl">{item.name}</CardTitle>
                                    <Badge variant="secondary" className="shrink-0">
                                        ${(item.price / 100).toFixed(2)}
                                    </Badge>
                                </div>
                                <CardDescription className="line-clamp-3">
                                    {item.description}
                                </CardDescription>
                                {hasModifiers && (
                                    <div className="mt-2">
                                        <Badge variant="outline" className="text-xs">
                                            Customizable
                                        </Badge>
                                    </div>
                                )}
                            </CardHeader>
                            
                            <CardFooter className="flex flex-col gap-2">
                                <Button className="w-full">
                                    {hasModifiers ? "Customize & Add" : "Add to Cart"}
                                </Button>
                            </CardFooter>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
};
