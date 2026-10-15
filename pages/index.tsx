import { useState } from "react";
import { Form, Link, useForm, useShared } from "@void/react";
import type { Props } from "./index.server";
import { Avatar } from "../src/components/Avatar";
import { RelativeTime } from "../src/components/RelativeTime";
import {
  cardClass,
  errorTextClass,
  inputClass,
  primaryButtonClass,
  submitOnModEnter,
} from "../src/components/ui";

function NewThreadForm({ onCancel }: { onCancel: () => void }) {
  const { displayName } = useShared();
  const form = useForm("/", { title: "", body: "" });
  return (
    <Form form={form} className={`${cardClass} space-y-4 p-5`}>
      <div>
        <input
          aria-label="タイトル"
          autoFocus
          value={form.data.title}
          onChange={(event) => form.setData("title", event.target.value)}
          placeholder="スレッドのタイトル"
          maxLength={100}
          className={`${inputClass} text-base font-semibold`}
        />
        {form.errors.title && <p className={errorTextClass}>{form.errors.title}</p>}
      </div>
      <div>
        <textarea
          aria-label="本文"
          value={form.data.body}
          onChange={(event) => form.setData("body", event.target.value)}
          onKeyDown={submitOnModEnter}
          placeholder="話題の内容を書いてみましょう"
          rows={5}
          className={`${inputClass} resize-y`}
        />
        {form.errors.body && <p className={errorTextClass}>{form.errors.body}</p>}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-slate-500 dark:text-slate-400">
          <span className="font-semibold">{displayName ?? "ゲスト"}</span> として投稿
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            キャンセル
          </button>
          <button disabled={form.pending} className={primaryButtonClass}>
            {form.pending ? "作成中…" : "スレッドを作成"}
          </button>
        </div>
      </div>
    </Form>
  );
}

export default function HomePage({ threads }: Props) {
  const [composing, setComposing] = useState(false);
  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">スレッド</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {threads.length} 件の話題
          </p>
        </div>
        {!composing && (
          <button type="button" onClick={() => setComposing(true)} className={primaryButtonClass}>
            <span aria-hidden>＋</span> 新しいスレッド
          </button>
        )}
      </div>

      {composing && <NewThreadForm onCancel={() => setComposing(false)} />}

      {threads.length === 0 ? (
        <div className={`${cardClass} p-10 text-center text-slate-500 dark:text-slate-400`}>
          まだスレッドがありません。最初の話題を立ててみましょう！
        </div>
      ) : (
        <ul
          className={`${cardClass} divide-y divide-slate-100 overflow-hidden dark:divide-slate-800`}
        >
          {threads.map((thread) => (
            <li key={thread.id}>
              <Link
                href={`/threads/${thread.id}`}
                className="flex items-center gap-4 px-5 py-4 transition hover:bg-slate-50 dark:hover:bg-slate-800/50"
              >
                <Avatar name={thread.authorName} />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">{thread.title}</p>
                  <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                    {thread.authorName} ・ <RelativeTime value={thread.createdAt} />
                    に作成
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                    💬 {thread.postCount}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    <RelativeTime value={thread.lastPostedAt} />
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
