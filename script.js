const csvFile = document.getElementById("csvFile");
const fileName = document.getElementById("fileName");

if (csvFile) {
    csvFile.addEventListener("change", () => {
        if (csvFile.files.length) {
            fileName.textContent = csvFile.files[0].name;
        }
    });
    csvFile.addEventListener("change", loadCSV);
}

const participantsCount = document.getElementById("participantsCount");
const drawButton = document.getElementById("drawButton");

const winnerSection = document.getElementById("winnerSection");
const winnerNumber = document.getElementById("winnerNumber");
const dateTime = document.getElementById("dateTime");

const winSound = document.getElementById("winSound");

let participants = [];

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

        // VALIDACIÓN DE DUPLICADOS
        const duplicates = findDuplicates(lines);

        if (duplicates.length > 0) {
            alert("Hay participantes duplicados en el CSV.");
            return;
        }

        participants = lines;

        // Oculta el elemento del contador si existe en el DOM
        if (participantsCount) {
            participantsCount.style.display = "none";
        }

        if (drawButton) {
            drawButton.disabled = false;
        }

        if (winnerSection) {
            winnerSection.classList.add("hidden");
        }
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

if (drawButton) {
    drawButton.addEventListener("click", startDraw);
}

function startDraw() {
    if (participants.length === 0) return;

    drawButton.disabled = true;
    
    if (winnerSection) {
        winnerSection.classList.remove("hidden");
    }

    // Reiniciar animaciones previas del ganador y la bici
    if (winnerNumber) {
        winnerNumber.classList.remove("winner-pop");
    }
    
    const bikeImg = document.querySelector(".bike-img");
    if (bikeImg) {
        bikeImg.classList.remove("bike-winner-effect");
    }

    let animationCount = 0;

    const animationInterval = setInterval(() => {
        const randomParticipant =
            participants[Math.floor(Math.random() * participants.length)];

        if (winnerNumber) {
            winnerNumber.textContent = randomParticipant;
        }

        animationCount++;

        if (animationCount > 30) {
            clearInterval(animationInterval);
            showWinner();
        }
    }, 70);
}

function showWinner() {
    const randomIndex = Math.floor(Math.random() * participants.length);
    const winner = participants[randomIndex];

    if (winnerSection) {
        winnerSection.classList.remove("hidden");
    }

    if (winnerNumber) {
        winnerNumber.textContent = winner;
        // Animación de rebote festivo para el número
        winnerNumber.classList.add("winner-pop");
    }

    // Animación de salto de celebración para la bicicleta
    const bikeImg = document.querySelector(".bike-img");
    if (bikeImg) {
        bikeImg.classList.add("bike-winner-effect");
        setTimeout(() => {
            bikeImg.classList.remove("bike-winner-effect");
        }, 1000);
    }

    const now = new Date();
    if (dateTime) {
        dateTime.textContent =
            now.toLocaleDateString() + " - " + now.toLocaleTimeString();
    }

    if (winSound) {
        winSound.play();
    }

    launchConfetti();

    participants = [];
}

function launchConfetti() {
    // Paleta de colores e íconos infantiles
    const colors = ["#ffea00", "#ff007f", "#00e676", "#00b0ff", "#aa00ff", "#ffffff"];
    const icons = ["★", "🎈", "🍬", "✦", "●"];

    for (let i = 0; i < 120; i++) {
        const confetti = document.createElement("div");
        confetti.classList.add("confetti");

        // Alternar entre confeti normal e íconos flotantes
        if (Math.random() > 0.4) {
            confetti.textContent = icons[Math.floor(Math.random() * icons.length)];
            confetti.style.fontSize = (Math.random() * 20 + 15) + "px";
            confetti.style.background = "none";
        } else {
            confetti.style.width = (Math.random() * 10 + 8) + "px";
            confetti.style.height = (Math.random() * 15 + 10) + "px";
            confetti.style.borderRadius = Math.random() > 0.5 ? "50%" : "3px";
            confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
        }

        confetti.style.left = Math.random() * 100 + "vw";
        confetti.style.animationDuration = (Math.random() * 2.5 + 2) + "s";
        confetti.style.animationDelay = (Math.random() * 0.5) + "s";

        document.body.appendChild(confetti);

        setTimeout(() => {
            confetti.remove();
        }, 5000);
    }
}
