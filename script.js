const textContainer = document.getElementById('text-container');
const prompterText = document.getElementById('prompter-text');
const speedInput = document.getElementById('speed');
const fontSizeInput = document.getElementById('fontSize');
const startButton = document.getElementById('startButton');
const mirrorMode = document.getElementById('mirrorMode');
const inputPanel = document.getElementById('input-panel');
const teleprompterInput = document.getElementById('teleprompter-input');

let isRunning = false;
let textHeight = 0;
let currentTransformY = 0; // Speichert die aktuelle Y-Position

// --- Funktionen zur Steuerung ---

function setText() {
    const text = teleprompterInput.value.trim().replace(/\n/g, '<br><br>');
    if (text) {
        prompterText.innerHTML = text;
        inputPanel.style.display = 'none';
        resetPrompter();
    } else {
        alert('Bitte Text eingeben.');
    }
}

function showInputPanel() {
    inputPanel.style.display = 'flex';
}

function resetPrompter() {
    // Stoppt das Scrollen
    textContainer.style.transitionDuration = '0s';
    textContainer.style.transform = 'translateY(0)';
    currentTransformY = 0;
    isRunning = false;
    startButton.textContent = 'Start / Pause';
}

function startPrompter() {
    if (isRunning) return;
    
    // Höhe des gesamten Textblocks neu berechnen
    textHeight = prompterText.offsetHeight; 
    
    // Die Strecke, die gescrollt werden muss (Text-Höhe + 50% der Fensterhöhe oben und unten)
    const scrollDistance = textHeight + window.innerHeight; 

    // Geschwindigkeit aus dem Input holen (ms/Pixel)
    const speedValue = parseInt(speedInput.value); 
    
    // Berechne die gesamte Dauer für die Strecke (scrollDistance * speedValue)
    const durationMs = scrollDistance * speedValue;
    const durationSeconds = durationMs / 1000;

    // Setze die Transition-Dauer
    textContainer.style.transitionDuration = `${durationSeconds}s`;
    
    // Setze die Start-Position (wichtig nach dem Pausieren)
    // Wenn es pausiert war, muss es von der currentTransformY Position starten
    textContainer.style.transform = `translateY(${currentTransformY}px)`; 
    
    // Setze die Ziel-Position: Minus der gesamten Scroll-Distanz
    const targetY = -scrollDistance;

    // Verwende einen kleinen Timeout, um sicherzustellen, dass die Reset-Position angewendet wurde, 
    // bevor die neue Transition startet
    setTimeout(() => {
        textContainer.style.transform = `translateY(${targetY}px)`;
        isRunning = true;
        startButton.textContent = 'Pause';
    }, 50); 
}

function pausePrompter() {
    if (!isRunning) return;
    
    // Stoppe die CSS-Transition sofort
    textContainer.style.transitionDuration = '0s';

    // Lies die aktuelle Position aus (als Matrix)
    const style = window.getComputedStyle(textContainer);
    const matrix = new WebKitCSSMatrix(style.transform);
    
    // Speichere die aktuelle Y-Position 
    currentTransformY = matrix.m42;
    
    // Wende die aktuelle Position hart an, um die Bewegung zu stoppen
    textContainer.style.transform = `translateY(${currentTransformY}px)`;
    
    isRunning = false;
    startButton.textContent = 'Start / Pause';
}

function toggleRunning() {
    if (isRunning) {
        pausePrompter();
    } else {
        startPrompter();
    }
}

function toggleFullScreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
}

// --- Event Listener ---

startButton.addEventListener('click', toggleRunning);
document.getElementById('resetButton').addEventListener('click', resetPrompter);

fontSizeInput.addEventListener('input', () => {
    prompterText.style.fontSize = fontSizeInput.value + 'px';
    // Nach Größenänderung muss die Scroll-Logik neu gestartet werden
    if (isRunning) {
        pausePrompter();
        startPrompter();
    }
});

mirrorMode.addEventListener('change', (e) => {
    if (e.target.value === 'horizontal') {
        prompterText.style.transform = 'scaleX(-1)';
    } else {
        prompterText.style.transform = 'scaleX(1)';
    }
});

// Event, das ausgelöst wird, wenn der Scroll-Vorgang beendet ist
textContainer.addEventListener('transitionend', () => {
    if (isRunning) {
        resetPrompter();
    }
});

// Initialisierung
prompterText.style.fontSize = fontSizeInput.value + 'px';
window.onload = showInputPanel;
