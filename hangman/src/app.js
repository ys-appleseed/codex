import { createGame } from "./game-core.js";
import { t } from "./i18n.js";
import { WORDS } from "./words.js";

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
