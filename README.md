# Poetic Journal
https://hasinae.github.io/poetic-journal/

Poetic Journal is a journal that writes back. You write what happened, and it weaves short lines of poetry between your paragraphs, each one chosen to match the mood of the words above it.

---

## Idea Behind the Project
The goal of this project is to blend journaling with creative writing. Poetry slipped between your own lines turns a plain record of the day into something more reflective, and sometimes it notices a feeling before you do.

---

## Features
- **Start page**: write a new entry, open your journal, import a file, or read an example entry.
- **Mood-matched poetry**: every paragraph is read for its mood (joy, sorrow, love, weariness, restlessness, hope, calm, wonder, memory) and gets a matching line. Over 100 original lines, never repeated within one entry.
- **Reroll**: don't like a line? Tap ↻ for another one in the same mood.
- **Typewriter reveal**: poems type themselves out (instantly if your device asks for reduced motion).
- **Saved locally**: entries live in your browser's storage. Nothing is sent anywhere. Drafts are saved as you type.
- **Import / export**: import a `.txt` or `.md` file as a new woven entry, export your journal as Markdown, or download a `.json` backup and restore it later.
- **Ambient music**: a soft generated pad (Web Audio, no audio files) you can switch on while writing.
- **Edit and delete**: edit an entry to reweave it, or delete it.
- Works on phones, keyboard and screen readers; follows your light or dark mode.

---

## Tools and Technologies
- **HTML, CSS, JavaScript** (ES modules, no build step, no framework)
- **Web Audio API** for the ambient music
- **localStorage** for saving entries
- **Courier Prime** (Google Fonts) for the typewriter feel

The first version used Phaser. It was replaced with plain HTML so text can be selected, read by screen readers, and laid out on any screen size.

---

## Running locally
```
npm start      # serves the site at http://localhost:8000 (needs Python)
npm test       # runs the poetry tests (needs Node 22+)
```
ES modules don't load from `file://`, so open it through the local server rather than double-clicking `index.html`.

## Project structure
- `index.html`, `style.css`: page shell and styles
- `src/app.js`: screens (start, write, entry, journal) and routing
- `src/poetry.js`: poetry lines, mood detection, and weaving
- `src/storage.js`: saving, import and export
- `src/ambient.js`: generated ambient music
- `test/`: unit tests for the poetry logic

---

## Acknowledgments
This project is inspired by the idea of integrating creativity into everyday tasks. By combining journaling and poetry, Poetic Journal aims to turn simple reflections into an artistic experience.

---

## Credits
- Hasina Esteqlal
- First version December 15, 2024; rebuilt November 2026
- Personal Project

---

## Developer to do list
- [x] store the journal locally
- [x] implement music
- [x] import files
- [x] start page to choose write or import
- [x] example entry
- [x] more poetry
- [ ] use AI to write lines from the entry itself, for a more game-like feel
- [ ] themes (paper colors, fonts)
- [ ] search and filter the journal by mood
