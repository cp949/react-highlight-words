import type { CSSProperties, ElementType, ReactElement } from "react";
import { Fragment } from "react";
import { useHighlightChunks } from "../hooks/useHighlightChunks";
import type {
  Chunk,
  HighlighterProps,
  HighlightSlotInjectedProps,
} from "../types";

// 슬롯 기본값을 안정적인 참조로 유지하여 불필요한 재계산을 방지합니다.
const EMPTY_HIGHLIGHT = {};
const EMPTY_UNHIGHLIGHT = {};

/** 여러 className을 공백으로 합치고, 비어 있으면 undefined를 반환합니다. */
function joinClassNames(
  ...classNames: Array<string | undefined>
): string | undefined {
  const joined = classNames.filter(Boolean).join(" ");
  return joined.length > 0 ? joined : undefined;
}

/** 두 스타일 객체를 병합합니다. override가 base보다 우선합니다. */
function mergeStyles(
  base: CSSProperties | undefined,
  override: CSSProperties | undefined,
): CSSProperties | undefined {
  if (base == null) {
    return override;
  }

  if (override == null) {
    return base;
  }

  return { ...base, ...override };
}

/** 현재 런타임이 production 모드인지 안전하게 검사합니다. */
function isProduction(): boolean {
  const runtime = globalThis as typeof globalThis & {
    process?: { env?: { NODE_ENV?: string } };
  };

  return runtime.process?.env?.NODE_ENV === "production";
}

/** renderHighlight/renderUnhighlight가 슬롯 옵션을 덮어쓸 때 개발 환경에서 경고합니다. */
function warnRenderOverride(slotName: "highlight" | "unhighlight"): void {
  if (!isProduction()) {
    console.warn(
      `@cp949/react-highlight-words: render ${slotName} overrides ${slotName} slot options.`,
    );
  }
}

/** 슬롯/렌더 prop 기반의 새 Highlighter 컴포넌트입니다. */
export function Highlighter({
  text,
  query,
  autoEscape,
  caseSensitive = false,
  wholeWord = false,
  sanitize,
  findChunks,
  active,
  highlight = EMPTY_HIGHLIGHT,
  unhighlight = EMPTY_UNHIGHLIGHT,
  renderHighlight,
  renderUnhighlight,
  as: Root = "span",
  className,
  ...rest
}: HighlighterProps): ReactElement {
  const chunks = useHighlightChunks({
    autoEscape,
    caseSensitive,
    wholeWord,
    sanitize,
    findChunks,
    query,
    text,
  });

  // renderProp이 슬롯 설정을 무시하므로 개발 환경에서만 경고합니다.
  if (renderHighlight != null && highlight.as != null) {
    warnRenderOverride("highlight");
  }

  if (renderUnhighlight != null && unhighlight.as != null) {
    warnRenderOverride("unhighlight");
  }

  let matchIndex = -1;

  const children = chunks.map((chunk: Chunk) => {
    const chunkText = text.substring(chunk.start, chunk.end);
    // 청크의 start/end는 원본 text 위에서 유일하므로 안정적인 key로 사용 가능합니다.
    const chunkKey = `${chunk.start}-${chunk.end}`;

    if (chunk.highlight) {
      matchIndex += 1;
      const isActive = active?.index === matchIndex;

      if (renderHighlight != null) {
        return (
          <Fragment key={chunkKey}>
            {renderHighlight({ text: chunkText, matchIndex, isActive, chunk })}
          </Fragment>
        );
      }

      const HighlightTag: ElementType = highlight.as ?? "mark";
      const slotClassName = highlight.classNameByMatch?.(chunkText, chunk);
      const highlightProps: {
        className?: string;
        style?: CSSProperties;
        "data-highlight": string;
        "data-highlight-index": number;
      } & Partial<HighlightSlotInjectedProps> = {
        className: joinClassNames(
          highlight.className,
          slotClassName,
          isActive ? active?.className : undefined,
        ),
        style: mergeStyles(
          highlight.style,
          isActive ? active?.style : undefined,
        ),
        "data-highlight": chunkText,
        "data-highlight-index": matchIndex,
      };

      // 사용자 정의 컴포넌트(non-string 태그)에만 강조 메타데이터를 prop으로 주입합니다.
      if (typeof HighlightTag !== "string") {
        highlightProps.highlightIndex = matchIndex;
        highlightProps.isActive = isActive;
      }

      return (
        <HighlightTag key={chunkKey} {...highlightProps}>
          {chunkText}
        </HighlightTag>
      );
    }

    if (renderUnhighlight != null) {
      return (
        <Fragment key={chunkKey}>
          {renderUnhighlight({ text: chunkText, chunk })}
        </Fragment>
      );
    }

    const UnhighlightTag: ElementType = unhighlight.as ?? "span";
    return (
      <UnhighlightTag
        key={chunkKey}
        className={unhighlight.className}
        style={unhighlight.style}
      >
        {chunkText}
      </UnhighlightTag>
    );
  });

  const RootTag: ElementType = Root;

  return (
    <RootTag className={className} {...rest}>
      {children}
    </RootTag>
  );
}

export default Highlighter;
