import type { FindChunk, FindChunksOptions, HighlightQuery } from "../types";
import { escapeRegExp } from "./escapeRegExp";
import { isWholeWordMatch } from "./wordBoundary";

const defaultSanitize = (text: string): string => text;

function sanitizePreservingLength(
  sanitize: (text: string) => string,
  text: string,
): string {
  const sanitizedText = sanitize(text);
  if (sanitizedText.length !== text.length) {
    throw new Error("sanitize must preserve text length");
  }

  return sanitizedText;
}

function normalizeQuery(query: HighlightQuery): Array<string | RegExp> {
  if (typeof query === "string" || query instanceof RegExp) {
    return [query];
  }
  return [...query];
}

function createRegex(
  rawQuery: string | RegExp,
  options: Pick<FindChunksOptions, "autoEscape" | "caseSensitive" | "sanitize">,
): RegExp | null {
  const flags = options.caseSensitive ? "g" : "gi";

  if (typeof rawQuery === "string") {
    const sanitizedQuery = sanitizePreservingLength(
      options.sanitize ?? defaultSanitize,
      rawQuery,
    ).trim();
    if (sanitizedQuery.length === 0) {
      return null;
    }

    const pattern = options.autoEscape
      ? escapeRegExp(sanitizedQuery)
      : sanitizedQuery;

    return new RegExp(pattern, flags);
  }

  return new RegExp(rawQuery, flags);
}

/** 텍스트를 훑어 매칭 구간을 계산합니다. 병합과 비강조 채움은 수행하지 않습니다. */
export function findChunks({
  autoEscape,
  caseSensitive = false,
  wholeWord = false,
  sanitize = defaultSanitize,
  query,
  text,
}: FindChunksOptions): FindChunk[] {
  const sanitizedText = sanitizePreservingLength(sanitize, text);
  const chunks: FindChunk[] = [];

  for (const rawQuery of normalizeQuery(query)) {
    const regex = createRegex(rawQuery, {
      autoEscape,
      caseSensitive,
      sanitize,
    });

    if (regex == null) {
      continue;
    }

    let match = regex.exec(sanitizedText);
    while (match !== null) {
      const start = match.index;
      const end = regex.lastIndex;
      const isStringQuery = typeof rawQuery === "string";
      const shouldKeep =
        end > start &&
        (!wholeWord ||
          !isStringQuery ||
          isWholeWordMatch(sanitizedText, start, end));

      if (shouldKeep) {
        chunks.push({ start, end });
      }

      if (match.index === regex.lastIndex) {
        regex.lastIndex++;
      }

      match = regex.exec(sanitizedText);
    }
  }

  return chunks;
}
