export interface ModifierOptionDto {
  name: string;
  price: number;
}

export interface ModifierGroupDto {
  required: boolean;
  max?: number;
  options: Record<string, ModifierOptionDto>;
}

export interface ModifiersDto {
  protein?: ModifierGroupDto;
  toppings?: ModifierGroupDto;
  sauces?: ModifierGroupDto;
}

export interface MenuItemDto {
  productId: string;
  name: string;
  description: string;
  imageUrl?: string;
  basePrice: number;
  createdAt: string;
  updatedAt: string;
  modifiers?: ModifiersDto;
}

export type GetMenuResponse = MenuItemDto[];


export interface ModifierOption {
  id: string;
  name: string;
  price: number;
}

export interface ModifierGroup {
  required: boolean;
  max?: number;
  options: ModifierOption[];
}

export type Modifiers = {
  protein?: ModifierGroup;
  toppings?: ModifierGroup;
  sauces?: ModifierGroup;
};

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  imageUrl: string | null;
  price: number;
  modifiers?: Modifiers;
}