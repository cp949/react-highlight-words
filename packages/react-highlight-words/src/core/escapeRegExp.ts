/** 정규식 메타문자를 문자 그대로 매칭되도록 이스케이프합니다. */
export function escapeRegExp(text: string): string {
  return text.replace(/[-[\]/{}()*+?.\\^$|]/g, "\\$&");
}
