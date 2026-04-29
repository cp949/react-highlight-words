import type { FindChunk } from "../types";

/** 겹치는 매칭 구간을 하나의 구간으로 병합합니다. */
export function combineChunks({
  chunks,
}: {
  chunks: FindChunk[];
}): FindChunk[] {
  return chunks
    .slice()
    .sort((a, b) => a.start - b.start)
    .reduce<FindChunk[]>((processed, next) => {
      if (processed.length === 0) {
        return [next];
      }

      const prev = processed[processed.length - 1];
      if (prev !== undefined && next.start < prev.end) {
        processed[processed.length - 1] = {
          start: prev.start,
          end: Math.max(prev.end, next.end),
        };
      } else {
        processed.push(next);
      }

      return processed;
    }, []);
}
