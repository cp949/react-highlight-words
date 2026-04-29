export { Highlighter } from "./components/Highlighter";
export {
  combineChunks,
  fillInChunks,
  findAll,
  findChunks,
} from "./core";
export { useHighlightChunks } from "./hooks/useHighlightChunks";

export type {
  Chunk,
  FindAllOptions,
  FindChunk,
  FindChunksOptions,
  HighlightActive,
  HighlighterProps,
  HighlightQuery,
  HighlightSlot,
  HighlightSlotInjectedProps,
  RenderHighlightArgs,
  RenderUnhighlightArgs,
  UnhighlightSlot,
  UseHighlightChunksOptions,
} from "./types";
