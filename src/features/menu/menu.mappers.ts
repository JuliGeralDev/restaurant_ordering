import type { GetMenuResponse, MenuItem, MenuItemDto } from "./menu.types";

const mapMenuItem = (item: MenuItemDto): MenuItem => {
  return {
    id: item.id,
    name: item.name,
    description: item.description ?? "",
    price: item.price,
    imageUrl: item.imageUrl ?? null
  };
};

export const mapGetMenuResponse = (response: GetMenuResponse): MenuItem[] => {
  console.log("Mapping menu response:", response);
  return response.map(mapMenuItem);
};
