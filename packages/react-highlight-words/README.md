# @cp949/react-highlight-words

텍스트 안의 검색어 매칭 구간을 강조하는 React 컴포넌트와 헤드리스 유틸리티입니다.

## 설치

```sh
pnpm add @cp949/react-highlight-words
npm i @cp949/react-highlight-words
```

## 사용법

`Highlighter` 컴포넌트를 쓰면 텍스트를 직접 쪼개지 않고도 매칭된 부분을 `<mark>`로 렌더링할 수 있습니다.

```tsx
import { Highlighter } from "@cp949/react-highlight-words";

export function Demo() {
  return (
    <Highlighter
      text="The dog is chasing the cat."
      query={["dog", "cat"]}
      autoEscape
      wholeWord
      highlight={{ as: "mark", className: "highlight" }}
      active={{ index: 0, className: "active" }}
    />
  );
}
```

문자열 query 는 기본적으로 대소문자를 구분하지 않습니다. 정규식 메타문자를 검색어 그대로 다루려면 `autoEscape`, 단어 단위 매칭만 원하면 `wholeWord`를 켭니다.

## 마킹 스타일 바꾸기

강조된 부분은 기본적으로 `<mark>` 태그로 렌더링됩니다. `highlight` 슬롯에 `className`이나 `style`을 넘기면 마킹된 부분의 스타일을 바꿀 수 있습니다.

```tsx
import { Highlighter } from "@cp949/react-highlight-words";
import "./highlight.css";

export function StyledHighlight() {
  return (
    <Highlighter
      text="React makes search results easier to scan."
      query="search results"
      highlight={{ className: "search-hit" }}
    />
  );
}
```

```css
.search-hit {
  background: #fff2a8;
  border-radius: 4px;
  color: #1f2937;
  font-weight: 700;
  padding: 0 2px;
}
```

빠르게 한 곳에서만 조정하려면 인라인 스타일도 사용할 수 있습니다.

```tsx
<Highlighter
  text="The dog is chasing the cat."
  query={["dog", "cat"]}
  highlight={{
    style: {
      backgroundColor: "#dbeafe",
      color: "#1e3a8a",
      fontWeight: 700,
    },
  }}
/>
```

현재 선택된 매치를 따로 표시해야 한다면 `active`를 함께 사용합니다. `active.index`는 강조된 매치만 세는 0부터 시작하는 인덱스입니다.

```tsx
<Highlighter
  text="cat, dog, cat"
  query="cat"
  highlight={{ className: "hit" }}
  active={{ index: 1, className: "hit-active" }}
/>
```

매칭된 텍스트마다 다른 클래스를 적용하려면 `classNameByMatch`를 사용합니다.

```tsx
<Highlighter
  text="error warning success"
  query={["error", "warning", "success"]}
  highlight={{
    className: "hit",
    classNameByMatch: (text) => `hit-${text}`,
  }}
/>
```

`highlight.as`로 강조 태그 자체를 바꿀 수도 있습니다.

```tsx
<Highlighter
  text="Important message"
  query="Important"
  highlight={{ as: "strong", className: "important-hit" }}
/>
```

## 훅으로 직접 렌더링하기

마크업을 완전히 직접 제어해야 한다면 `useHighlightChunks` 훅을 사용합니다. 훅은 원본 `text` 기준의 `{ start, end, highlight }` 청크 배열을 반환합니다.

```tsx
import { useHighlightChunks } from "@cp949/react-highlight-words";

function CustomHighlight({ text, query }: { text: string; query: string }) {
  const chunks = useHighlightChunks({ text, query, autoEscape: true });

  return chunks.map((chunk) => (
    <span key={`${chunk.start}-${chunk.end}`} data-highlight={chunk.highlight}>
      {text.substring(chunk.start, chunk.end)}
    </span>
  ));
}
```

예를 들어 디자인 시스템 컴포넌트와 직접 조합하려면 강조 청크만 원하는 컴포넌트로 감싸면 됩니다.

```tsx
import { useHighlightChunks } from "@cp949/react-highlight-words";

function SearchSnippet({ text, query }: { text: string; query: string }) {
  const chunks = useHighlightChunks({ text, query, autoEscape: true });

  return (
    <p>
      {chunks.map((chunk) => {
        const value = text.slice(chunk.start, chunk.end);

        return chunk.highlight ? (
          <span className="snippet-hit" key={`${chunk.start}-${chunk.end}`}>
            {value}
          </span>
        ) : (
          <span key={`${chunk.start}-${chunk.end}`}>{value}</span>
        );
      })}
    </p>
  );
}
```

## Props

| Prop | Type | 필수 | 설명 |
| --- | --- | :---: | --- |
| `text` | `string` | ✓ | 강조 대상 원본 텍스트 |
| `query` | `string \| RegExp \| ReadonlyArray<string \| RegExp>` | ✓ | 검색어. 문자열 query 는 trim 후 빈 값이면 무시 |
| `autoEscape` | `boolean` | | 문자열 query 의 정규식 메타문자 이스케이프 |
| `caseSensitive` | `boolean` | | 대소문자 구분 검색 여부. 기본 `false` |
| `wholeWord` | `boolean` | | 유니코드 단어 경계 기준으로 전체 단어만 매칭 |
| `sanitize` | `(text: string) => string` | | 비교 전 전처리. 원본과 다른 길이를 반환하면 에러 발생 |
| `findChunks` | `(options: FindChunksOptions) => FindChunk[]` | | 사용자 정의 매칭 함수 |
| `active` | `{ index: number; className?: string; style?: CSSProperties }` | | 특정 강조 매치 활성화 |
| `highlight` | `{ as?; className?; style?; classNameByMatch? }` | | 강조 슬롯 설정 |
| `unhighlight` | `{ as?; className?; style? }` | | 비강조 슬롯 설정 |
| `renderHighlight` | `(args: RenderHighlightArgs) => ReactNode` | | 강조 구간 완전 커스텀 렌더링 |
| `renderUnhighlight` | `(args: RenderUnhighlightArgs) => ReactNode` | | 비강조 구간 완전 커스텀 렌더링 |
| `as` | `ElementType` | | 외곽 wrapper. 기본 `"span"` |
| `className` | `string` | | 외곽 wrapper className |

## 코어 함수

```ts
import {
  combineChunks,
  fillInChunks,
  findAll,
  findChunks,
} from "@cp949/react-highlight-words";
```

## 라이선스

MIT
