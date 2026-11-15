// Poetry lines, grouped by mood, and the logic that weaves them into an entry.
// Every line here is original to Poetic Journal.

export const POEMS = {
  joy: [
    "Even the kettle sang along today.",
    "Light spilled over the rim of the hour.",
    "Laughter is a window someone left open.",
    "The day wore its brightest coat for you.",
    "Somewhere a sparrow is bragging about this.",
    "Joy arrives without knocking and stays for tea.",
    "The sun kept its promise, and then some.",
    "Your smile wrote itself into the margins.",
    "Small gladness, folded like a paper boat.",
    "The air tasted like the first page of summer.",
    "Happiness hums in a key only you can hear.",
    "A good day is a song you keep humming for weeks."
  ],
  sorrow: [
    "Rain is just the sky remembering out loud.",
    "Grief is love with nowhere left to go.",
    "Even the river carries what it cannot keep.",
    "Some days the heart walks slower than the clock.",
    "The ache is proof that something mattered.",
    "Tears are the ink of things too heavy for words.",
    "The moon has known dark halves and still returns.",
    "Let the sadness sit; it will stand up on its own.",
    "Winter is not the end of the tree.",
    "A quiet room can hold a very loud absence.",
    "You are allowed to be a cloud for a while.",
    "Every bruise is a map of where you were brave."
  ],
  love: [
    "Two cups on the table, still warm.",
    "Love is a lamp left on in another room.",
    "Your name is a word my pulse already knows.",
    "Some people feel like coming home in the rain.",
    "Tenderness is the bravest kind of strength.",
    "The heart keeps a drawer of other people's laughter.",
    "Love lives in the small hours and the small things.",
    "Hands remember what the mind forgets.",
    "To be known is to be held without arms.",
    "Every kindness is a letter with no return address.",
    "We orbit the ones who make the dark feel softer.",
    "Love is the thread; the days are only beads."
  ],
  weary: [
    "Even the stars take turns resting behind clouds.",
    "Rest is not quitting; it is how the tide returns.",
    "Your bones are asking for a softer song.",
    "Let the pillow hold what the day could not.",
    "The candle burns brighter after the wick is trimmed.",
    "Tired is just the body whispering thank you.",
    "Lay the hours down like coats on a chair.",
    "Sleep is a ferry; let it carry you across.",
    "You do not have to finish the whole sky tonight.",
    "The field lies fallow so it can bloom again.",
    "Slow is still a direction.",
    "Close the book; the story will wait for morning."
  ],
  restless: [
    "Storms are only the sky learning to breathe.",
    "Anger is a fire asking what it should protect.",
    "Breathe in for four; the world can wait for four.",
    "The sea is never still, and still it is the sea.",
    "Worry builds tall towers out of fog.",
    "Not every thunder needs an answer.",
    "Put the heavy thought down; it is not yours to carry all night.",
    "Your racing heart is a horse that wants a field.",
    "The knot loosens when you stop pulling both ends.",
    "Even a hurricane has a calm and open eye.",
    "Fear is loud, but it has never been right about everything.",
    "Let the wind blow through instead of against."
  ],
  hope: [
    "Every seed is a small rebellion against the dark.",
    "Dawn does not ask permission from the night.",
    "Tomorrow is a blank page that already likes you.",
    "The first green shoot breaks the hardest ground.",
    "Hope is a bird that nests in unlikely places.",
    "You are a sentence still being written.",
    "Doors open from the inside, too.",
    "The horizon keeps moving so you keep walking.",
    "Plant the tree; let someone else enjoy the shade.",
    "There is a version of you that is grateful you kept going.",
    "Light finds the crack every single time.",
    "Begin again; the morning always does."
  ],
  calm: [
    "Steam curls from the cup like a slow thought.",
    "The lake keeps every reflection without holding on.",
    "Quiet is a room with all the windows open.",
    "Breath in, breath out, the oldest lullaby.",
    "The afternoon moved like honey off a spoon.",
    "Stillness is not empty; it is full of listening.",
    "The cat knows exactly how to spend a sunbeam.",
    "Some moments ask only to be noticed.",
    "A soft day, folded neatly at the edges.",
    "The garden grows without hurrying.",
    "Peace is a pause between two kind words.",
    "Let the clock tick; you do not have to answer it."
  ],
  wonder: [
    "The stars whisper secrets to the night sky.",
    "Each raindrop holds a world of its own.",
    "The wind carries dreams untold.",
    "Time dances silently in the moonlight.",
    "A heartbeat is the universe's applause.",
    "Mountains are just the earth daring to stand up.",
    "Every leaf is a letter the tree wrote to the light.",
    "The ocean keeps its secrets in blue ink.",
    "You are made of the same dust as comets.",
    "Clouds are slow ships with nowhere to be.",
    "Somewhere a star is burning just to reach your eyes.",
    "The moon wears a different dress every night."
  ],
  memory: [
    "Old songs know the way back to old rooms.",
    "The past is a house you visit but no longer live in.",
    "Some afternoons never really end; they just get quiet.",
    "Photographs hold their breath for years.",
    "Childhood smells like rain on a warm sidewalk.",
    "Memory is the only time machine that runs on love.",
    "You carry every version of yourself like nesting dolls.",
    "Yesterday left its shoes by the door.",
    "Time softens edges the way water softens stone.",
    "The heart keeps postcards from every place it has been.",
    "Some voices echo long after the room is empty.",
    "We are all archives of small, bright days."
  ]
};

// Word stems that suggest a mood. A stem matches any word that starts with it,
// so "tire" matches tired, tiring and tires.
const MOOD_STEMS = {
  joy: ["happ", "joy", "laugh", "fun", "great", "amazing", "excit", "glad", "smil", "celebrat", "yay", "awesome", "delight", "proud", "win", "won", "party", "good"],
  sorrow: ["sad", "cry", "cried", "tear", "griev", "grief", "lonel", "alone", "miss", "lost", "loss", "hurt", "depress", "heartbr", "sorr", "upset", "empty", "funeral", "died", "death"],
  love: ["lov", "crush", "kiss", "date", "partner", "boyfriend", "girlfriend", "wife", "husband", "friend", "hug", "heart", "family", "mom", "dad", "sister", "brother", "grateful", "thank"],
  weary: ["tire", "exhaust", "sleep", "nap", "drain", "burn", "long day", "worn", "fatigu", "bed", "late", "busy", "overwork", "can't focus", "slow"],
  restless: ["angry", "anger", "mad", "furious", "annoy", "frustrat", "stress", "anx", "worr", "nervous", "panic", "scar", "afraid", "fear", "overwhelm", "hate", "argu", "fight", "deadline", "exam"],
  hope: ["hope", "tomorrow", "future", "plan", "goal", "dream", "start", "begin", "new", "try", "better", "chang", "grow", "wish", "someday", "next", "learn", "improv"],
  calm: ["calm", "peace", "quiet", "relax", "tea", "coffee", "read", "book", "garden", "slow", "rest", "cozy", "soft", "still", "breath", "medit", "walk", "chill"],
  wonder: ["star", "sky", "moon", "sun", "rain", "ocean", "sea", "tree", "flower", "mountain", "cloud", "wind", "snow", "beautiful", "nature", "night", "light", "bird", "forest", "beach"],
  memory: ["remember", "memor", "childhood", "used to", "back then", "old", "years ago", "nostalg", "photo", "past", "grandm", "grandp", "growing up", "when i was", "again", "anniversar"]
};

export const MOODS = Object.keys(POEMS);

const FALLBACK_MOODS = ["wonder", "calm", "hope"];

/** Score each mood for a piece of text. Returns { mood: score }. */
export function scoreMoods(text) {
  const lower = ` ${text.toLowerCase().replace(/[^a-z' ]+/g, " ").replace(/\s+/g, " ")} `;
  const words = lower.trim().split(" ").filter(Boolean);
  const scores = {};
  for (const mood of MOODS) {
    let score = 0;
    for (const stem of MOOD_STEMS[mood]) {
      if (stem.includes(" ")) {
        if (lower.includes(` ${stem}`)) score += 1;
      } else {
        for (const word of words) if (word.startsWith(stem)) score += 1;
      }
    }
    scores[mood] = score;
  }
  return scores;
}

/** The strongest mood in the text, or null when nothing matches. */
export function detectMood(text) {
  const scores = scoreMoods(text);
  let best = null;
  let bestScore = 0;
  for (const mood of MOODS) {
    if (scores[mood] > bestScore) {
      best = mood;
      bestScore = scores[mood];
    }
  }
  return best;
}

/**
 * Split an entry into chunks. Paragraphs (blank-line separated) are chunks.
 * A single long paragraph is split into groups of two sentences.
 */
export function splitIntoChunks(body) {
  const paragraphs = body
    .replace(/\r\n/g, "\n")
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
  if (paragraphs.length !== 1) return paragraphs;

  const sentences = paragraphs[0].match(/[^.!?]+[.!?]+["')\]]*\s*|[^.!?]+$/g) ?? [paragraphs[0]];
  if (sentences.length < 3) return paragraphs;
  const chunks = [];
  for (let i = 0; i < sentences.length; i += 2) {
    chunks.push(sentences.slice(i, i + 2).join("").trim());
  }
  return chunks.filter(Boolean);
}

const MAX_POEMS = 6;

/**
 * Weave poetry between the chunks of an entry.
 * Returns { mood, parts: [{ kind: "text" | "poem", text, mood? }] }.
 * `random` is injectable so tests are deterministic.
 */
export function weave(body, random = Math.random) {
  const chunks = splitIntoChunks(body);
  const entryMood = detectMood(body) ?? FALLBACK_MOODS[Math.floor(random() * FALLBACK_MOODS.length)];
  const used = new Set();

  // Spread poems evenly when there are more chunks than MAX_POEMS.
  const poemAfter = new Set();
  const slots = Math.min(chunks.length, MAX_POEMS);
  for (let i = 1; i <= slots; i++) {
    poemAfter.add(Math.round((i * chunks.length) / slots) - 1);
  }

  const parts = [];
  chunks.forEach((chunk, index) => {
    parts.push({ kind: "text", text: chunk });
    if (!poemAfter.has(index)) return;
    const mood = detectMood(chunk) ?? entryMood;
    parts.push({ kind: "poem", mood, text: pickLine(mood, used, random) });
  });

  return { mood: entryMood, parts };
}

function pickLine(mood, used, random) {
  let pool = POEMS[mood].filter((line) => !used.has(line));
  if (pool.length === 0) pool = MOODS.flatMap((m) => POEMS[m]).filter((line) => !used.has(line));
  const line = pool[Math.floor(random() * pool.length)];
  used.add(line);
  return line;
}

/** Pick a fresh line for one poem part, avoiding lines already in the entry. */
export function rerollLine(parts, index, random = Math.random) {
  const used = new Set(parts.filter((p) => p.kind === "poem").map((p) => p.text));
  return pickLine(parts[index].mood, used, random);
}

export const MOOD_LABELS = {
  joy: "joy",
  sorrow: "sorrow",
  love: "love",
  weary: "weariness",
  restless: "restlessness",
  hope: "hope",
  calm: "calm",
  wonder: "wonder",
  memory: "memory"
};
