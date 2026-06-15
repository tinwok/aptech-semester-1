import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function NavButton({ item }) {
  return (
    <NavLink to={item.path}>
      {({ isActive }) => (
        <Button variant="link" className="text-[var(--color-zen-primary)]">
          {item.label}
        </Button>
      )}
    </NavLink>
  );
}
