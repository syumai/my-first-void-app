#!/usr/bin/env bash
# リモート DB に未適用の destructive マイグレーション (-- void:allow-destructive を含むもの) があれば失敗する。
# ALLOW_DESTRUCTIVE=true のときは一覧を表示するだけで通す。
# リモートの適用状況が判定できない場合は、安全側に倒して destructive 扱いにする。
set -euo pipefail

MIGRATIONS_DIR="${MIGRATIONS_DIR:-db/migrations}"
PRAGMA="-- void:allow-destructive"

destructive_files=$(grep -lx -- "[[:space:]]*${PRAGMA}[[:space:]]*" "$MIGRATIONS_DIR"/*.sql 2>/dev/null || true)
if [ -z "$destructive_files" ]; then
  echo "destructive なマイグレーションはありません。"
  exit 0
fi

status=$(vp exec void db status 2>&1 | sed -E 's/\x1b\[[0-9;]*m//g') || true
echo "$status"

if ! grep -q "remote:" <<<"$status"; then
  echo "警告: リモート DB のマイグレーション状況を取得できませんでした。未適用として扱います。" >&2
fi

pending=()
for file in $destructive_files; do
  name=$(basename "$file")
  if ! grep -F -- "$name" <<<"$status" | grep -q "remote: applied"; then
    pending+=("$name")
  fi
done

if [ ${#pending[@]} -eq 0 ]; then
  echo "destructive なマイグレーションはすべてリモートに適用済みです。"
  exit 0
fi

echo
echo "リモートに未適用 (または状態不明) の destructive マイグレーション:"
printf '  - %s\n' "${pending[@]}"

if [ "${ALLOW_DESTRUCTIVE:-false}" = "true" ]; then
  echo "ALLOW_DESTRUCTIVE=true のためデプロイを続行します。"
  exit 0
fi

msg="destructive なマイグレーションを含むため自動デプロイを中止しました。Actions の Deploy to Cloudflare を allow_destructive にチェックして手動実行してください。"
if [ -n "${GITHUB_ACTIONS:-}" ]; then
  echo "::error::$msg"
else
  echo "$msg" >&2
fi
exit 1
