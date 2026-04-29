import type {
  ComponentPropsWithoutRef,
  CSSProperties,
  ElementType,
  ReactNode,
} from "react";

/** 강조/비강조 여부가 포함된 최종 텍스트 구간입니다. */
export type Chunk = {
  /** 원본 text 기준 시작 인덱스입니다. */
  start: number;
  /** 원본 text 기준 끝 인덱스입니다. */
  end: number;
  /** 이 구간이 강조 대상인지 여부입니다. */
  highlight: boolean;
};

/** 사용자 정의 findChunks 함수가 반환해야 하는 원시 매칭 구간입니다. */
export type FindChunk = {
  /** 원본 text 기준 시작 인덱스입니다. */
  start: number;
  /** 원본 text 기준 끝 인덱스입니다. */
  end: number;
};

/** 검색어 입력입니다. 문자열 또는 RegExp 하나, 혹은 그 배열을 받을 수 있습니다. */
export type HighlightQuery = string | RegExp | ReadonlyArray<string | RegExp>;

/** 기본 매칭 함수에 전달되는 옵션입니다. */
export type FindChunksOptions = {
  autoEscape?: boolean;
  caseSensitive?: boolean;
  wholeWord?: boolean;
  /** 비교 전 전처리 함수입니다. 원본과 다른 길이의 문자열을 반환하면 에러가 발생합니다. */
  sanitize?: (text: string) => string;
  query: HighlightQuery;
  text: string;
};

/** 전체 청크 계산 진입점 옵션입니다. */
export type FindAllOptions = FindChunksOptions & {
  findChunks?: (options: FindChunksOptions) => FindChunk[];
};

/** 강조 슬롯 설정입니다. */
export type HighlightSlot = {
  as?: ElementType;
  className?: string;
  style?: CSSProperties;
  classNameByMatch?: (text: string, chunk: Chunk) => string | undefined;
};

/** 비강조 슬롯 설정입니다. */
export type UnhighlightSlot = {
  as?: ElementType;
  className?: string;
  style?: CSSProperties;
};

/** active 상태로 표시할 강조 매치 설정입니다. */
export type HighlightActive = {
  index: number;
  className?: string;
  style?: CSSProperties;
};

/** 커스텀 highlight 슬롯 컴포넌트에 주입되는 prop입니다. */
export type HighlightSlotInjectedProps = {
  highlightIndex: number;
  isActive: boolean;
};

/** renderHighlight 함수에 전달되는 인자입니다. */
export type RenderHighlightArgs = {
  text: string;
  matchIndex: number;
  isActive: boolean;
  chunk: Chunk;
};

/** renderUnhighlight 함수에 전달되는 인자입니다. */
export type RenderUnhighlightArgs = {
  text: string;
  chunk: Chunk;
};

/** useHighlightChunks 훅 옵션입니다. */
export type UseHighlightChunksOptions = FindAllOptions;

/** Highlighter 컴포넌트 prop입니다. */
export type HighlighterProps = {
  text: string;
  query: HighlightQuery;
  autoEscape?: boolean;
  caseSensitive?: boolean;
  wholeWord?: boolean;
  /** 비교 전 전처리 함수입니다. 원본과 다른 길이의 문자열을 반환하면 에러가 발생합니다. */
  sanitize?: (text: string) => string;
  findChunks?: (options: FindChunksOptions) => FindChunk[];
  active?: HighlightActive;
  highlight?: HighlightSlot;
  unhighlight?: UnhighlightSlot;
  renderHighlight?: (args: RenderHighlightArgs) => ReactNode;
  renderUnhighlight?: (args: RenderUnhighlightArgs) => ReactNode;
  as?: ElementType;
  className?: string;
} & Omit<ComponentPropsWithoutRef<"span">, "children" | "className">;
