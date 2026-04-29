"use client";

import {
  type Chunk,
  type FindChunksOptions,
  findAll,
  Highlighter,
} from "@cp949/react-highlight-words";
import { useMemo, useState } from "react";
import styles from "./page.module.css";

const baseText =
  "The dog is chasing the cat. Or perhaps they're just playing? Either way, the dog and the cat are friends.";

const stripCase = (text: string): string => text.toLocaleLowerCase();

const wordBoundaryFindChunks = ({ text, query }: FindChunksOptions) =>
  findAll({ text, query, wholeWord: true })
    .filter((chunk) => chunk.highlight)
    .map(({ start, end }) => ({ start, end }));

const expectedRows = [
  {
    name: "빈 query",
    chunks: findAll({ text: "abc", query: [] }),
    expected: "[{ start: 0, end: 3, highlight: false }]",
  },
  {
    name: "겹침 병합",
    chunks: findAll({ text: "abcd", query: ["abc", "bcd"] }),
    expected: "0..4 단일 강조",
  },
  {
    name: "wholeWord",
    chunks: findAll({
      text: "the theme is there",
      query: "the",
      wholeWord: true,
    }),
    expected: "첫 the 만 강조",
  },
] satisfies Array<{ name: string; chunks: Chunk[]; expected: string }>;

export default function Home() {
  const [queryText, setQueryText] = useState("dog cat");
  const [text, setText] = useState(baseText);
  const [activeMatchIndex, setActiveMatchIndex] = useState(0);
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [wholeWord, setWholeWord] = useState(false);

  const query = useMemo(
    () => queryText.split(/\s+/).filter((part) => part.trim().length > 0),
    [queryText],
  );

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <header className={styles.header}>
          <p className={styles.kicker}>@cp949/react-highlight-words</p>
          <h1 className={styles.title}>Highlighter Demo</h1>
        </header>

        <section className={styles.controls} aria-label="Interactive controls">
          <label className={styles.field}>
            <span className={styles.label}>검색어</span>
            <input
              className={styles.input}
              value={queryText}
              onChange={(event) => setQueryText(event.target.value)}
            />
          </label>

          <label className={styles.field}>
            <span className={styles.label}>Active Index</span>
            <input
              className={styles.input}
              type="number"
              value={activeMatchIndex}
              onChange={(event) => {
                const parsed = Number.parseInt(event.target.value, 10);
                setActiveMatchIndex(Number.isNaN(parsed) ? 0 : parsed);
              }}
            />
          </label>

          <label className={styles.checkbox}>
            <input
              type="checkbox"
              checked={caseSensitive}
              onChange={(event) => setCaseSensitive(event.target.checked)}
            />
            대소문자 구분
          </label>

          <label className={styles.checkbox}>
            <input
              type="checkbox"
              checked={wholeWord}
              onChange={(event) => setWholeWord(event.target.checked)}
            />
            wholeWord
          </label>
        </section>

        <label className={styles.field}>
          <span className={styles.label}>본문 텍스트</span>
          <textarea
            className={styles.textarea}
            value={text}
            onChange={(event) => setText(event.target.value)}
          />
        </label>

        <section className={styles.result} aria-label="Interactive result">
          <Highlighter
            className={styles.output}
            text={text}
            query={query}
            autoEscape
            caseSensitive={caseSensitive}
            wholeWord={wholeWord}
            active={{ index: activeMatchIndex, className: styles.active }}
            highlight={{
              as: "mark",
              className: styles.highlight,
              classNameByMatch: (match) =>
                match.toLowerCase() === "dog" ? styles.dog : undefined,
            }}
          />
        </section>

        <section className={styles.scenarios} aria-label="Scenarios">
          <h2 className={styles.sectionTitle}>Scenarios</h2>

          <Highlighter
            text="the theme is there, café cafe, test test1 hello_world"
            query={["the", "café", "test", "hello"]}
            wholeWord
            highlight={{ className: styles.highlight }}
          />

          <Highlighter
            text="Render props can wrap matches."
            query="wrap"
            renderHighlight={({ text: match }) => (
              <strong className={styles.rendered}>{match}</strong>
            )}
          />

          <Highlighter
            text="Custom finder handles whole words only."
            query="whole"
            findChunks={wordBoundaryFindChunks}
            highlight={{ className: styles.highlight }}
          />

          <Highlighter
            text="École keeps original indexes with length preserving sanitize."
            query="é"
            sanitize={stripCase}
            highlight={{ className: styles.highlight }}
          />
        </section>

        <section
          className={styles.matrix}
          aria-label="Manual expectation matrix"
        >
          <h2 className={styles.sectionTitle}>Manual Matrix</h2>
          {expectedRows.map((row) => (
            <div key={row.name} className={styles.matrixRow}>
              <strong>{row.name}</strong>
              <code>{JSON.stringify(row.chunks)}</code>
              <span>{row.expected}</span>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
