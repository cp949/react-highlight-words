# 프로젝트 아키텍처

이 문서는 프로젝트의 장기 설계 맥락을 최상위에 보존하기 위한 기준 문서다.

## 목적

`@cp949/react-highlight-words`는 텍스트 안의 검색어 매칭 구간을 React 컴포넌트,
헤드리스 훅, 순수 함수로 다룰 수 있게 하는 TypeScript 라이브러리다.

초기 버전은 외부 사용처가 없는 상태에서 시작했으므로, 초기 API의 후방 호환보다
다음 기준을 우선한다.

- 슬롯 객체와 render prop 기반의 명확한 React API
- React에 의존하지 않는 순수 매칭 코어
- `useHighlightChunks`를 통한 헤드리스 사용
- 원본 `text` 기준 인덱스를 일관되게 유지하는 타입 계약
- 단일 패키지 진입점(`@cp949/react-highlight-words`)을 통한 캡슐화

## 워크스페이스 구조

```text
.
├── demo/                         # Next.js 데모 앱
├── packages/
│   ├── react-highlight-words/     # 공개 라이브러리 패키지
│   └── typescript-config/         # 공용 tsconfig 패키지
├── ARCHITECTURE.md                # 장기 설계 문서
├── README.md                      # 워크스페이스 운영 문서
└── LICENSE
```

## 공개 API 형태

### 컴포넌트

```tsx
import { Highlighter } from "@cp949/react-highlight-words";

<Highlighter
  text="The dog and the cat."
  query={["dog", /cat/i]}
  autoEscape
  wholeWord
  active={{ index: 0, className: "is-active" }}
  highlight={{ as: "mark", className: "highlight" }}
  unhighlight={{ as: "span" }}
  as="span"
/>
```

컴포넌트는 `highlightClassName`, `highlightStyle`, `highlightTag`처럼 넓게 펼쳐진
prop 대신 객체 슬롯을 사용한다.

- `highlight`는 강조 청크를 설정한다.
- `unhighlight`는 비강조 청크를 설정한다.
- `active`는 강조 매치 인덱스 기준으로 하나의 매치를 활성 상태로 표시한다.
- `renderHighlight`와 `renderUnhighlight`는 대응하는 슬롯을 완전히 대체한다.
- `as`는 루트 wrapper를 제어하며 기본값은 `"span"`이다.

`highlight.as`에 사용자 정의 컴포넌트를 넘기면 라이브러리가 `highlightIndex`와
`isActive`를 주입한다. DOM 태그 슬롯에는 DOM에 안전한 prop만 전달한다.

### 헤드리스 훅

```ts
import { useHighlightChunks } from "@cp949/react-highlight-words";

const chunks = useHighlightChunks({
  text,
  query,
  autoEscape: true,
  wholeWord: true,
});
```

이 훅은 순수 코어를 `useMemo`로 감싼다. 반환값은 `Chunk[]`이며, 모든 `start`와
`end`는 원본 `text` 기준 인덱스다.

### 코어 함수

```ts
import {
  combineChunks,
  fillInChunks,
  findAll,
  findChunks,
} from "@cp949/react-highlight-words";
```

코어 함수는 순수 함수이며 React에 의존하지 않는다.

- `findChunks`는 원시 강조 범위를 찾는다.
- `combineChunks`는 겹치는 강조 범위를 병합한다.
- `fillInChunks`는 비강조 범위를 채운다.
- `findAll`은 전체 파이프라인을 결합한다.

## 매칭 의미

- `query`는 문자열, `RegExp`, 또는 문자열/정규식 배열을 받는다.
- 문자열 query는 `trim()` 후 빈 문자열이면 무시한다.
- 공백 자체를 검색하려면 `RegExp` query를 사용한다.
- `autoEscape`는 문자열 query에만 적용된다.
- `wholeWord`는 기본 `findChunks`가 처리하는 문자열 query에만 적용된다.
- `RegExp` query는 사용자가 작성한 패턴 의미를 유지하되, 라이브러리가 global flag와
  `caseSensitive` 동작을 반영해 정규식을 다시 만든다.
- 겹치는 query 결과는 하나의 강조 범위로 병합한다. 예를 들어 `text: "abcd"`와
  `query: ["abc", "bcd"]`는 `0..4`를 강조한다.

## 인덱스 계약

모든 공개 청크는 원본 `text` 기준 인덱스를 사용한다. 이는 컴포넌트, render prop,
훅, 코어 함수가 공유하는 핵심 불변식이다.

`sanitize`는 문자열 길이를 보존할 때만 허용된다. 기본 매처는 전처리된 text 또는 문자열
query의 길이가 바뀌면 `Error("sanitize must preserve text length")`를 던진다.
이는 sanitized 문자열 기준 인덱스를 원본 `text`에 잘못 적용하는 상황을 막기 위한
계약이다.

길이를 바꾸는 정규화, 결합 문자 제거, 음역, 토큰화는 향후 mapped-sanitize API가 생기기
전까지 사용자 정의 `findChunks`로 구현해야 한다.

## 전체 단어 경계

`wholeWord`는 비ASCII 단어에서 오동작하기 쉬운 JavaScript `\b`를 사용하지 않는다.
현재 구현은 유니코드 문자, 유니코드 숫자, `_`를 단어 구성 문자로 보고 인덱스 기반
경계 헬퍼를 사용한다.

알려진 제한: 이 헬퍼는 `\p{L}`, `\p{N}` 같은 유니코드 property escape를 사용한다.
아주 오래된 JavaScript 런타임까지 지원해야 한다면 ASCII fallback을 추가하거나 패키지
빌드 타깃을 재검토한다.

## 타입과 export 정책

- 공개 타입은 `packages/react-highlight-words/src/types.ts`에 둔다.
- `packages/react-highlight-words/src/index.ts`는 공개 facade 역할을 한다.
- 패키지는 `exports`에서 루트 export 경로(`"."`)만 노출한다.
- subpath import는 명확한 필요가 생기기 전까지 의도적으로 지원하지 않는다.
- TSDoc은 현재 한글로 작성한다. 영문 TSDoc은 향후 문서화 작업이며 호환성 차단 요소는
  아니다.

## 테스트와 검증 정책

라이브러리 테스트는 `packages/react-highlight-words/tests` 아래에 둔다.

주요 검증 대상은 다음과 같다.

- `findAll`을 통한 청크 계산
- 유니코드 `wholeWord` 동작
- `sanitize` 길이 보존 강제
- `useHighlightChunks` 재계산 동작
- `Highlighter` DOM 출력, 활성 매치, 슬롯, render prop 동작

배포 전 또는 동작 변경 후에는 아래 명령을 실행한다.

```sh
pnpm --filter @cp949/react-highlight-words test:run
pnpm --filter @cp949/react-highlight-words check-types
pnpm lint
pnpm build
pnpm release:check
```

포맷팅이나 lint 자동 수정을 적용하려면 `pnpm lint:fix`를 사용한다.
