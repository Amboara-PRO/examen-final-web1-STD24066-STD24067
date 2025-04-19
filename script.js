/**
 * Point culture (en Français car je suis un peu obligé):
 * Dans ce genre de jeu, un mot equivaut a 5 caractères, y compris les espaces.
 * La precision, c'est le pourcentage de caractères tapées correctement sur toutes les caractères tapées.
 *
 * Sur ce... Amusez-vous bien !
 */
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
  location.href = "login.html";
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

// Generate a random word from the selected mode
const getRandomWord = (mode) => {
  const wordList = words[mode];
  return wordList[Math.floor(Math.random() * wordList.length)];
};

// Initialize the typing test
const startTest = (wordCount = 25, reuseWords = false) => {
  wordsToType.length = 0;
  wordDisplay.innerHTML = "";
  currentWordIndex = 0;
  startTime = null;
  previousEndTime = null;
  totalTypedChars = 0;
  totalCorrectChars = 0;

  // Reprendre les mots précédents ou en générer de nouveaux
  if (reuseWords && originalWords.length > 0) {
    originalWords.forEach((word) => wordsToType.push(word));
  } else {
    for (let i = 0; i < wordCount; i++) {
      wordsToType.push(getRandomWord(mode_difficultySelect.value));
    }
    originalWords = [...wordsToType];
  }

  // Affichage
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

// Start the timer when user begins typing
const startTimer = () => {
  if (!startTime) startTime = Date.now();
};

// Calculate and return WPM & accuracy
const getCurrentStats = () => {
  const elapsedTime = (Date.now() - previousEndTime) / 1000; // Seconds
  const wpm = wordsToType[currentWordIndex].length / 5 / (elapsedTime / 60); // 5 chars = 1 word
  const accuracy =
    (wordsToType[currentWordIndex].length / inputField.value.length) * 100;

  return { wpm: wpm.toFixed(2), accuracy: accuracy.toFixed(2) };
};

// Highlight the current word in red
const highlightNextWord = () => {
  const wordElements = wordDisplay.children;

  if (currentWordIndex < wordElements.length) {
    if (currentWordIndex > 0) {
      wordElements[currentWordIndex - 1].style.color = "black";
    }
    wordElements[currentWordIndex].style.color = "red";
  }
};
// Move to the next word and update stats only on spacebar press
const updateWord = (event) => {
  if (event.key === " ") {
    const typed = inputField.value.trim();
    const expected = wordsToType[currentWordIndex];

    // 1. Incrémente les caractères tapés
    totalTypedChars += typed.length;

    // 2. Compare caractère par caractère
    let correctChars = 0;
    for (let i = 0; i < Math.min(typed.length, expected.length); i++) {
      if (typed[i] === expected[i]) correctChars++;
    }

    totalCorrectChars += correctChars;

    // 3. Calcul de l'accuracy
    const accuracy =
      totalTypedChars === 0 ? 100 : (totalCorrectChars / totalTypedChars) * 100;

    // 4. Calcul du WPM (1 mot = 5 caractères)
    if (!previousEndTime) previousEndTime = startTime;
    const elapsedTime = (Date.now() - previousEndTime) / 1000;
    const wpm = typed.length / 5 / (elapsedTime / 60);

    // 5. Mise à jour UI
    wpm_value.textContent = wpm.toFixed(2);
    accuracy_value.textContent = `${accuracy.toFixed(2)}%`;

    // 6. Préparation mot suivant
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
// Start the test
startTest();

// ************* restart **************
