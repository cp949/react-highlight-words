import { useMemo } from "react";
import { findAll } from "../core";
import type { Chunk, UseHighlightChunksOptions } from "../types";

/** 입력 옵션이 바뀔 때만 강조 청크를 다시 계산하는 헤드리스 훅입니다. */
export function useHighlightChunks({
  autoEscape,
  caseSensitive,
  wholeWord,
  findChunks,
  sanitize,
  query,
  text,
}: UseHighlightChunksOptions): Chunk[] {
  return useMemo(
    () =>
      findAll({
        autoEscape,
        caseSensitive,
        wholeWord,
        findChunks,
        sanitize,
        query,
        text,
      }),
    [autoEscape, caseSensitive, wholeWord, findChunks, sanitize, query, text],
  );
}
