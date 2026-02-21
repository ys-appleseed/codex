/* Auto-generated fallback for file:// usage in browsers that restrict ES module imports. */
(function () {
const MESSAGES = {
  appTitle: "Hangman",
  appSubtitle: "Guess the English word",
  remaining: "Misses left: {count}",
  wrongLetters: "Wrong letters",
  statusPlaying: "Pick a letter to complete the word.",
  statusWon: "You won!",
  statusLost: "Game over",
  hintLabel: "Hint (English meaning)",
  hintTemplate: "Meaning: {meaning}. Starts with {first}, ends with {last}, {length} letters.",
  answerLabel: "Answer",
  resultHintLabel: "Hint",
  newWordButton: "New Word",
  inputHint: "Use onscreen buttons or your keyboard (A-Z).",
  dictionaryError: "Dictionary data is unavailable, so the game cannot start."
};
function t(key, params = {}) {
  const template = MESSAGES[key] || key;
  return template.replace(/\{(\w+)\}/g, (_, token) => {
    if (Object.prototype.hasOwnProperty.call(params, token)) {
      return String(params[token]);
    }
    return `{${token}}`;
  });
}


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
function createGame({ words, maxMisses = 6 }) {
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


const WORDS = [
  { word: "APPLE", meaningJa: "りんご" },
  { word: "BANANA", meaningJa: "バナナ" },
  { word: "ORANGE", meaningJa: "オレンジ" },
  { word: "GRAPE", meaningJa: "ぶどう" },
  { word: "PEACH", meaningJa: "もも" },
  { word: "PEAR", meaningJa: "なし" },
  { word: "MELON", meaningJa: "メロン" },
  { word: "CHERRY", meaningJa: "さくらんぼ" },
  { word: "LEMON", meaningJa: "レモン" },
  { word: "LIME", meaningJa: "ライム" },
  { word: "MANGO", meaningJa: "マンゴー" },
  { word: "PAPAYA", meaningJa: "パパイヤ" },
  { word: "COCONUT", meaningJa: "ココナッツ" },
  { word: "STRAWBERRY", meaningJa: "いちご" },
  { word: "BLUEBERRY", meaningJa: "ブルーベリー" },
  { word: "RASPBERRY", meaningJa: "ラズベリー" },
  { word: "WATERMELON", meaningJa: "すいか" },
  { word: "PINEAPPLE", meaningJa: "パイナップル" },
  { word: "APRICOT", meaningJa: "あんず" },
  { word: "PLUM", meaningJa: "すもも" },
  { word: "CARROT", meaningJa: "にんじん" },
  { word: "POTATO", meaningJa: "じゃがいも" },
  { word: "TOMATO", meaningJa: "トマト" },
  { word: "ONION", meaningJa: "たまねぎ" },
  { word: "GARLIC", meaningJa: "にんにく" },
  { word: "PEPPER", meaningJa: "こしょう" },
  { word: "CABBAGE", meaningJa: "キャベツ" },
  { word: "BROCCOLI", meaningJa: "ブロッコリー" },
  { word: "SPINACH", meaningJa: "ほうれんそう" },
  { word: "CUCUMBER", meaningJa: "きゅうり" },
  { word: "PUMPKIN", meaningJa: "かぼちゃ" },
  { word: "RADISH", meaningJa: "だいこん" },
  { word: "BEAN", meaningJa: "まめ" },
  { word: "PEA", meaningJa: "えんどうまめ" },
  { word: "CORN", meaningJa: "とうもろこし" },
  { word: "CELERY", meaningJa: "セロリ" },
  { word: "LETTUCE", meaningJa: "レタス" },
  { word: "MUSHROOM", meaningJa: "きのこ" },
  { word: "GINGER", meaningJa: "しょうが" },
  { word: "TURNIP", meaningJa: "かぶ" },
  { word: "DOG", meaningJa: "いぬ" },
  { word: "CAT", meaningJa: "ねこ" },
  { word: "MOUSE", meaningJa: "ねずみ" },
  { word: "HORSE", meaningJa: "うま" },
  { word: "SHEEP", meaningJa: "ひつじ" },
  { word: "GOAT", meaningJa: "やぎ" },
  { word: "COW", meaningJa: "うし" },
  { word: "PIG", meaningJa: "ぶた" },
  { word: "RABBIT", meaningJa: "うさぎ" },
  { word: "FOX", meaningJa: "きつね" },
  { word: "WOLF", meaningJa: "おおかみ" },
  { word: "BEAR", meaningJa: "くま" },
  { word: "LION", meaningJa: "ライオン" },
  { word: "TIGER", meaningJa: "とら" },
  { word: "ZEBRA", meaningJa: "しまうま" },
  { word: "MONKEY", meaningJa: "さる" },
  { word: "PANDA", meaningJa: "パンダ" },
  { word: "KOALA", meaningJa: "コアラ" },
  { word: "GIRAFFE", meaningJa: "きりん" },
  { word: "ELEPHANT", meaningJa: "ぞう" },
  { word: "TABLE", meaningJa: "つくえ" },
  { word: "CHAIR", meaningJa: "いす" },
  { word: "SOFA", meaningJa: "ソファ" },
  { word: "BED", meaningJa: "ベッド" },
  { word: "CLOCK", meaningJa: "とけい" },
  { word: "MIRROR", meaningJa: "かがみ" },
  { word: "WINDOW", meaningJa: "まど" },
  { word: "DOOR", meaningJa: "とびら" },
  { word: "FLOOR", meaningJa: "ゆか" },
  { word: "CEILING", meaningJa: "てんじょう" },
  { word: "KITCHEN", meaningJa: "だいどころ" },
  { word: "BATHROOM", meaningJa: "よくしつ" },
  { word: "BEDROOM", meaningJa: "しんしつ" },
  { word: "GARDEN", meaningJa: "にわ" },
  { word: "BALCONY", meaningJa: "バルコニー" },
  { word: "POCKET", meaningJa: "ポケット" },
  { word: "BOTTLE", meaningJa: "ボトル" },
  { word: "GLASS", meaningJa: "グラス" },
  { word: "PLATE", meaningJa: "さら" },
  { word: "SPOON", meaningJa: "スプーン" },
  { word: "PENCIL", meaningJa: "えんぴつ" },
  { word: "ERASER", meaningJa: "けしごむ" },
  { word: "NOTEBOOK", meaningJa: "ノート" },
  { word: "PAPER", meaningJa: "かみ" },
  { word: "SCISSOR", meaningJa: "はさみ" },
  { word: "MARKER", meaningJa: "マーカー" },
  { word: "CRAYON", meaningJa: "クレヨン" },
  { word: "RULER", meaningJa: "ものさし" },
  { word: "BAG", meaningJa: "かばん" },
  { word: "SHOES", meaningJa: "くつ" },
  { word: "SHIRT", meaningJa: "シャツ" },
  { word: "PANTS", meaningJa: "ズボン" },
  { word: "SOCKS", meaningJa: "くつした" },
  { word: "JACKET", meaningJa: "ジャケット" },
  { word: "BUTTON", meaningJa: "ボタン" },
  { word: "ZIPPER", meaningJa: "ファスナー" },
  { word: "HAT", meaningJa: "ぼうし" },
  { word: "GLOVE", meaningJa: "てぶくろ" },
  { word: "TOWEL", meaningJa: "タオル" },
  { word: "PILLOW", meaningJa: "まくら" },
  { word: "SPRING", meaningJa: "はる" },
  { word: "SUMMER", meaningJa: "なつ" },
  { word: "AUTUMN", meaningJa: "あき" },
  { word: "WINTER", meaningJa: "ふゆ" },
  { word: "MORNING", meaningJa: "あさ" },
  { word: "NOON", meaningJa: "ひる" },
  { word: "EVENING", meaningJa: "ゆうがた" },
  { word: "NIGHT", meaningJa: "よる" },
  { word: "TODAY", meaningJa: "きょう" },
  { word: "TOMORROW", meaningJa: "あした" },
  { word: "YESTERDAY", meaningJa: "きのう" },
  { word: "MONDAY", meaningJa: "げつようび" },
  { word: "TUESDAY", meaningJa: "かようび" },
  { word: "WEDNESDAY", meaningJa: "すいようび" },
  { word: "THURSDAY", meaningJa: "もくようび" },
  { word: "FRIDAY", meaningJa: "きんようび" },
  { word: "SATURDAY", meaningJa: "どようび" },
  { word: "SUNDAY", meaningJa: "にちようび" },
  { word: "RED", meaningJa: "あか" },
  { word: "BLUE", meaningJa: "あお" },
  { word: "GREEN", meaningJa: "みどり" },
  { word: "YELLOW", meaningJa: "きいろ" },
  { word: "BLACK", meaningJa: "くろ" },
  { word: "WHITE", meaningJa: "しろ" },
  { word: "PURPLE", meaningJa: "むらさき" },
  { word: "BROWN", meaningJa: "ちゃいろ" },
  { word: "PINK", meaningJa: "ピンク" },
  { word: "GOLD", meaningJa: "きんいろ" },
  { word: "SILVER", meaningJa: "ぎんいろ" },
  { word: "GRAY", meaningJa: "はいいろ" },
  { word: "SMALL", meaningJa: "ちいさい" },
  { word: "LARGE", meaningJa: "おおきい" },
  { word: "SHORT", meaningJa: "みじかい" },
  { word: "LONG", meaningJa: "ながい" },
  { word: "FAST", meaningJa: "はやい" },
  { word: "SLOW", meaningJa: "おそい" },
  { word: "HAPPY", meaningJa: "うれしい" },
  { word: "SAD", meaningJa: "かなしい" },
  { word: "ANGRY", meaningJa: "おこった" },
  { word: "CALM", meaningJa: "おだやか" },
  { word: "BRAVE", meaningJa: "ゆうかんな" },
  { word: "KIND", meaningJa: "しんせつな" },
  { word: "FUNNY", meaningJa: "おかしい" },
  { word: "QUIET", meaningJa: "しずかな" },
  { word: "LOUD", meaningJa: "うるさい" },
  { word: "CLEAN", meaningJa: "きれいな" },
  { word: "DIRTY", meaningJa: "よごれた" },
  { word: "WATER", meaningJa: "みず" },
  { word: "JUICE", meaningJa: "ジュース" },
  { word: "COFFEE", meaningJa: "コーヒー" },
  { word: "TEA", meaningJa: "おちゃ" },
  { word: "MILK", meaningJa: "ぎゅうにゅう" },
  { word: "BREAD", meaningJa: "パン" },
  { word: "RICE", meaningJa: "こめ" },
  { word: "NOODLE", meaningJa: "めん" },
  { word: "SOUP", meaningJa: "スープ" },
  { word: "SALAD", meaningJa: "サラダ" },
  { word: "PIZZA", meaningJa: "ピザ" },
  { word: "BURGER", meaningJa: "バーガー" },
  { word: "CHEESE", meaningJa: "チーズ" },
  { word: "BUTTER", meaningJa: "バター" },
  { word: "SUGAR", meaningJa: "さとう" },
  { word: "SALT", meaningJa: "しお" },
  { word: "HONEY", meaningJa: "はちみつ" },
  { word: "CANDY", meaningJa: "あめ" },
  { word: "COOKIE", meaningJa: "クッキー" },
  { word: "CAKE", meaningJa: "ケーキ" },
  { word: "SUN", meaningJa: "たいよう" },
  { word: "MOON", meaningJa: "つき" },
  { word: "STAR", meaningJa: "ほし" },
  { word: "CLOUD", meaningJa: "くも" },
  { word: "RAIN", meaningJa: "あめ" },
  { word: "SNOW", meaningJa: "ゆき" },
  { word: "WIND", meaningJa: "かぜ" },
  { word: "STORM", meaningJa: "あらし" },
  { word: "THUNDER", meaningJa: "かみなり" },
  { word: "LIGHTNING", meaningJa: "いなずま" },
  { word: "RIVER", meaningJa: "かわ" },
  { word: "OCEAN", meaningJa: "うみ" },
  { word: "LAKE", meaningJa: "みずうみ" },
  { word: "MOUNTAIN", meaningJa: "やま" },
  { word: "FOREST", meaningJa: "もり" },
  { word: "DESERT", meaningJa: "さばく" },
  { word: "ISLAND", meaningJa: "しま" },
  { word: "BEACH", meaningJa: "ビーチ" },
  { word: "VALLEY", meaningJa: "たに" },
  { word: "FIELD", meaningJa: "のはら" },
  { word: "SCHOOL", meaningJa: "がっこう" },
  { word: "LIBRARY", meaningJa: "としょかん" },
  { word: "HOSPITAL", meaningJa: "びょういん" },
  { word: "STATION", meaningJa: "えき" },
  { word: "AIRPORT", meaningJa: "くうこう" },
  { word: "MARKET", meaningJa: "いちば" },
  { word: "OFFICE", meaningJa: "オフィス" },
  { word: "FACTORY", meaningJa: "こうじょう" },
  { word: "HOTEL", meaningJa: "ホテル" },
  { word: "MUSEUM", meaningJa: "はくぶつかん" },
  { word: "BICYCLE", meaningJa: "じてんしゃ" },
  { word: "CAR", meaningJa: "くるま" },
  { word: "TRAIN", meaningJa: "でんしゃ" }
];





const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const MAX_MISSES = 6;
const WORD_INDEX = new Map(WORDS.map((entry, index) => [entry.word, index]));

const HANGMAN_STAGES = [
  ` +---+
 |   |
     |
     |
     |
     |
=========`,
  ` +---+
 |   |
 O   |
     |
     |
     |
=========`,
  ` +---+
 |   |
 O   |
 |   |
     |
     |
=========`,
  ` +---+
 |   |
 O   |
/|   |
     |
     |
=========`,
  ` +---+
 |   |
 O   |
/|\\  |
     |
     |
=========`,
  ` +---+
 |   |
 O   |
/|\\  |
/    |
     |
=========`,
  ` +---+
 |   |
 O   |
/|\\  |
/ \\  |
     |
=========`
];

const elements = {
  appTitle: document.querySelector("#app-title"),
  appSubtitle: document.querySelector("#app-subtitle"),
  hangmanArt: document.querySelector("#hangman-art"),
  remainingText: document.querySelector("#remaining-text"),
  wordDisplay: document.querySelector("#word-display"),
  statusMessage: document.querySelector("#status-message"),
  inputHint: document.querySelector("#input-hint"),
  hintLabel: document.querySelector("#hint-label"),
  hintValue: document.querySelector("#hint-value"),
  wrongLabel: document.querySelector("#wrong-label"),
  wrongLetters: document.querySelector("#wrong-letters"),
  roundResult: document.querySelector("#round-result"),
  answerLabel: document.querySelector("#answer-label"),
  answerValue: document.querySelector("#answer-value"),
  resultHintLabel: document.querySelector("#result-hint-label"),
  resultHintValue: document.querySelector("#result-hint-value"),
  keyboard: document.querySelector("#keyboard"),
  newRoundBtn: document.querySelector("#new-round-btn"),
  errorPanel: document.querySelector("#error-panel")
};

let game;

function createKeyboard() {
  elements.keyboard.textContent = "";
  for (const letter of ALPHABET) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "key-btn";
    button.dataset.letter = letter;
    button.dataset.state = "unused";
    button.textContent = letter;
    elements.keyboard.appendChild(button);
  }
}

function showFatalError(message) {
  elements.errorPanel.hidden = false;
  elements.errorPanel.textContent = message;
  elements.newRoundBtn.disabled = true;

  for (const button of elements.keyboard.querySelectorAll("button")) {
    button.disabled = true;
  }
}

function formatMaskedWord(maskedWord) {
  return maskedWord.split("").join(" ");
}

function getMeaningHint(answer) {
  const index = WORD_INDEX.get(answer);
  if (index === undefined) {
    return "a common English word";
  }

  if (index < 20) {
    return "a fruit";
  }
  if (index < 40) {
    return "a vegetable or plant used in cooking";
  }
  if (index < 60) {
    return "an animal";
  }
  if (index < 80) {
    return "a household item or part of a home";
  }
  if (index < 88) {
    return "a school or writing tool";
  }
  if (index < 100) {
    return "an item related to clothing or personal belongings";
  }
  if (index < 104) {
    return "a season of the year";
  }
  if (index < 108) {
    return "a part of the day";
  }
  if (index < 111) {
    return "a time-reference word";
  }
  if (index < 118) {
    return "a day of the week";
  }
  if (index < 130) {
    return "a color";
  }
  if (index < 148) {
    return "a descriptive adjective";
  }
  if (index < 168) {
    return "a food or drink";
  }
  if (index < 178) {
    return "a sky or weather term";
  }
  if (index < 188) {
    return "a natural place or landform";
  }
  if (index < 198) {
    return "a place or public building";
  }
  return "a means of transportation";
}

function buildHintText(answer) {
  if (!answer) {
    return "-";
  }

  const meaning = getMeaningHint(answer);

  return t("hintTemplate", {
    meaning,
    first: answer[0],
    last: answer[answer.length - 1],
    length: answer.length
  });
}

function render() {
  const state = game.getState();
  const hintText = buildHintText(state.answer);
  document.documentElement.lang = "en";

  elements.appTitle.textContent = t("appTitle");
  elements.appSubtitle.textContent = t("appSubtitle");
  elements.remainingText.textContent = t("remaining", { count: state.remaining });
  elements.inputHint.textContent = t("inputHint");
  elements.hintLabel.textContent = t("hintLabel");
  elements.hintValue.textContent = hintText;
  elements.wrongLabel.textContent = t("wrongLetters");
  elements.answerLabel.textContent = t("answerLabel");
  elements.resultHintLabel.textContent = t("resultHintLabel");
  elements.newRoundBtn.textContent = t("newWordButton");

  elements.hangmanArt.textContent = HANGMAN_STAGES[Math.min(state.wrongLetters.length, MAX_MISSES)];
  elements.wordDisplay.textContent = formatMaskedWord(state.maskedWord);
  elements.wrongLetters.textContent = state.wrongLetters.length > 0 ? state.wrongLetters.join(" ") : "-";

  if (state.status === "won") {
    elements.statusMessage.textContent = t("statusWon");
  } else if (state.status === "lost") {
    elements.statusMessage.textContent = t("statusLost");
  } else {
    elements.statusMessage.textContent = t("statusPlaying");
  }
  elements.statusMessage.dataset.state = state.status;

  const isRoundFinished = state.status === "won" || state.status === "lost";
  elements.roundResult.hidden = !isRoundFinished;
  if (isRoundFinished) {
    elements.answerValue.textContent = state.answer;
    elements.resultHintValue.textContent = hintText;
  }

  const guessedCorrect = new Set(state.correctLetters);
  const guessedWrong = new Set(state.wrongLetters);

  for (const button of elements.keyboard.querySelectorAll("button[data-letter]")) {
    const letter = button.dataset.letter;

    if (guessedCorrect.has(letter)) {
      button.dataset.state = "correct";
    } else if (guessedWrong.has(letter)) {
      button.dataset.state = "wrong";
    } else {
      button.dataset.state = "unused";
    }

    button.disabled = state.status !== "playing" || guessedCorrect.has(letter) || guessedWrong.has(letter);
  }
}

function startNewRound() {
  try {
    game.startRound();
    elements.errorPanel.hidden = true;
    render();
  } catch {
    showFatalError(t("dictionaryError"));
  }
}

function bindEvents() {
  elements.keyboard.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLButtonElement)) {
      return;
    }

    const { letter } = target.dataset;
    if (!letter) {
      return;
    }

    game.guessLetter(letter);
    render();
  });

  elements.newRoundBtn.addEventListener("click", () => {
    startNewRound();
  });

  window.addEventListener("keydown", (event) => {
    const target = event.target;
    if (
      target instanceof HTMLInputElement ||
      target instanceof HTMLTextAreaElement ||
      (target instanceof HTMLElement && target.isContentEditable)
    ) {
      return;
    }

    const key = event.key.toUpperCase();
    if (!/^[A-Z]$/.test(key)) {
      return;
    }

    game.guessLetter(key);
    render();
  });
}

function init() {
  createKeyboard();

  if (!Array.isArray(WORDS) || WORDS.length === 0) {
    elements.newRoundBtn.textContent = t("newWordButton");
    showFatalError(t("dictionaryError"));
    return;
  }

  game = createGame({ words: WORDS, maxMisses: MAX_MISSES });

  bindEvents();
  startNewRound();
}

init();

})();
