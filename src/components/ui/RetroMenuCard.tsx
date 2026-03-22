"use client";

import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import {
  Card,
  CardContent,
} from "@/components/ui/card";

interface RetroMenuCardProps {
  name: string;
  price: number;
  image: string;
  hasModifiers?: boolean;
}

export const RetroMenuCard = ({
  name,
  price,
  image,
  hasModifiers
}: RetroMenuCardProps) => {

  return (
    <Card className="relative max-w-sm overflow-hidden rounded-[2rem] border-[10px] border-zinc-500 bg-gradient-to-b from-zinc-400 via-zinc-300 to-zinc-400 shadow-2xl shadow-zinc-600/50">

      {/* Speaker Grille Top - Rejilla de altavoz superior */}
      <div className="flex justify-center gap-1 py-0.5">
        <div className="h-0.5 w-2 rounded-full bg-zinc-600/50"></div>
        <div className="h-0.5 w-2 rounded-full bg-zinc-600/50"></div>
        <div className="h-0.5 w-2 rounded-full bg-zinc-600/50"></div>
        <div className="h-0.5 w-2 rounded-full bg-zinc-600/50"></div>
        <div className="h-0.5 w-2 rounded-full bg-zinc-600/50"></div>
        <div className="h-0.5 w-2 rounded-full bg-zinc-600/50"></div>
      </div>

      {/* TITLE - Nombre del producto */}
      <div className="bg-zinc-600 text-green-400 font-bold text-center py-2 text-[10px] tracking-wider uppercase border-y-4 border-zinc-700 shadow-inner font-press-start">
        {name}
      </div>

      <CardContent className="p-3 flex flex-col gap-3">

        {/* IMAGE SCREEN - Pantalla de la consola */}
        <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden border-[6px] border-zinc-700 bg-black shadow-2xl shadow-black/50">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover"
          />
          {/* Screen glare effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>
        </div>

        {/* CONSOLE PANEL - Panel inferior */}
        <div className="bg-zinc-300 rounded-2xl p-4 shadow-inner border-4 border-zinc-400">

          {/* PRICE DISPLAY - Display de precio */}
          <div className="bg-zinc-800 text-green-400 text-center py-2 px-3 rounded-xl text-lg font-bold mb-2 border-4 border-zinc-700 shadow-[inset_0_2px_8px_rgba(0,0,0,0.6)] font-press-start">
            ${(price / 100).toFixed(2)}
          </div>

          {/* CONTROLS - Controles de la consola */}
          <div className="flex items-center justify-between px-1">
            
            {/* D-PAD / CRUCETA - Izquierda */}
            <div className="relative h-12 w-12">
              {/* Top */}
              <div className="absolute left-1/2 top-0 h-4 w-4 -translate-x-1/2 rounded-md bg-zinc-700 shadow-lg border-2 border-zinc-800"></div>
              {/* Bottom */}
              <div className="absolute bottom-0 left-1/2 h-4 w-4 -translate-x-1/2 rounded-md bg-zinc-700 shadow-lg border-2 border-zinc-800"></div>
              {/* Left */}
              <div className="absolute left-0 top-1/2 h-4 w-4 -translate-y-1/2 rounded-md bg-zinc-700 shadow-lg border-2 border-zinc-800"></div>
              {/* Right */}
              <div className="absolute right-0 top-1/2 h-4 w-4 -translate-y-1/2 rounded-md bg-zinc-700 shadow-lg border-2 border-zinc-800"></div>
              {/* Center */}
              <div className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-md bg-zinc-800 shadow-inner"></div>
            </div>

            {/* LABEL - Options indicator (solo para items con modificadores) */}
            {hasModifiers && (
              <span className="font-press-start text-[6px] font-bold tracking-widest bg-zinc-600 rounded px-2 py-0.5 text-green-400 shadow-md">
                + OPTIONS
              </span>
            )}
            
            {/* ACTION AREA - Derecha */}
            <div className="flex gap-2 items-center">
              {/* Add to Cart Button */}
              <Button
                className="h-11 w-11 rounded-full bg-purple-600 hover:bg-purple-700 border-4 border-purple-900 shadow-lg text-white transition-all hover:scale-110 active:scale-95 relative"
              >
                <ShoppingCart className="h-5 w-5 absolute" />
                <span className="absolute -top-1 -right-1 bg-green-400 text-zinc-900 rounded-full h-4 w-4 flex items-center justify-center text-xs font-bold">+</span>
              </Button>
              
              {/* Power indicator / decorative button */}
              <div className="h-6 w-6 self-end rounded-full bg-zinc-700 shadow-[inset_0_2px_6px_rgba(0,0,0,0.6)] border-2 border-zinc-800"></div>
            </div>

          </div>

        </div>

      </CardContent>

      {/* Speaker Grille Bottom - Rejilla de altavoz inferior */}
      <div className="flex justify-center gap-0.5 py-1">
        <div className="h-1 w-0.5 rounded-full bg-zinc-600/50"></div>
        <div className="h-1 w-0.5 rounded-full bg-zinc-600/50"></div>
        <div className="h-1 w-0.5 rounded-full bg-zinc-600/50"></div>
        <div className="h-1 w-0.5 rounded-full bg-zinc-600/50"></div>
        <div className="h-1 w-0.5 rounded-full bg-zinc-600/50"></div>
        <div className="h-1 w-0.5 rounded-full bg-zinc-600/50"></div>
        <div className="h-1 w-0.5 rounded-full bg-zinc-600/50"></div>
        <div className="h-1 w-0.5 rounded-full bg-zinc-600/50"></div>
        <div className="h-1 w-0.5 rounded-full bg-zinc-600/50"></div>
        <div className="h-1 w-0.5 rounded-full bg-zinc-600/50"></div>
      </div>

      {/* Decorative screws - Tornillos decorativos */}
      <div className="absolute top-3 left-3 h-1.5 w-1.5 rounded-full bg-zinc-600 shadow-inner"></div>
      <div className="absolute top-3 right-3 h-1.5 w-1.5 rounded-full bg-zinc-600 shadow-inner"></div>
      <div className="absolute bottom-3 left-3 h-1.5 w-1.5 rounded-full bg-zinc-600 shadow-inner"></div>
      <div className="absolute bottom-3 right-3 h-1.5 w-1.5 rounded-full bg-zinc-600 shadow-inner"></div>

    </Card>
  );
};