const wordCharacterPattern = /[\p{L}\p{N}_]/u;

function isWordCharacter(character: string | undefined): boolean {
  return character !== undefined && wordCharacterPattern.test(character);
}

/** start/end 구간이 유니코드 단어 경계에 놓여 있는지 확인합니다. */
export function isWholeWordMatch(
  text: string,
  start: number,
  end: number,
): boolean {
  return !isWordCharacter(text[start - 1]) && !isWordCharacter(text[end]);
}
