export interface MenuItemDto {
  id: number | string;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  category?: string;
}

export type GetMenuResponse = MenuItemDto[];

export interface MenuItem {
  id: number | string;
  name: string;
  description: string;
  price: number;
  imageUrl: string | null;
}
