import { weave, rerollLine, MOOD_LABELS } from "./poetry.js";
import {
  listEntries,
  getEntry,
  saveEntry,
  deleteEntry,
  newId,
  exportBackup,
  importBackup,
  exportMarkdown,
  formatDate,
  storageAvailable
} from "./storage.js";
import { startAmbient, stopAmbient, isAmbientPlaying } from "./ambient.js";

const app = document.getElementById("app");
const fileInput = document.getElementById("fileInput");
const ambientButton = document.getElementById("ambientButton");
const DRAFT_KEY = "poetic-journal:draft:v1";

const EXAMPLE_BODY = `Woke up before the alarm and watched the light come in sideways through the blinds. Made tea and actually drank it while it was hot, which never happens.

Work was a lot. Three meetings that could have been emails and a deadline that moved closer instead of further. I felt my shoulders creeping up toward my ears by noon.

Called my sister on the walk home. We laughed about the time we got lost looking for the beach and ended up at a parking lot with one sad palm tree. I miss her.

Tomorrow I want to start the painting I keep thinking about. Even just the first layer.`;

let typingToken = 0;
let toastTimer = null;

// ---------- small DOM helpers ----------

function el(tag, attrs = {}, ...children) {
  const node = document.createElement(tag);
  for (const [key, value] of Object.entries(attrs)) {
    if (value === undefined || value === null || value === false) continue;
    if (key.startsWith("on")) node.addEventListener(key.slice(2).toLowerCase(), value);
    else if (key === "class") node.className = value;
    else node.setAttribute(key, value === true ? "" : value);
  }
  for (const child of children.flat()) {
    if (child === null || child === undefined || child === false) continue;
    node.append(child instanceof Node ? child : document.createTextNode(String(child)));
  }
  return node;
}

function link(href, label, className = "button") {
  return el("a", { href, class: className }, label);
}

function render(...nodes) {
  typingToken += 1;
  app.replaceChildren(...nodes);
  window.scrollTo(0, 0);
  const heading = app.querySelector("h1, h2");
  if (heading) {
    heading.setAttribute("tabindex", "-1");
    heading.focus({ preventScroll: true });
  }
}

function toast(message) {
  const region = document.getElementById("toast");
  region.textContent = message;
  region.classList.add("show");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => region.classList.remove("show"), 3200);
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function draft(value) {
  try {
    if (value === undefined) return JSON.parse(window.localStorage.getItem(DRAFT_KEY) ?? "null");
    if (value === null) window.localStorage.removeItem(DRAFT_KEY);
    else window.localStorage.setItem(DRAFT_KEY, JSON.stringify(value));
  } catch {
    return null;
  }
  return null;
}

function download(filename, text, type) {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const a = el("a", { href: url, download: filename });
  document.body.append(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

// ---------- typewriter ----------

/** Types each poem line in order. Screen readers get the full line immediately. */
async function typePoems(container) {
  const token = typingToken;
  const lines = [...container.querySelectorAll("[data-type]")];
  if (prefersReducedMotion()) {
    for (const line of lines) line.textContent = line.dataset.type;
    return;
  }
  for (const line of lines) {
    const text = line.dataset.type;
    line.textContent = "";
    line.classList.add("typing");
    for (let i = 1; i <= text.length; i++) {
      if (token !== typingToken) return;
      line.textContent = text.slice(0, i);
      await new Promise((resolve) => window.setTimeout(resolve, 32));
    }
    line.classList.remove("typing");
    await new Promise((resolve) => window.setTimeout(resolve, 250));
  }
}

function poemLine(text) {
  return el(
    "span",
    {},
    el("span", { class: "sr-only" }, text),
    el("span", { "aria-hidden": "true", "data-type": text })
  );
}

// ---------- views ----------

function homeView() {
  const count = listEntries().length;
  const hasDraft = Boolean(draft()?.body?.trim());
  const title = el("h1", { class: "title" }, poemLine("Poetic Journal"));
  render(
    el(
      "section",
      { class: "home" },
      title,
      el("p", { class: "lede" }, "Write what happened. Poetry fills in the spaces between your lines."),
      el(
        "div",
        { class: "menu" },
        link("#/write", hasDraft ? "Continue writing" : "Write an entry", "button primary"),
        link("#/journal", count ? `Your journal (${count})` : "Your journal"),
        el("button", { type: "button", class: "button", onClick: () => fileInput.click() }, "Import a file"),
        link("#/example", "Read an example", "button quiet")
      ),
      storageAvailable()
        ? el("p", { class: "fine" }, "Entries are saved in this browser only. Export a backup from your journal to keep them safe.")
        : el("p", { class: "fine warn" }, "This browser is blocking storage, so entries will disappear when you close the tab. Export before you leave.")
    )
  );
  typePoems(title);
}

function writeView(existingId) {
  const existing = existingId ? getEntry(existingId) : null;
  if (existingId && !existing) return notFoundView();
  const saved = existing ? null : draft();

  const titleInput = el("input", {
    id: "entryTitle",
    type: "text",
    class: "field",
    maxlength: "120",
    autocomplete: "off",
    placeholder: "Untitled"
  });
  titleInput.value = existing?.title ?? saved?.title ?? "";

  const bodyInput = el("textarea", {
    id: "entryBody",
    class: "field body",
    rows: "10",
    placeholder: "What happened today?\n\nLeave a blank line between thoughts and a poem will slip in between."
  });
  bodyInput.value = existing?.body ?? saved?.body ?? "";

  const counter = el("span", { class: "fine", "aria-live": "polite" });
  const updateCounter = () => {
    const words = bodyInput.value.trim() ? bodyInput.value.trim().split(/\s+/).length : 0;
    counter.textContent = words === 1 ? "1 word" : `${words} words`;
  };
  const grow = () => {
    bodyInput.style.height = "auto";
    bodyInput.style.height = `${Math.max(bodyInput.scrollHeight, 240)}px`;
  };
  const persistDraft = () => {
    if (!existing) draft({ title: titleInput.value, body: bodyInput.value });
  };

  const save = () => {
    const body = bodyInput.value.trim();
    if (!body) {
      toast("Write a few words first.");
      bodyInput.focus();
      return;
    }
    const woven = weave(body);
    const entry = {
      id: existing?.id ?? newId(),
      createdAt: existing?.createdAt ?? new Date().toISOString(),
      updatedAt: existing ? new Date().toISOString() : undefined,
      title: titleInput.value.trim(),
      body,
      mood: woven.mood,
      parts: woven.parts
    };
    saveEntry(entry);
    if (!existing) draft(null);
    window.location.hash = `#/entry/${entry.id}`;
  };

  bodyInput.addEventListener("input", () => {
    updateCounter();
    grow();
    persistDraft();
  });
  titleInput.addEventListener("input", persistDraft);
  bodyInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      save();
    }
  });

  render(
    el(
      "section",
      { class: "write" },
      el("h2", {}, existing ? "Edit entry" : "New entry"),
      el("p", { class: "fine" }, existing ? formatDate(existing.createdAt) : formatDate(new Date().toISOString())),
      el("label", { for: "entryTitle", class: "label" }, "Title (optional)"),
      titleInput,
      el("label", { for: "entryBody", class: "label" }, "Entry"),
      bodyInput,
      el(
        "div",
        { class: "actions" },
        counter,
        el("span", { class: "fine hint" }, "Ctrl or Cmd + Enter to save"),
        link(existing ? `#/entry/${existing.id}` : "#/", "Cancel", "button quiet"),
        el("button", { type: "button", class: "button primary", onClick: save }, existing ? "Save and reweave" : "Weave it")
      )
    )
  );
  updateCounter();
  grow();
  bodyInput.focus();
}

function entryBody(entry, { onReroll } = {}) {
  return el(
    "div",
    { class: "page" },
    entry.parts.map((part, index) => {
      if (part.kind === "text") return el("p", { class: "line" }, part.text);
      return el(
        "p",
        { class: "poem" },
        poemLine(part.text),
        onReroll &&
          el(
            "button",
            {
              type: "button",
              class: "reroll",
              title: "Another line",
              "aria-label": `Replace the line "${part.text}"`,
              onClick: () => onReroll(index)
            },
            "↻"
          )
      );
    })
  );
}

function entryView(id) {
  const entry = getEntry(id);
  if (!entry) return notFoundView();

  // One child of the page per part, so a part index is also a child index.
  const page = el("div");
  const onReroll = (index) => {
    entry.parts[index] = { ...entry.parts[index], text: rerollLine(entry.parts, index) };
    saveEntry(entry);
    typingToken += 1;
    const fresh = entryBody(entry, { onReroll });
    for (const span of fresh.querySelectorAll("[data-type]")) span.textContent = span.dataset.type;
    const poem = fresh.children[index];
    const target = poem.querySelector("[data-type]");
    target.textContent = "";
    page.replaceChildren(fresh);
    poem.querySelector(".reroll").focus();
    typeSingle(target);
  };
  page.append(entryBody(entry, { onReroll }));

  let confirming = false;
  const deleteButton = el("button", { type: "button", class: "button quiet danger" }, "Delete");
  deleteButton.addEventListener("click", () => {
    if (!confirming) {
      confirming = true;
      deleteButton.textContent = "Tap again to delete";
      window.setTimeout(() => {
        confirming = false;
        deleteButton.textContent = "Delete";
      }, 4000);
      return;
    }
    deleteEntry(entry.id);
    toast("Entry deleted.");
    window.location.hash = "#/journal";
  });

  render(
    el(
      "article",
      { class: "entry" },
      el("h2", {}, entry.title || "Untitled"),
      el(
        "p",
        { class: "fine" },
        formatDate(entry.createdAt),
        " · ",
        el("span", { class: "mood" }, MOOD_LABELS[entry.mood] ?? entry.mood)
      ),
      page,
      el(
        "div",
        { class: "actions" },
        link("#/journal", "Journal", "button quiet"),
        link(`#/edit/${entry.id}`, "Edit", "button quiet"),
        deleteButton,
        link("#/write", "Write another", "button primary")
      )
    )
  );
  typePoems(page);
}

async function typeSingle(target) {
  const token = typingToken;
  const text = target.dataset.type;
  if (prefersReducedMotion()) {
    target.textContent = text;
    return;
  }
  target.classList.add("typing");
  for (let i = 1; i <= text.length; i++) {
    if (token !== typingToken) {
      if (target.isConnected) target.textContent = text;
      break;
    }
    target.textContent = text.slice(0, i);
    await new Promise((resolve) => window.setTimeout(resolve, 32));
  }
  target.classList.remove("typing");
}

function exampleView() {
  const woven = weave(EXAMPLE_BODY);
  const entry = { title: "A Tuesday, more or less", createdAt: new Date().toISOString(), mood: woven.mood, parts: woven.parts };
  const page = entryBody(entry);
  render(
    el(
      "article",
      { class: "entry" },
      el("p", { class: "eyebrow" }, "Example entry, not saved"),
      el("h2", {}, entry.title),
      el("p", { class: "fine" }, "Each poem is chosen to match the paragraph above it. Reload for different lines."),
      page,
      el(
        "div",
        { class: "actions" },
        link("#/", "Back", "button quiet"),
        link("#/write", "Write your own", "button primary")
      )
    )
  );
  typePoems(page);
}

function journalView() {
  const entries = listEntries();
  const list = entries.length
    ? el(
        "ol",
        { class: "list" },
        entries.map((entry) =>
          el(
            "li",
            {},
            el(
              "a",
              { href: `#/entry/${entry.id}`, class: "row" },
              el("span", { class: "row-title" }, entry.title || firstLine(entry.body)),
              el(
                "span",
                { class: "fine" },
                new Date(entry.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }),
                " · ",
                MOOD_LABELS[entry.mood] ?? entry.mood
              )
            )
          )
        )
      )
    : el(
        "div",
        { class: "empty" },
        el("p", {}, "No entries yet. The first page is always the hardest and the best."),
        link("#/write", "Write an entry", "button primary")
      );

  render(
    el(
      "section",
      { class: "journal" },
      el("h2", {}, "Your journal"),
      list,
      el(
        "div",
        { class: "actions tools" },
        el("button", { type: "button", class: "button quiet", onClick: () => fileInput.click() }, "Import"),
        el(
          "button",
          {
            type: "button",
            class: "button quiet",
            disabled: !entries.length,
            onClick: () => download(`poetic-journal-${today()}.md`, exportMarkdown(), "text/markdown")
          },
          "Export as Markdown"
        ),
        el(
          "button",
          {
            type: "button",
            class: "button quiet",
            disabled: !entries.length,
            onClick: () => download(`poetic-journal-backup-${today()}.json`, exportBackup(), "application/json")
          },
          "Download backup"
        )
      ),
      el("p", { class: "fine" }, "Import a .txt or .md file to weave it into a new entry, or a backup .json to restore your journal.")
    )
  );
}

function notFoundView() {
  render(
    el(
      "section",
      { class: "home" },
      el("h2", {}, "This page is blank"),
      el("p", { class: "lede" }, "That entry may have been deleted, or it lives in a different browser."),
      el("div", { class: "menu" }, link("#/journal", "Your journal", "button primary"))
    )
  );
}

function firstLine(body) {
  const line = body.split("\n")[0].trim();
  return line.length > 60 ? `${line.slice(0, 57).trimEnd()}...` : line;
}

// ---------- import ----------

fileInput.addEventListener("change", async () => {
  const file = fileInput.files?.[0];
  fileInput.value = "";
  if (!file) return;
  try {
    const text = await file.text();
    if (file.name.toLowerCase().endsWith(".json")) {
      const added = importBackup(text);
      toast(added === 1 ? "Restored 1 entry." : `Restored ${added} entries.`);
      window.location.hash = "#/journal";
      if (window.location.hash === "#/journal") journalView();
      return;
    }
    const body = text.trim();
    if (!body) {
      toast("That file is empty.");
      return;
    }
    const woven = weave(body);
    const entry = {
      id: newId(),
      createdAt: new Date(file.lastModified || Date.now()).toISOString(),
      title: file.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ").trim(),
      body,
      mood: woven.mood,
      parts: woven.parts
    };
    saveEntry(entry);
    toast("Imported and woven.");
    window.location.hash = `#/entry/${entry.id}`;
  } catch (error) {
    toast(error instanceof SyntaxError ? "That .json file could not be read." : error.message || "Could not import that file.");
  }
});

// ---------- ambient ----------

function syncAmbientButton() {
  const on = isAmbientPlaying();
  ambientButton.setAttribute("aria-pressed", String(on));
  ambientButton.textContent = on ? "♪ Music on" : "♪ Music off";
}

ambientButton.addEventListener("click", () => {
  if (isAmbientPlaying()) stopAmbient();
  else if (!startAmbient()) toast("This browser cannot play the ambient music.");
  syncAmbientButton();
});

// ---------- router ----------

function route() {
  const [, view, id] = (window.location.hash || "#/").split("/");
  for (const navLink of document.querySelectorAll("[data-nav]")) {
    navLink.toggleAttribute("aria-current", navLink.dataset.nav === (view || "home"));
    if (navLink.hasAttribute("aria-current")) navLink.setAttribute("aria-current", "page");
  }
  switch (view) {
    case "write":
      return writeView();
    case "edit":
      return writeView(decodeURIComponent(id ?? ""));
    case "entry":
      return entryView(decodeURIComponent(id ?? ""));
    case "journal":
      return journalView();
    case "example":
      return exampleView();
    default:
      return homeView();
  }
}

window.addEventListener("hashchange", route);
syncAmbientButton();
route();
