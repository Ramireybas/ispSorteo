const csvFile = document.getElementById("csvFile");
const participantsCount = document.getElementById("participantsCount");
const drawButton = document.getElementById("drawButton");

const winnerSection = document.getElementById("winnerSection");
const winnerNumber = document.getElementById("winnerNumber");
const dateTime = document.getElementById("dateTime");

const winSound = document.getElementById("winSound");

let participants = [];

csvFile.addEventListener("change", loadCSV);

function loadCSV(event) {

    const file = event.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = function (e) {

        const content = e.target.result;

        let lines = content.split(/\r?\n/);

        lines = lines
            .map(line => line.trim())
            .filter(line => line !== "");

        // VALIDACIONES TEST

        const duplicates = findDuplicates(lines);

        if (duplicates.length > 0) {
            alert("Hay números duplicados en el CSV.");
            return;
        }

        const invalidNumbers = lines.filter(line => !/^\d{6}$/.test(line));

        if (invalidNumbers.length > 0) {
            alert("Hay números inválidos. Deben tener 6 dígitos.");
            return;
        }

        participants = lines;

        participantsCount.textContent = participants.length;

        drawButton.disabled = false;

        winnerSection.classList.add("hidden");
    };

    reader.readAsText(file);
}

function findDuplicates(array) {

    const seen = new Set();

    const duplicates = [];

    for (const item of array) {

        if (seen.has(item)) {
            duplicates.push(item);
        }

        seen.add(item);
    }

    return duplicates;
}

drawButton.addEventListener("click", startDraw);

function startDraw() {

    if (participants.length === 0) return;

    drawButton.disabled = true;

    let animationCount = 0;

    const animationInterval = setInterval(() => {

        const fakeNumber = generateRandomNumber();

        winnerNumber.textContent = fakeNumber;

        animationCount++;

        if (animationCount > 25) {

            clearInterval(animationInterval);

            showWinner();
        }

    }, 80);
}

function showWinner() {

    const randomIndex = Math.floor(Math.random() * participants.length);

    const winner = participants[randomIndex];

    winnerSection.classList.remove("hidden");

    winnerNumber.textContent = winner;

    const now = new Date();

    dateTime.textContent =
        now.toLocaleDateString() +
        " - " +
        now.toLocaleTimeString();

    winSound.play();

    launchConfetti();

    participants = [];
}

function generateRandomNumber() {

    return Math.floor(Math.random() * 1000000)
        .toString()
        .padStart(6, "0");
}

function launchConfetti() {

    for (let i = 0; i < 180; i++) {

        const confetti = document.createElement("div");

        confetti.classList.add("confetti");

        confetti.style.left = Math.random() * window.innerWidth + "px";

        confetti.style.animationDuration =
            (Math.random() * 3 + 2) + "s";

        confetti.style.background =
            Math.random() > 0.5
                ? "#00ffae"
                : "#008cff";

        document.body.appendChild(confetti);

        setTimeout(() => {
            confetti.remove();
        }, 5000);
    }
}