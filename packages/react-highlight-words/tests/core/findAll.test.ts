/**
 * findAll이 검색어를 최종 강조/비강조 청크로 변환하는 핵심 규칙을 검증한다.
 */
import { describe, expect, test } from "vitest";
import { findAll } from "../../src/core";

/** 청크 배열을 [start, end, highlight] 튜플 배열로 변환해 비교를 단순화한다. */
function ranges(
  chunks: ReturnType<typeof findAll>,
): Array<[number, number, boolean]> {
  return chunks.map((chunk) => [chunk.start, chunk.end, chunk.highlight]);
}

describe("최종 청크 계산", () => {
  test("빈 query는 전체 텍스트를 비강조 청크 하나로 반환한다", () => {
    expect(ranges(findAll({ text: "abc", query: [] }))).toEqual([
      [0, 3, false],
    ]);
  });

  test("문자열 query는 같은 단어가 반복될 때 모든 위치를 강조한다", () => {
    expect(ranges(findAll({ text: "abc abc", query: "abc" }))).toEqual([
      [0, 3, true],
      [3, 4, false],
      [4, 7, true],
    ]);
  });

  test("caseSensitive가 true이면 대소문자를 구분한다", () => {
    expect(
      ranges(findAll({ text: "Dog dog", query: "dog", caseSensitive: true })),
    ).toEqual([
      [0, 4, false],
      [4, 7, true],
    ]);
  });

  test("RegExp query는 작성한 패턴에 맞는 텍스트만 강조한다", () => {
    expect(ranges(findAll({ text: "cat cot cut", query: /c[ao]t/ }))).toEqual([
      [0, 3, true],
      [3, 4, false],
      [4, 7, true],
      [7, 11, false],
    ]);
  });

  test("겹치는 query 범위는 가장 긴 항목 선택이 아니라 하나의 강조 범위로 병합한다", () => {
    expect(ranges(findAll({ text: "abcd", query: ["abc", "bcd"] }))).toEqual([
      [0, 4, true],
    ]);
  });

  test("공백만 있는 문자열 query는 무시하지만 RegExp 공백 query는 강조한다", () => {
    expect(ranges(findAll({ text: "a b", query: "   " }))).toEqual([
      [0, 3, false],
    ]);
    expect(ranges(findAll({ text: "a b", query: /\s/ }))).toEqual([
      [0, 1, false],
      [1, 2, true],
      [2, 3, false],
    ]);
  });

  test("길이 보존 sanitize는 원본 text 기준 인덱스를 유지한다", () => {
    expect(
      ranges(
        findAll({
          text: "École",
          query: "é",
          sanitize: (value) => value.toLocaleLowerCase(),
        }),
      ),
    ).toEqual([
      [0, 1, true],
      [1, 5, false],
    ]);
  });

  test("길이가 달라지는 sanitize는 원본 인덱스 보존을 위해 거부한다", () => {
    expect(() =>
      findAll({
        text: "café",
        query: "cafe",
        sanitize: (value) => value.normalize("NFD"),
      }),
    ).toThrow("sanitize must preserve text length");
  });
});
