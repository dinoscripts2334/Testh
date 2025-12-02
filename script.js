const textContainer = document.getElementById('text-container');
const prompterText = document.getElementById('prompter-text');
const speedInput = document.getElementById('speed');
const fontSizeInput = document.getElementById('fontSize');
const startButton = document.getElementById('startButton');
const mirrorMode = document.getElementById('mirrorMode');
const inputPanel = document.getElementById('input-panel');
const teleprompterInput = document.getElementById('teleprompter-input');

let isRunning = false;
let currentTransformY = 0;

function setupReadingGuide() {
    const guide = document.createElement('div');
    guide.id = 'reading-guide';
    document.body.appendChild(guide);
}

window.onload = function() {
    setupReadingGuide();
    showInputPanel();
    prompterText.style.fontSize = fontSizeInput.value + 'px';
};

function setText() {
    const rawText = teleprompterInput.value;
    const cleanText = rawText.trim().replace(/\n/g, '<br><br>');
    
    if (cleanText) {
        prompterText.innerHTML = cleanText;
        inputPanel.style.display = 'none';
        resetPrompter();
    } else {
        alert('Kein Skript eingegeben. Bitte füge Text hinzu.');
    }
}

function showInputPanel() {
    inputPanel.style.display = 'flex';
}

function resetPrompter() {
    textContainer.style.transitionDuration = '0s';
    textContainer.style.transform = 'translateY(0)';
    currentTransformY = 0;
    isRunning = false;
    startButton.textContent = 'Start / Pause';
}

function startPrompter() {
    if (isRunning) return;
    
    const textHeight = prompterText.offsetHeight; 
    const scrollDistance = textHeight + window.innerHeight; 

    const speedValue = parseInt(speedInput.value); 
    const durationMs = scrollDistance * speedValue;
    const durationSeconds = durationMs / 1000;

    const targetY = -scrollDistance;

    textContainer.style.transitionDuration = '0s';
    textContainer.style.transform = `translateY(${currentTransformY}px)`;
    
    setTimeout(() => {
        textContainer.style.transitionDuration = `${durationSeconds}s`;
        textContainer.style.transform = `translateY(${targetY}px)`;
        isRunning = true;
        startButton.textContent = 'Pause';
    }, 50); 
}

function pausePrompter() {
    if (!isRunning) return;
    
    textContainer.style.transitionDuration = '0s';

    const style = window.getComputedStyle(textContainer);
    const matrix = new WebKitCSSMatrix(style.transform);
    
    currentTransformY = matrix.m42;
    textContainer.style.transform = `translateY(${currentTransformY}px)`;
    
    isRunning = false;
    startButton.textContent = 'Start / Pause';
}

startButton.addEventListener('click', toggleRunning);
document.getElementById('resetButton').addEventListener('click', resetPrompter);

fontSizeInput.addEventListener('input', () => {
    prompterText.style.fontSize = fontSizeInput.value + 'px';
    if (isRunning) {
        pausePrompter();
        startPrompter();
    }
});
mirrorMode.addEventListener('change', (e) => {
    prompterText.style.transform = (e.target.value === 'horizontal') ? 'scaleX(-1)' : 'scaleX(1)';
});
textContainer.addEventListener('transitionend', () => {
    if (isRunning) {
        resetPrompter();
    }
});

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
