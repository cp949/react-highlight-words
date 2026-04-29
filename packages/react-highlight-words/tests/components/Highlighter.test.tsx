/**
 * Highlighter 컴포넌트가 새 slot/render-prop API로 올바른 DOM을 렌더링하는지 검증한다.
 */
import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import type { PropsWithChildren } from "react";
import { describe, expect, test } from "vitest";
import { Highlighter } from "../../src/components/Highlighter";
import type { HighlightSlotInjectedProps } from "../../src/types";

/** 사용자 정의 highlight 슬롯 컴포넌트가 주입 prop을 데이터 속성으로 노출한다. */
function CustomHighlight({
  children,
  highlightIndex,
  isActive,
}: PropsWithChildren<HighlightSlotInjectedProps>) {
  return (
    <em data-active={String(isActive)} data-index={highlightIndex}>
      {children}
    </em>
  );
}

describe("하이라이터 렌더링", () => {
  test("기본 highlight 슬롯은 data-highlight와 data-highlight-index를 렌더링한다", () => {
    render(<Highlighter text="cat cot" query={/c[ao]t/} />);

    const marks = screen.getAllByText(/cat|cot/);

    expect(marks[0]).toHaveAttribute("data-highlight", "cat");
    expect(marks[0]).toHaveAttribute("data-highlight-index", "0");
    expect(marks[1]).toHaveAttribute("data-highlight", "cot");
    expect(marks[1]).toHaveAttribute("data-highlight-index", "1");
  });

  test("active 설정은 지정한 강조 인덱스에 className과 style을 합쳐 적용한다", () => {
    render(
      <Highlighter
        text="cat cot"
        query={/c[ao]t/}
        active={{ index: 1, className: "active", style: { color: "red" } }}
        highlight={{ className: "highlight", style: { fontWeight: "bold" } }}
      />,
    );

    const cot = screen.getByText("cot");

    expect(cot).toHaveClass("highlight");
    expect(cot).toHaveClass("active");
    expect(cot).toHaveStyle({ color: "rgb(255, 0, 0)", fontWeight: "bold" });
  });

  test("문자열 DOM 태그에는 custom highlight prop을 전달하지 않는다", () => {
    render(<Highlighter text="cat" query="cat" highlight={{ as: "strong" }} />);

    const strong = screen.getByText("cat");

    expect(strong.tagName).toBe("STRONG");
    expect(strong).not.toHaveAttribute("highlightIndex");
    expect(strong).not.toHaveAttribute("isActive");
  });

  test("사용자 highlight 컴포넌트에는 highlightIndex와 isActive를 전달한다", () => {
    render(
      <Highlighter
        text="cat cot"
        query="cot"
        active={{ index: 0 }}
        highlight={{ as: CustomHighlight }}
      />,
    );

    const custom = screen.getByText("cot");

    expect(custom.tagName).toBe("EM");
    expect(custom).toHaveAttribute("data-index", "0");
    expect(custom).toHaveAttribute("data-active", "true");
  });

  test("renderHighlight는 highlight 슬롯 설정보다 우선한다", () => {
    render(
      <Highlighter
        text="cat cot"
        query="cat"
        highlight={{ as: "mark", className: "ignored" }}
        renderHighlight={({ text }) => <strong>{text}</strong>}
      />,
    );

    const rendered = screen.getByText("cat");

    expect(rendered.tagName).toBe("STRONG");
    expect(rendered).not.toHaveClass("ignored");
  });
});
