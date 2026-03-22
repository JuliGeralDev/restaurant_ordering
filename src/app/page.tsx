import { Menu } from "@/features/menu/ui/Menu";
import { CartPanel } from "@/features/cart/ui/CartPanel";

export default function Home() {
  return (
    <div className="pr-52">
      <Menu />
      <CartPanel />
    </div>
  );
}
