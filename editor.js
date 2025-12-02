document.addEventListener('DOMContentLoaded', () => {
    // 1. Element-Selektoren
    const linksContainer = document.getElementById('links-container');
    const editorPanel = document.getElementById('design-editor-panel');
    const openEditorButton = document.getElementById('open-editor-button');
    const closeEditorButton = document.getElementById('close-editor-button');
    const styleControls = editorPanel.querySelectorAll('[data-css-var]');

    const STORAGE_KEY = 'cheffeDesign';

    // 2. Simulierte Profildaten (ersetzt später die API-Antwort)
    const profileData = {
        username: "Cheffe",
        links: [
            { title: "🎬 Mein YouTube-Kanal", url: "https://youtube.com/cheffe" },
            { title: "🔗 Mein neuestes Projekt", url: "https://projekt.com/neu" },
            { title: "✉️ Kontakt per E-Mail", url: "mailto:cheffe@luperly.bio" }
        ],
        defaultDesign: {
            '--bg-color': '#0a0a0a',
            '--link-color': '#ffffff',
            '--link-bg': '#007bff',
            '--main-font': 'Arial, sans-serif'
        }
    };

    // --- Funktionen ---

    // Erstellt die Link-Buttons
    function renderLinks() {
        linksContainer.innerHTML = profileData.links.map(link => `
            <a href="${link.url}" target="_blank" class="profile-link">${link.title}</a>
        `).join('');
    }

    // Lädt gespeichertes Design und wendet es an
    function loadAndApplyDesign() {
        // Versuche, das gespeicherte Design zu laden
        const storedDesignJson = localStorage.getItem(STORAGE_KEY);
        const activeDesign = storedDesignJson ? JSON.parse(storedDesignJson) : profileData.defaultDesign;

        // Wende alle gespeicherten CSS-Variablen an
        for (const [key, value] of Object.entries(activeDesign)) {
            document.documentElement.style.setProperty(key, value);
            
            // Setze die Werte in den Editor-Inputs
            const inputElement = document.querySelector(`[data-css-var="${key}"]`);
            if (inputElement) {
                inputElement.value = value;
            }
        }
    }

    // Speichert das aktuelle Design und wendet es an
    function saveAndApplyDesign() {
        const newDesign = {};
        
        // Durchläuft alle Controls, liest den Wert und speichert ihn
        styleControls.forEach(control => {
            const cssVar = control.getAttribute('data-css-var');
            const value = control.value;
            
            newDesign[cssVar] = value;
            document.documentElement.style.setProperty(cssVar, value);
        });

        // Speichert das neue Design im lokalen Speicher
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newDesign));
        alert('Design gespeichert!');
    }

    // --- Event Listener ---

    // Editor öffnen
    openEditorButton.addEventListener('click', () => {
        editorPanel.style.display = 'block';
    });

    // Editor schließen und speichern
    closeEditorButton.addEventListener('click', () => {
        saveAndApplyDesign();
        editorPanel.style.display = 'none';
    });

    // Live-Update beim Ändern der Controls
    styleControls.forEach(control => {
        control.addEventListener('input', (event) => {
            const cssVar = event.target.getAttribute('data-css-var');
            const value = event.target.value;
            document.documentElement.style.setProperty(cssVar, value);
        });
    });

    // Initialisierung beim Laden
    renderLinks();
    loadAndApplyDesign();
});
