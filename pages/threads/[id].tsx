import { useEffect } from "react";
import { Form, Link, useForm, useParams, useShared } from "@void/react";
import type { Props } from "./[id].server";
import { Avatar } from "../../src/components/Avatar";
import { RelativeTime } from "../../src/components/RelativeTime";
import {
  cardClass,
  errorTextClass,
  inputClass,
  primaryButtonClass,
  submitOnModEnter,
} from "../../src/components/ui";

function ReplyForm() {
  const { id } = useParams<{ id: string }>();
  const { displayName } = useShared();
  const form = useForm("/threads/:id", { body: "" }, { params: { id } });

  useEffect(() => {
    if (form.wasSuccessful) form.reset("body");
  }, [form.wasSuccessful]);

  const name = displayName ?? "ゲスト";
  return (
    <Form form={form} className={`${cardClass} flex gap-3 p-5`}>
      <Avatar name={name} />
      <div className="min-w-0 flex-1 space-y-3">
        <div>
          <textarea
            aria-label="返信"
            value={form.data.body}
            onChange={(event) => form.setData("body", event.target.value)}
            onKeyDown={submitOnModEnter}
            placeholder="返信を書く…"
            rows={4}
            className={`${inputClass} resize-y`}
          />
          {form.errors.body && <p className={errorTextClass}>{form.errors.body}</p>}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            <span className="font-semibold">{name}</span> として投稿 ・ ⌘/Ctrl + Enter で送信
          </p>
          <button disabled={form.pending} className={primaryButtonClass}>
            {form.pending ? "送信中…" : "返信する"}
          </button>
        </div>
      </div>
    </Form>
  );
}

export default function ThreadPage({ thread, posts }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/"
          className="text-sm text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
        >
          ← スレッド一覧
        </Link>
        <h1 className="mt-2 text-2xl font-bold tracking-tight break-words">{thread.title}</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {thread.authorName} が <RelativeTime value={thread.createdAt} />
          に作成 ・ {posts.length} 件の投稿
        </p>
      </div>

      <ol className="space-y-3">
        {posts.map((post, index) => (
          <li key={post.id} id={`post-${post.id}`} className={`${cardClass} flex gap-3 p-5`}>
            <Avatar name={post.authorName} />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
                <span className="font-semibold">{post.authorName}</span>
                {index === 0 && (
                  <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-semibold text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300">
                    スレッド作成者
                  </span>
                )}
                <a
                  href={`#post-${post.id}`}
                  className="text-xs text-slate-400 hover:text-indigo-600 hover:underline dark:hover:text-indigo-400"
                >
                  <RelativeTime value={post.createdAt} />
                </a>
              </div>
              <p className="mt-2 leading-relaxed break-words whitespace-pre-wrap">{post.body}</p>
            </div>
          </li>
        ))}
      </ol>

      <ReplyForm />
    </div>
  );
}
