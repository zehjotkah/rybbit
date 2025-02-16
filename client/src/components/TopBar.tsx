import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "./ui/navigation-menu";

export function TopBar() {
  return (
    <div className="flex h-16 items-center px-4">
      <div className="flex items-center space-x-4">
        <Link href="/" className="font-bold text-xl">
          🐸 Frogstats
        </Link>
      </div>
      <div className="ml-auto flex items-center space-x-4">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link href="/">
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Dashboard
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/settings">
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Settings
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        {/* <nav className="flex items-center space-x-4">
          <Link
            href="/"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Dashboard
          </Link>
          <Link
            href="/settings"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Settings
          </Link>
        </nav> */}
        <ThemeToggle />
      </div>
    </div>
  );
}
