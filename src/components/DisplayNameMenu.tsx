import { useEffect, useRef, useState } from "react";
import { useRouter, useShared } from "@void/react";
import { Avatar } from "./Avatar";

const DEFAULT_NAME = "ゲスト";
const MAX_LENGTH = 32;

export function DisplayNameMenu() {
  const { displayName } = useShared();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(displayName ?? "");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: PointerEvent) {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  function toggle() {
    setValue(displayName ?? "");
    setError(null);
    setOpen((current) => !current);
  }

  async function save(event: React.FormEvent) {
    event.preventDefault();
    setPending(true);
    setError(null);
    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ displayName: value }),
      });
      if (!response.ok) {
        setError(`表示名は1〜${MAX_LENGTH}文字で入力してください`);
        return;
      }
      setOpen(false);
      router.refresh();
    } catch {
      setError("保存に失敗しました。もう一度お試しください");
    } finally {
      setPending(false);
    }
  }

  const name = displayName ?? DEFAULT_NAME;

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={toggle}
        aria-expanded={open}
        className="flex items-center gap-2 rounded-full border border-slate-200 bg-white py-1 pr-3 pl-1 text-sm font-medium shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800"
      >
        <Avatar name={name} size="sm" />
        <span className="max-w-32 truncate">{name}</span>
        {!displayName && (
          <span className="rounded-full bg-indigo-100 px-1.5 text-[10px] font-semibold text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300">
            未設定
          </span>
        )}
      </button>
      {open && (
        <form
          onSubmit={save}
          className="absolute right-0 z-20 mt-2 w-72 rounded-xl border border-slate-200 bg-white p-4 shadow-xl dark:border-slate-700 dark:bg-slate-900"
        >
          <label htmlFor="display-name" className="block text-sm font-semibold">
            表示名
          </label>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            投稿に表示される名前です。このブラウザに保存されます。
          </p>
          <input
            id="display-name"
            autoFocus
            value={value}
            maxLength={MAX_LENGTH}
            onChange={(event) => setValue(event.target.value)}
            placeholder="例: Alice"
            className="mt-3 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 dark:border-slate-700 dark:bg-slate-950"
          />
          {error && <p className="mt-2 text-xs text-rose-600 dark:text-rose-400">{error}</p>}
          <div className="mt-3 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              キャンセル
            </button>
            <button
              disabled={pending || value.trim().length === 0}
              className="rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"
            >
              {pending ? "保存中…" : "保存"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
