import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";

export function TopBar() {
  return (
    <div className="flex h-16 items-center px-4">
      <div className="flex items-center space-x-4">
        <Link href="/" className="font-bold text-xl">
          🐸 Frogstats
        </Link>
      </div>
      <div className="ml-auto flex items-center space-x-4">
        <nav className="flex items-center space-x-4">
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
        </nav>
        <ThemeToggle />
      </div>
    </div>
  );
}
