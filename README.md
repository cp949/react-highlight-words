# @cp949/react-highlight-words

[`@cp949/react-highlight-words`](./packages/react-highlight-words) 패키지를 관리하는 모노레포입니다.

GitHub: <https://github.com/cp949/react-highlight-words.git>

## 문서

장기적으로 유지할 프로젝트 맥락은 최상위 문서에 둡니다.

- [`README.md`](./README.md): 워크스페이스 설정, 스크립트, 검증, 배포
- [`ARCHITECTURE.md`](./ARCHITECTURE.md): 공개 API 형태, 매칭 의미, 인덱스 계약, 알려진 제한
- [`LICENSE`](./LICENSE): MIT 라이선스

## 워크스페이스

- [`packages/react-highlight-words`](./packages/react-highlight-words): 라이브러리 본체
- [`packages/typescript-config`](./packages/typescript-config): 공용 TypeScript 설정
- [`demo`](./demo): Next.js 데모 앱

## 요구 사항

- Node.js `>=20.19.0`
- pnpm `10.33.2`

## 스크립트

```sh
pnpm install
pnpm dev          # 데모 앱 개발 서버 + 라이브러리 watch
pnpm build        # 모든 워크스페이스 빌드
pnpm lint:fix     # biome 린트 + 포맷 자동 수정/체크
pnpm check-types  # 전체 워크스페이스 tsc --noEmit
pnpm --filter @cp949/react-highlight-words test:run  # 라이브러리 테스트 실행
pnpm format       # biome 포맷 적용
pnpm release:check # lint/type/test/build/npm pack dry-run
```

## 테스트와 검증

라이브러리 테스트는 Vitest 기반이며, 소스 코드와 분리해 [`packages/react-highlight-words/tests`](./packages/react-highlight-words/tests) 아래에 둡니다. 테스트 제목과 테스트 주석은 한국어로 작성하고, 요구사항을 드러내는 문장으로 유지합니다.

주요 검증 대상은 다음과 같습니다.

- `findAll`, `findChunks` 기반의 강조 청크 계산
- 유니코드 단어 경계를 사용하는 `wholeWord` 동작
- `useHighlightChunks` 훅의 초기 계산과 입력 변경 재계산
- `Highlighter` 컴포넌트의 기본 DOM prop, 활성 강조, 슬롯/render prop 동작

변경 후에는 아래 명령을 기준으로 확인합니다.

```sh
pnpm --filter @cp949/react-highlight-words test:run
pnpm --filter @cp949/react-highlight-words check-types
pnpm lint:fix
pnpm build
pnpm audit
```

2026-04-30 기준 `pnpm audit` 결과 알려진 취약점이 0건임을 확인했습니다.

## 라이브러리 사용

컴포넌트, 훅, 마킹 스타일 변경 예제는 [packages/react-highlight-words/README.md](./packages/react-highlight-words/README.md) 에서 확인할 수 있습니다.

## 배포

배포 전에는 아래 명령으로 릴리스 검증을 실행합니다.

```sh
pnpm release:check
```

npm 로그인과 실제 배포 권한 확인 후에는 아래 명령으로 공개 scoped package 를 배포합니다.

```sh
pnpm publish:npm
```

위 명령은 실제 npm publish 를 실행하므로, npm 로그인과 `@cp949` scope 권한 확인을 먼저 마친 뒤 사용합니다.
