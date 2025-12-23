/* === CONFIGURACIÓN INICIAL === */
let timeLeft = 25 * 60; 
let timerId = null;
let isWorkTime = true;
let isMuted = false;

const alarmSound = new Audio('alarma.mp3'); 

/* === ELEMENTOS DEL DOM === */
const minutesDisplay = document.getElementById('minutes');
const secondsDisplay = document.getElementById('seconds');
const statusText = document.getElementById('status-text');
const body = document.body;
const historyList = document.getElementById('history-list');

/* === LÓGICA DEL TIEMPO === */
function updateDisplay() {
    let mins = Math.floor(timeLeft / 60);
    let secs = timeLeft % 60;
    minutesDisplay.textContent = mins.toString().padStart(2, '0');
    secondsDisplay.textContent = secs.toString().padStart(2, '0');
}

function switchMode() {
    isWorkTime = !isWorkTime;
    if (isWorkTime) {
        timeLeft = 25 * 60;
        statusText.textContent = "¡A trabajar!";
        if (!body.classList.contains('dark-mode')) body.style.backgroundColor = "#e74c3c";
    } else {
        timeLeft = 5 * 60;
        statusText.textContent = "Descanso corto";
        if (!body.classList.contains('dark-mode')) body.style.backgroundColor = "#2ecc71";
    }
    updateDisplay();
}

function addHistory(min) {
    const li = document.createElement('li');
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    li.innerHTML = `<span>${isWorkTime ? '💻 Trabajo' : '☕ Descanso'}</span> <span>${min}m - ${now}</span>`;
    historyList.prepend(li);
}

/* === EVENTOS === */
document.getElementById('start').addEventListener('click', () => {
    if (timerId) return;
    timerId = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            updateDisplay();
        } else {
            clearInterval(timerId);
            timerId = null;
            if (!isMuted) alarmSound.play().catch(() => {});
            addHistory(Math.floor(timeLeft/60) || (isWorkTime ? 25 : 5));
            alert("¡Tiempo terminado!");
            switchMode();
        }
    }, 1000);
});

document.getElementById('pause').addEventListener('click', () => {
    clearInterval(timerId);
    timerId = null;
});

document.getElementById('reset').addEventListener('click', () => {
    clearInterval(timerId);
    timerId = null;
    isWorkTime = true;
    timeLeft = 25 * 60;
    updateDisplay();
});

document.getElementById('set-time').addEventListener('click', () => {
    const val = parseInt(document.getElementById('user-minutes').value);
    if (val > 0) {
        timeLeft = val * 60;
        updateDisplay();
    }
});

document.getElementById('mute').addEventListener('click', (e) => {
    isMuted = !isMuted;
    e.target.textContent = isMuted ? "🔇 Sonido: OFF" : "🔊 Sonido: ON";
});

/* === BOTÓN MODO OSCURO === */
document.getElementById('dark-mode-toggle').addEventListener('click', (e) => {
    body.classList.toggle('dark-mode');
    const isDark = body.classList.contains('dark-mode');
    e.target.textContent = isDark ? "☀️" : "🌙";
    
    // Si quitamos el modo oscuro, devolvemos el color según el estado
    if (!isDark) {
        body.style.backgroundColor = isWorkTime ? "#e74c3c" : "#2ecc71";
    } else {
        body.style.backgroundColor = "#1a1a1a";
    }
});

updateDisplay();