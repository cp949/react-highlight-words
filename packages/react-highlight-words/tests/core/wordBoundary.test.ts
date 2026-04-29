/**
 * wholeWord 옵션이 유니코드 단어 경계를 기준으로 부분 매칭을 차단하는지 검증한다.
 */
import { describe, expect, test } from "vitest";
import { findAll } from "../../src/core";

/** wholeWord 옵션을 켠 상태에서 강조된 부분 문자열만 추출한다. */
function highlightedText(text: string, query: string | string[]): string[] {
  return findAll({ text, query, wholeWord: true })
    .filter((chunk) => chunk.highlight)
    .map((chunk) => text.substring(chunk.start, chunk.end));
}

describe("전체 단어 경계 매칭", () => {
  test("영문 단어 내부에 포함된 query는 강조하지 않는다", () => {
    expect(highlightedText("the theme is there", "the")).toEqual(["the"]);
  });

  test("악센트가 포함된 비ASCII 단어도 하나의 단어로 판단한다", () => {
    expect(highlightedText("I love café and cafe", "café")).toEqual(["café"]);
  });

  test("숫자와 underscore에 붙은 query는 전체 단어로 보지 않는다", () => {
    expect(
      highlightedText("test test1 hello_world", ["test", "hello"]),
    ).toEqual(["test"]);
  });

  test("RegExp query는 wholeWord 옵션의 자동 경계 필터를 받지 않는다", () => {
    const text = "the theme";
    const matches = findAll({ text, query: /the/, wholeWord: true })
      .filter((chunk) => chunk.highlight)
      .map((chunk) => text.substring(chunk.start, chunk.end));

    expect(matches).toEqual(["the", "the"]);
  });
});
