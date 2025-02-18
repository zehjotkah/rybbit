import { GearSix } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";

export function TopBar() {
  return (
    <div className="flex pt-2 items-center w-full pb-4 bg-neutral-900 justify-center">
      <div className="flex items-center justify-between max-w-6xl flex-1">
        <div className="flex items-center space-x-4">
          <Link href="/" className="font-bold text-xl">
            🐸 Frogstats
          </Link>
        </div>
        <nav className="ml-auto flex items-center space-x-6 text-sm">
          <Link href="/" className="text-neutral-100">
            Websites
          </Link>
          <Link
            href="/settings"
            className="text-neutral-100 flex items-center gap-1"
          >
            <GearSix size={18} />
            Settings
          </Link>
          <ThemeToggle />
        </nav>
      </div>
    </div>
  );
}
