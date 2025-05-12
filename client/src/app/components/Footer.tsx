import Link from "next/link";

const VERSION = "v0.1.4";

export function Footer() {
  const gitSha = process.env.NEXT_PUBLIC_GIT_SHA;
  return (
    <div className="flex justify-center items-center h-12 text-neutral-400 gap-4 text-xs">
      <p>© 2025 Rybbit</p>
      <Link
        href={`https://github.com/rybbit-io/rybbit/releases/tag/${VERSION}`}
        className="hover:text-neutral-300"
      >
        {VERSION}
      </Link>
      <Link href="https://rybbit.io/docs" className="hover:text-neutral-300">
        Docs
      </Link>
      <Link
        href="https://github.com/rybbit-io/rybbit"
        className="hover:text-neutral-300"
      >
        Github
      </Link>
    </div>
  );
}
