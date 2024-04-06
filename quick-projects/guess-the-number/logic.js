const guessField = document.querySelector("#guess-field");

const minBoundField = document.querySelector("#min-bound-field");
const maxBoundField = document.querySelector("#max-bound-field");
let minBound = Number(minBoundField.value);
let maxBound = Number(maxBoundField.value);

let guessLimit, guessRemaining, previousGuesses = [];
let secretNumber;

function resetGuessLimit() {
    guessLimit = Math.ceil(Math.log2(maxBound - minBound + 1));

    const guessLimits = document.querySelectorAll(".guess-limit");
    for (const lim of guessLimits) {
        lim.textContent = `${guessLimit}`;
    }
}

function onMinBoundChange() {
    minBound = Number(minBoundField.value);
    maxBoundField.setAttribute("min", `${minBound + 1}`);
    guessField.setAttribute("min", `${minBound}`);
    resetGuessLimit()

    const minBoundElems = document.querySelectorAll(".min-bound");
    for (const bound of minBoundElems) {
        bound.textContent = `${minBound}`;
    }
}
function onMaxBoundChange() {
    maxBound = Number(maxBoundField.value);
    minBoundField.setAttribute("max", `${maxBound - 1}`);
    guessField.setAttribute("max", `${maxBound}`);
    resetGuessLimit()

    const maxBoundElems = document.querySelectorAll(".max-bound");
    for (const bound of maxBoundElems ) {
        bound.textContent = `${maxBound}`;
    }
}

minBoundField.addEventListener("input", onMinBoundChange);
maxBoundField.addEventListener("input", onMaxBoundChange);

resetGuessLimit();
onMinBoundChange();
onMaxBoundChange();

function setModePlaying() {
    document.querySelector(".mode-configure").style.display = "none";
    document.querySelector(".mode-play").style.display = "revert";
    document.querySelector(".mode-gameover").style.display = "none";

    resetGame();
}
function setModeConfigure() {
    document.querySelector(".mode-configure").style.display = "revert";
    document.querySelector(".mode-play").style.display = "none";
    document.querySelector(".mode-gameover").style.display = "none";
}
function setModeGameover() {
    document.querySelector(".mode-configure").style.display = "none";
    document.querySelector(".mode-play").style.display = "revert";
    document.querySelector(".mode-gameover").style.display = "revert";
}

document.querySelector(".start-play").addEventListener("click", setModePlaying);
setModeConfigure();

function updateGuessRemaining(r) {
    guessRemaining = Number(r);

    const elems = document.querySelectorAll(".guess-remaining");
    for (const elem of elems) {
        elem.textContent = `${guessRemaining}`;
    }
}

function resetGame() {
    updateGuessRemaining(guessLimit);
    secretNumber = Math.floor(Math.random()*(maxBound - minBound + 1) + minBound);
    guessField.focus();
}

function addGuess(num, goal) {
    previousGuesses.push(num);

    const prevGuessContainer = document.querySelector(".previous-guess-container");
    const prevGuess = document.createElement("li");
    prevGuess.appendChild(document.createTextNode(`${num}`));
    const hint = document.createElement("abbr");
    hint.setAttribute("class", "material-symbols-rounded");
    
    if (num > goal) {
        console.log("too high");
        prevGuess.setAttribute("class", "previous-guess too-high");
        hint.textContent = "arrow_cool_down";
        hint.setAttribute("title", "Too high!");
    } else if (num < goal) {
        console.log("too low");
        prevGuess.setAttribute("class", "previous-guess too-low");
        hint.textContent = "arrow_warm_up";
        hint.setAttribute("title", "Too low!");
    }

    prevGuess.appendChild(hint);
    prevGuessContainer.appendChild(prevGuess);
}

function onSubmitGuess() {
    guessField.focus();
    const userGuess = Number(guessField.value);
    if (previousGuesses.indexOf(userGuess) !== -1) {
        // on already present
        console.log("Already guessed that number");
        guessField.select();
        return;
    }

    guessField.value = "";
    updateGuessRemaining(guessRemaining - 1);
    addGuess(userGuess, secretNumber);

    if (userGuess === secretNumber) {
        onGameOver({ isVictory: true });
    } else if (guessRemaining <= 0) {
        onGameOver({ isLoss: true });
    }
}

function onGameOver(result) {
    setModeGameover();
    const gameoverMode = document.querySelector(".mode-gameover");
    const gameoverModeCls = gameoverMode.getAttribute("class");
    const gameDecision = document.querySelector("#game-decision");
    if (result.isVictory) {
        gameDecision.textContent = "You won!";
        gameoverMode.setAttribute("class", `${gameoverModeCls} game-victory`);
    } else {
        gameDecision.textContent = "You lose!";
        gameoverMode.setAttribute("class", `${gameoverModeCls} game-loss`);
    }

    const elems = document.querySelectorAll(".secret-number");
    for (const e of elems) {
        e.textContent = `${secretNumber}`;
    }
}

guessField.addEventListener("input", function() { 
    if (previousGuesses.indexOf(Number(guessField.value)) !== -1) {
        guessField.setCustomValidity("Guess a number that has not been guessed yet.");
    } else {
        guessField.setCustomValidity("");
    }

    submitGuess.disabled = !guessField.reportValidity();
});
const submitGuess = document.querySelector("#submit-guess");
submitGuess.addEventListener("click", onSubmitGuess);

