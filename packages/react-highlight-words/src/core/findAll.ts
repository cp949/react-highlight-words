import type { Chunk, FindAllOptions } from "../types";
import { combineChunks } from "./combineChunks";
import { fillInChunks } from "./fillInChunks";
import { findChunks } from "./findChunks";

/** query/text 옵션에서 강조/비강조 청크 배열을 계산합니다. */
export function findAll({
  autoEscape,
  caseSensitive = false,
  wholeWord = false,
  findChunks: customFindChunks = findChunks,
  sanitize,
  query,
  text,
}: FindAllOptions): Chunk[] {
  return fillInChunks({
    chunksToHighlight: combineChunks({
      chunks: customFindChunks({
        autoEscape,
        caseSensitive,
        wholeWord,
        sanitize,
        query,
        text,
      }),
    }),
    totalLength: text.length,
  });
}
