import { Link } from "@void/react";
import { DisplayNameMenu } from "../src/components/DisplayNameMenu";
import "../src/app.css";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
        <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2 font-bold tracking-tight">
            <span className="flex size-7 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 text-sm text-white">
              V
            </span>
            Void Board
          </Link>
          <DisplayNameMenu />
        </div>
      </header>
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8">{children}</main>
      <footer className="py-6 text-center text-xs text-slate-400">Built with Void</footer>
    </div>
  );
}
