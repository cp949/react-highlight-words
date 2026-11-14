#!/usr/bin/env bash
# 빌드 산출물과 의존성 폴더를 삭제한다.
#
# 사용법: ./clean.sh [--dry-run]
#   --dry-run  삭제하지 않고 대상만 출력
#
# 삭제 대상: 루트, demo, packages/* 바로 아래의 폴더만 해당한다.
#   node_modules, .turbo, .next, dist, build, out, coverage
# src 등 그 외 폴더는 탐색하지 않는다. (이름이 같은 소스 폴더 오삭제 방지)
# 삭제 후 `pnpm install`로 의존성을 다시 설치해야 한다.

set -Eeuo pipefail
shopt -s nullglob

readonly SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
cd -- "$SCRIPT_DIR"
readonly REPO_ROOT="$SCRIPT_DIR"

DRY_RUN=false
if [[ "${1:-}" == "--dry-run" ]]; then
  DRY_RUN=true
elif [[ $# -gt 0 ]]; then
  printf 'usage: %s [--dry-run]\n' "$(basename "$0")" >&2
  exit 2
fi

# 정리할 패키지 폴더: 루트와 워크스페이스(pnpm-workspace.yaml과 같은 범위)
package_dirs=("$REPO_ROOT" "$REPO_ROOT/demo" "$REPO_ROOT"/packages/*)

removed=0
for package_dir in "${package_dirs[@]}"; do
  [[ -d "$package_dir" ]] || continue

  # 패키지 폴더 바로 아래(depth 1)만 검사한다.
  while IFS= read -r -d '' path; do
    relative_path="${path#"$REPO_ROOT/"}"
    if [[ "$DRY_RUN" == true ]]; then
      printf '[dry-run] %s\n' "$relative_path"
    else
      rm -rf -- "$path"
      printf 'removed %s\n' "$relative_path"
    fi
    ((removed += 1))
  done < <(
    find "$package_dir" -mindepth 1 -maxdepth 1 -type d \( \
      -name node_modules \
      -o -name .turbo \
      -o -name .next \
      -o -name dist \
      -o -name build \
      -o -name out \
      -o -name coverage \
    \) -print0 | sort -z
  )
done

if [[ "$DRY_RUN" == true ]]; then
  printf 'would remove %d directories\n' "$removed"
else
  printf 'removed %d directories\n' "$removed"
fi
