/**
 * useHighlightChunks가 코어 계산 결과를 React 훅으로 안정적으로 노출하는지 검증한다.
 */
import { renderHook } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { useHighlightChunks } from "../../src/hooks/useHighlightChunks";

/** 훅 결과를 [start, end, highlight] 튜플 배열로 변환해 비교를 단순화한다. */
function ranges(
  chunks: ReturnType<typeof useHighlightChunks>,
): Array<[number, number, boolean]> {
  return chunks.map((chunk) => [chunk.start, chunk.end, chunk.highlight]);
}

describe("강조 청크 훅", () => {
  test("초기 입력에 대한 강조 청크를 반환한다", () => {
    const { result } = renderHook(() =>
      useHighlightChunks({ text: "cat cot", query: "cat" }),
    );

    expect(ranges(result.current)).toEqual([
      [0, 3, true],
      [3, 7, false],
    ]);
  });

  test("text와 query가 바뀌면 새 청크를 계산한다", () => {
    const { result, rerender } = renderHook(
      ({ text, query }: { text: string; query: string }) =>
        useHighlightChunks({ text, query }),
      {
        initialProps: { text: "cat cot", query: "cat" },
      },
    );

    expect(ranges(result.current)).toEqual([
      [0, 3, true],
      [3, 7, false],
    ]);

    rerender({ text: "cat cot", query: "cot" });

    expect(ranges(result.current)).toEqual([
      [0, 4, false],
      [4, 7, true],
    ]);
  });

  test("사용자 정의 findChunks에는 새 text와 query 옵션을 전달한다", () => {
    const { result } = renderHook(() =>
      useHighlightChunks({
        text: "abc",
        query: "ignored",
        findChunks: ({ text, query }) => {
          // 훅이 옵션을 그대로 전달하는지 확인하기 위한 인자 검증이다.
          expect(text).toBe("abc");
          expect(query).toBe("ignored");
          return [{ start: 1, end: 2 }];
        },
      }),
    );

    expect(ranges(result.current)).toEqual([
      [0, 1, false],
      [1, 2, true],
      [2, 3, false],
    ]);
  });
});
