const LOCALE_SET = new Set(["ja", "en"]);

function shuffle(items) {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function isValidWordEntry(entry) {
  if (!entry || typeof entry.word !== "string" || typeof entry.meaningJa !== "string") {
    return false;
  }
  return /^[A-Z]+$/.test(entry.word);
}

export function createGame({ words, maxMisses = 6 }) {
  if (!Array.isArray(words)) {
    throw new Error("words must be an array");
  }

  const uniqueWords = [];
  const seen = new Set();

  for (const entry of words) {
    if (!isValidWordEntry(entry)) {
      continue;
    }
    if (!seen.has(entry.word)) {
      seen.add(entry.word);
      uniqueWords.push({ word: entry.word, meaningJa: entry.meaningJa });
    }
  }

  const safeMaxMisses = Number.isInteger(maxMisses) && maxMisses > 0 ? maxMisses : 6;
  let locale = "en";
  let queue = [];
  let queueIndex = 0;
  let lastWord = null;

  let round = {
    answer: "",
    meaningJa: "",
    correct: new Set(),
    wrong: new Set(),
    status: "lost"
  };

  function refillQueue() {
    if (uniqueWords.length === 0) {
      queue = [];
      queueIndex = 0;
      return;
    }

    queue = shuffle(uniqueWords);

    // Avoid immediate repeats between rounds when possible.
    if (lastWord && queue.length > 1 && queue[0].word === lastWord) {
      queue.push(queue.shift());
    }

    queueIndex = 0;
  }

  function evaluateStatus() {
    const hasWon = [...round.answer].every((letter) => round.correct.has(letter));
    if (hasWon) {
      return "won";
    }

    if (round.wrong.size >= safeMaxMisses) {
      return "lost";
    }

    return "playing";
  }

  function ensureRound() {
    if (!round.answer) {
      throw new Error("Round is not started");
    }
  }

  function buildMaskedWord() {
    return [...round.answer].map((letter) => (round.correct.has(letter) ? letter : "_")).join("");
  }

  function getState() {
    if (!round.answer) {
      return {
        locale,
        maskedWord: "",
        wrongLetters: [],
        correctLetters: [],
        remaining: safeMaxMisses,
        status: "lost",
        answer: "",
        meaningJa: ""
      };
    }

    return {
      locale,
      maskedWord: buildMaskedWord(),
      wrongLetters: [...round.wrong],
      correctLetters: [...round.correct],
      remaining: Math.max(0, safeMaxMisses - round.wrong.size),
      status: round.status,
      answer: round.answer,
      meaningJa: round.meaningJa
    };
  }

  function startRound() {
    if (uniqueWords.length === 0) {
      throw new Error("No words available");
    }

    if (queueIndex >= queue.length) {
      refillQueue();
    }

    const entry = queue[queueIndex];
    queueIndex += 1;

    round = {
      answer: entry.word,
      meaningJa: entry.meaningJa,
      correct: new Set(),
      wrong: new Set(),
      status: "playing"
    };

    lastWord = entry.word;
    return getState();
  }

  function guessLetter(letter) {
    ensureRound();

    if (round.status !== "playing" || typeof letter !== "string") {
      return getState();
    }

    const normalized = letter.toUpperCase();
    if (!/^[A-Z]$/.test(normalized)) {
      return getState();
    }

    if (round.correct.has(normalized) || round.wrong.has(normalized)) {
      return getState();
    }

    if (round.answer.includes(normalized)) {
      round.correct.add(normalized);
    } else {
      round.wrong.add(normalized);
    }

    round.status = evaluateStatus();
    return getState();
  }

  function setLocale(nextLocale) {
    if (LOCALE_SET.has(nextLocale)) {
      locale = nextLocale;
    }
    return getState();
  }

  refillQueue();

  return {
    startRound,
    guessLetter,
    setLocale,
    getState
  };
}
