import type { Chunk, FindChunk } from "../types";

/** 강조 구간 사이의 비강조 구간을 채워 전체 텍스트를 덮는 청크 배열을 만듭니다. */
export function fillInChunks({
  chunksToHighlight,
  totalLength,
}: {
  chunksToHighlight: FindChunk[];
  totalLength: number;
}): Chunk[] {
  const allChunks: Chunk[] = [];
  const append = (start: number, end: number, highlight: boolean): void => {
    if (end > start) {
      allChunks.push({ start, end, highlight });
    }
  };

  if (chunksToHighlight.length === 0) {
    append(0, totalLength, false);
    return allChunks;
  }

  let lastIndex = 0;
  for (const chunk of chunksToHighlight) {
    append(lastIndex, chunk.start, false);
    append(chunk.start, chunk.end, true);
    lastIndex = chunk.end;
  }

  append(lastIndex, totalLength, false);
  return allChunks;
}
