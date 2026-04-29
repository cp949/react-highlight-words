# @cp949/react-highlight-words

텍스트 안의 검색어 매칭 구간을 강조하는 React 컴포넌트와 헤드리스 유틸리티입니다.

## 설치

```sh
pnpm add @cp949/react-highlight-words
npm i @cp949/react-highlight-words
```

## 사용법

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

## 헤드리스 사용법

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
