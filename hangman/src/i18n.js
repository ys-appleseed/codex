export const MESSAGES = {
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

export function t(key, params = {}) {
  const template = MESSAGES[key] || key;
  return template.replace(/\{(\w+)\}/g, (_, token) => {
    if (Object.prototype.hasOwnProperty.call(params, token)) {
      return String(params[token]);
    }
    return `{${token}}`;
  });
}
