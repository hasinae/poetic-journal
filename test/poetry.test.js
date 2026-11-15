import { test } from "node:test";
import assert from "node:assert/strict";
import { POEMS, MOODS, detectMood, splitIntoChunks, weave, rerollLine } from "../src/poetry.js";

// Deterministic stand-in for Math.random.
function seeded(seed = 1) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

test("every mood has at least 12 distinct lines", () => {
  for (const mood of MOODS) {
    assert.ok(POEMS[mood].length >= 12, mood);
    assert.equal(new Set(POEMS[mood]).size, POEMS[mood].length, `${mood} has duplicates`);
  }
});

test("no line appears under two moods", () => {
  const all = MOODS.flatMap((m) => POEMS[m]);
  assert.equal(new Set(all).size, all.length);
});

test("detectMood picks the obvious mood", () => {
  assert.equal(detectMood("I was so happy today, we laughed all night"), "joy");
  assert.equal(detectMood("I cried. I miss her and feel lonely"), "sorrow");
  assert.equal(detectMood("So tired and exhausted, I need sleep"), "weary");
  assert.equal(detectMood("Stressed and anxious about the exam deadline"), "restless");
  assert.equal(detectMood("The moon and the stars over the ocean"), "wonder");
  assert.equal(detectMood("I remember my childhood, years ago"), "memory");
});

test("detectMood returns null when nothing matches", () => {
  assert.equal(detectMood("Bought a stapler."), null);
  assert.equal(detectMood(""), null);
});

test("paragraphs separated by blank lines become chunks", () => {
  assert.deepEqual(splitIntoChunks("One.\n\nTwo.\r\n\r\nThree."), ["One.", "Two.", "Three."]);
});

test("a single long paragraph splits into pairs of sentences", () => {
  assert.deepEqual(splitIntoChunks("A one. B two! C three? D four."), ["A one. B two!", "C three? D four."]);
});

test("short single paragraphs stay whole", () => {
  assert.deepEqual(splitIntoChunks("Just one line"), ["Just one line"]);
  assert.deepEqual(splitIntoChunks("One. Two."), ["One. Two."]);
});

test("weave puts a poem after every chunk when there are few chunks", () => {
  const { parts } = weave("Happy day.\n\nSad night.\n\nTired now.", seeded());
  assert.deepEqual(
    parts.map((p) => p.kind),
    ["text", "poem", "text", "poem", "text", "poem"]
  );
  assert.equal(parts[1].mood, "joy");
  assert.equal(parts[3].mood, "sorrow");
  assert.equal(parts[5].mood, "weary");
});

test("weave caps poems at six and always ends on a poem", () => {
  const body = Array.from({ length: 15 }, (_, i) => `Paragraph ${i}.`).join("\n\n");
  const { parts } = weave(body, seeded(7));
  assert.equal(parts.filter((p) => p.kind === "poem").length, 6);
  assert.equal(parts.at(-1).kind, "poem");
  assert.equal(parts.filter((p) => p.kind === "text").length, 15);
});

test("weave never repeats a line inside one entry", () => {
  const body = Array.from({ length: 6 }, () => "So happy, laughing, great fun.").join("\n\n");
  const { parts } = weave(body, seeded(3));
  const lines = parts.filter((p) => p.kind === "poem").map((p) => p.text);
  assert.equal(new Set(lines).size, lines.length);
});

test("weave keeps every word the writer wrote", () => {
  const body = "First thought here.\n\nSecond thought, longer.";
  const text = weave(body, seeded()).parts.filter((p) => p.kind === "text").map((p) => p.text);
  assert.deepEqual(text, ["First thought here.", "Second thought, longer."]);
});

test("rerollLine returns a different line of the same mood", () => {
  const { parts } = weave("So happy today.", seeded());
  const index = parts.findIndex((p) => p.kind === "poem");
  const next = rerollLine(parts, index, seeded(9));
  assert.notEqual(next, parts[index].text);
  assert.ok(POEMS.joy.includes(next));
});
