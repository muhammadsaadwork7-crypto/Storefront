import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Tags,
  Truck,
  Users,
  ShoppingCart,
  CreditCard,
  Boxes,
  Store,
} from "lucide-react";
import { cn } from "@/lib/utils";

const groups = [
  {
    label: "Overview",
    items: [{ to: "/admin", label: "Dashboard", icon: LayoutDashboard }],
  },
  {
    label: "Catalog",
    items: [
      { to: "/admin/products", label: "Products", icon: Package },
      { to: "/admin/categories", label: "Categories", icon: Tags },
      { to: "/admin/suppliers", label: "Suppliers", icon: Truck },
    ],
  },
  {
    label: "Operations",
    items: [
      { to: "/admin/orders", label: "Orders", icon: ShoppingCart },
      { to: "/admin/payments", label: "Payments", icon: CreditCard },
    ],
  },
  {
    label: "People",
    items: [{ to: "/admin/users", label: "Users", icon: Users }],
  },
];

export default function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-40 flex w-60 flex-col bg-sidebar text-sidebar-foreground">
      <div className="flex h-14 items-center gap-2 px-5">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <Boxes className="h-4 w-4" />
        </div>
        <span className="font-semibold tracking-tight">Storefront</span>
        <span className="ml-auto rounded-full bg-sidebar-accent px-2 py-0.5 text-[10px] font-medium text-sidebar-foreground/70">
          Admin
        </span>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 scrollbar-thin">
        {groups.map((group) => (
          <div key={group.label} className="mb-5">
            <p className="mb-1.5 px-2 text-[11px] font-semibold uppercase tracking-wider text-sidebar-foreground/40">
              {group.label}
            </p>
            <div className="flex flex-col gap-0.5">
              {group.items.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === "/admin"}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary/15 text-white shadow-[inset_2px_0_0_0] shadow-primary"
                        : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-white"
                    )
                  }
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </NavLink>
              ))}
            </div>
          </div>
        ))}

        <div className="mb-2">
          <p className="mb-1.5 px-2 text-[11px] font-semibold uppercase tracking-wider text-sidebar-foreground/40">
            Storefront
          </p>
          <NavLink
            to="/"
            className="flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm font-medium text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-white"
          >
            <Store className="h-4 w-4" />
            View storefront
          </NavLink>
        </div>
      </nav>

      <div className="border-t border-sidebar-border p-3">
        <div className="flex items-center gap-2.5 rounded-md px-2 py-1.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/20 text-xs font-semibold text-primary">
            A
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-medium">Admin User</span>
            <span className="text-xs text-sidebar-foreground/40">admin@site.com</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
