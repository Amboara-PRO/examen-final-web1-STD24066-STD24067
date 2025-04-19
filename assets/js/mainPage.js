const setting_button = document.querySelector("#setting");
const setting_options = document.querySelector("#setting_content");
const setting_button_back = document.querySelector(".setting_back");
const make_filter_blur = document.querySelectorAll(".make_filter_blur");
const log_out = document.querySelector(".setting_log_out");
const wpm_value = document.querySelector(".wpm_value");
const accuracy_value = document.querySelector(".accuracy_value");
const restart_button = document.querySelector(".restart");
const next_button = document.querySelector(".next");
const mode_difficultySelect = document.getElementById("mode_difficulty");
const wordDisplay = document.getElementById("word-display");
const inputField = document.getElementById("input-field");
const results = document.getElementById("results");
const animation_finished = document.querySelector(".animation_finished");
const resultANDanimation_finished = document.querySelector(
  ".resultANDanimation_finished"
);
let totalTypedChars = 0;
let totalCorrectChars = 0;

setting_button.addEventListener("click", () => {
  setting_options.classList.toggle("setting_content_none");
  make_filter_blur.forEach((element) => {
    element.classList.toggle("filter_blur");
  });
});
setting_button_back.addEventListener("click", () => {
  setting_options.classList.toggle("setting_content_none");
  make_filter_blur.forEach((element) => {
    element.classList.remove("filter_blur");
  });
});
log_out.addEventListener("click", (e) => {
  e.preventDefault();
  location.href = "/index.html";
});

let startTime = null,
  previousEndTime = null;
let currentWordIndex = 0;
const wordsToType = [];
let originalWords = [];

const words = {
  easy: ["apple", "banana", "grape", "orange", "cherry"],
  medium: ["keyboard", "monitor", "printer", "charger", "battery"],
  hard: [
    "synchronize",
    "complicated",
    "development",
    "extravagant",
    "misconception",
  ],
};

const getRandomWord = (mode) => {
  const wordList = words[mode];
  return wordList[Math.floor(Math.random() * wordList.length)];
};

const startTest = (wordCount = 25, reuseWords = false) => {
  wordsToType.length = 0;
  wordDisplay.innerHTML = "";
  currentWordIndex = 0;
  startTime = null;
  previousEndTime = null;
  totalTypedChars = 0;
  totalCorrectChars = 0;

  if (reuseWords && originalWords.length > 0) {
    originalWords.forEach((word) => wordsToType.push(word));
  } else {
    for (let i = 0; i < wordCount; i++) {
      wordsToType.push(getRandomWord(mode_difficultySelect.value));
    }
    originalWords = [...wordsToType];
  }

  wordsToType.forEach((word, index) => {
    const span = document.createElement("span");
    span.textContent = word + " ";
    if (index === 0) span.style.color = "red";
    wordDisplay.appendChild(span);
  });

  inputField.value = "";
  wpm_value.textContent = "0.00";
  accuracy_value.textContent = "0%";
  inputField.focus();
};

const startTimer = () => {
  if (!startTime) startTime = Date.now();
};

const getCurrentStats = () => {
  const elapsedTime = (Date.now() - previousEndTime) / 1000;
  const wpm = wordsToType[currentWordIndex].length / 5 / (elapsedTime / 60);
  const accuracy =
    (wordsToType[currentWordIndex].length / inputField.value.length) * 100;

  return { wpm: wpm.toFixed(2), accuracy: accuracy.toFixed(2) };
};

const highlightNextWord = () => {
  const wordElements = wordDisplay.children;

  if (currentWordIndex < wordElements.length) {
    if (currentWordIndex > 0) {
      wordElements[currentWordIndex - 1].style.color = "black";
    }
    wordElements[currentWordIndex].style.color = "red";
  }
};
const updateWord = (event) => {
  if (event.key === " ") {
    const typed = inputField.value.trim();
    const expected = wordsToType[currentWordIndex];

    totalTypedChars += typed.length;

    let correctChars = 0;
    for (let i = 0; i < Math.min(typed.length, expected.length); i++) {
      if (typed[i] === expected[i]) correctChars++;
    }

    totalCorrectChars += correctChars;

    const accuracy =
      totalTypedChars === 0 ? 100 : (totalCorrectChars / totalTypedChars) * 100;

    if (!previousEndTime) previousEndTime = startTime;
    const elapsedTime = (Date.now() - previousEndTime) / 1000;
    const wpm = typed.length / 5 / (elapsedTime / 60);

    wpm_value.textContent = wpm.toFixed(2);
    accuracy_value.textContent = `${accuracy.toFixed(2)}%`;

    currentWordIndex++;
    previousEndTime = Date.now();
    highlightNextWord();

    inputField.value = "";
    event.preventDefault();
    if (currentWordIndex >= wordsToType.length) {
      animation_finished.classList.add("animation_finished_added");
      resultANDanimation_finished.classList.add(
        "resultANDanimation_finished_added"
      );
      return;
    }
  }
};

inputField.addEventListener("keydown", (event) => {
  startTimer();
  updateWord(event);
});
mode_difficultySelect.addEventListener("change", () => startTest());

restart_button.addEventListener("click", () => {
  console.log("Bouton restart cliqué");
  startTest(25, true);
  animation_finished.classList.remove("animation_finished_added");
  resultANDanimation_finished.classList.remove(
    "resultANDanimation_finished_added"
  );
  inputField.focus();
});

next_button.addEventListener("click", () => {
  console.log("Bouton next cliqué");
  startTest();
  animation_finished.classList.remove("animation_finished_added");
  resultANDanimation_finished.classList.remove(
    "resultANDanimation_finished_added"
  );
  inputField.focus();
});
startTest();

