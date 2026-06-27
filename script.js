const csvFile = document.getElementById("csvFile");
const fileName = document.getElementById("fileName");

csvFile.addEventListener("change", () => {
    if (csvFile.files.length) {
        fileName.textContent = csvFile.files[0].name;
    }
});

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

        // Limpia espacios en blanco y descarta líneas vacías
        lines = lines
            .map(line => line.trim())
            .filter(line => line !== "");

        // SE ELIMINÓ LA VALIDACIÓN DE DUPLICADOS PARA PERMITIR QUE SE REPITAN
        participants = lines;

        // SE MANTIENE COMENTADO PARA NO MOSTRAR LOS PARTICIPANTES EN LA INTERFAZ
        // participantsCount.textContent = participants.length;

        drawButton.disabled = false;

        winnerSection.classList.add("hidden");
    };

    reader.readAsText(file);
}

// Nota: Dejamos la función findDuplicates aquí por si la necesitas en otro lado, 
// pero ya no se ejecuta al cargar el CSV.
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

        const randomParticipant =
            participants[Math.floor(Math.random() * participants.length)];

        winnerNumber.textContent = randomParticipant;

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

function launchConfetti() {

    for (let i = 0; i < 180; i++) {

        const confetti = document.createElement("div");

        confetti.classList.add("confetti");

        confetti.style.left = Math.random() * window.innerWidth + "px";

        confetti.style.animationDuration =
            (Math.random() * 3 + 2) + "s";

        confetti.style.background =
            Math.random() > 0.5
                ? "#ffffff"
                : "#008cff";

        document.body.appendChild(confetti);

        setTimeout(() => {
            confetti.remove();
        }, 5000);
    }
}
