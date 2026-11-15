// Entries are saved in this browser's localStorage. Nothing leaves the device.

const KEY = "poetic-journal:entries:v1";

let available = true;
let memory = [];

function readRaw() {
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    available = false;
    return memory;
  }
}

function writeRaw(entries) {
  memory = entries;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(entries));
    available = true;
  } catch {
    available = false;
  }
}

/** False when the browser blocks storage (private mode, full disk). */
export function storageAvailable() {
  readRaw();
  return available;
}

function isEntry(value) {
  return (
    value &&
    typeof value.id === "string" &&
    typeof value.createdAt === "string" &&
    typeof value.body === "string" &&
    Array.isArray(value.parts)
  );
}

/** All entries, newest first. */
export function listEntries() {
  return readRaw()
    .filter(isEntry)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function getEntry(id) {
  return listEntries().find((entry) => entry.id === id) ?? null;
}

export function saveEntry(entry) {
  const entries = readRaw().filter((e) => e.id !== entry.id);
  entries.push(entry);
  writeRaw(entries);
}

export function deleteEntry(id) {
  writeRaw(readRaw().filter((e) => e.id !== id));
}

export function newId() {
  if (window.crypto?.randomUUID) return window.crypto.randomUUID();
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

/** A full backup that `importBackup` can restore. */
export function exportBackup() {
  return JSON.stringify({ app: "poetic-journal", version: 1, entries: listEntries() }, null, 2);
}

/** Merge a backup into the journal. Existing entries with the same id are kept. Returns the count added. */
export function importBackup(text) {
  const data = JSON.parse(text);
  const incoming = Array.isArray(data) ? data : data?.entries;
  if (!Array.isArray(incoming)) throw new Error("This file is not a Poetic Journal backup.");
  const entries = readRaw();
  const ids = new Set(entries.map((e) => e.id));
  let added = 0;
  for (const entry of incoming) {
    if (isEntry(entry) && !ids.has(entry.id)) {
      entries.push(entry);
      ids.add(entry.id);
      added += 1;
    }
  }
  writeRaw(entries);
  return added;
}

/** The whole journal as readable Markdown, poems in italics. */
export function exportMarkdown() {
  const lines = ["# Poetic Journal", ""];
  for (const entry of listEntries()) {
    lines.push(`## ${entry.title || formatDate(entry.createdAt)}`, "");
    if (entry.title) lines.push(`_${formatDate(entry.createdAt)}_`, "");
    for (const part of entry.parts) {
      lines.push(part.kind === "poem" ? `> *${part.text}*` : part.text, "");
    }
  }
  return lines.join("\n");
}

export function formatDate(iso) {
  return new Date(iso).toLocaleString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  });
}
