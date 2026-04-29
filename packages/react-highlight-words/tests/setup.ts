/**
 * Vitest globals를 비활성화한 환경에서 React Testing Library의 자동 cleanup을 보장한다.
 */
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

afterEach(() => {
  cleanup();
});
