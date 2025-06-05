const textarea = document.querySelector("textarea");
const voiceSelect = document.querySelector("select");
const speakBtn = document.getElementById("speakBtn");
const pitchControl = document.getElementById("pitch");
const rateControl = document.getElementById("rate");
const pauseBtn = document.getElementById("pauseBtn");
const resumeBtn = document.getElementById("resumeBtn");
const stopBtn = document.getElementById("stopBtn");
const startRecBtn = document.getElementById("startRecBtn");
const pauseRecBtn = document.getElementById("pauseRecBtn");
const resumeRecBtn = document.getElementById("resumeRecBtn");
const stopRecBtn = document.getElementById("stopRecBtn");
const clearBtn = document.getElementById("clearBtn");
const toggleModeBtn = document.getElementById("toggleModeBtn");
const mainTitle = document.getElementById("mainTitle");

const utterance = new SpeechSynthesisUtterance();
let voices = [];
let currentMode = "tts";

function loadVoices() {
  voices = speechSynthesis.getVoices();

  if (!voices.length) return;

  const supportedLanguages = {
    "en-US": "English (US)",
    "hi-IN": "Hindi (India)",
    "fr-FR": "French (France)",
    "es-ES": "Spanish (Spain)"
  };

  voiceSelect.innerHTML = "";

  voices.forEach((voice, index) => {
    if (Object.keys(supportedLanguages).includes(voice.lang)) {
      const option = document.createElement("option");
      option.value = index;
      option.textContent = `${supportedLanguages[voice.lang]} - ${voice.name}`;
      voiceSelect.appendChild(option);
    }
  });

  if (voiceSelect.options.length > 0) {
    utterance.voice = voices[voiceSelect.value];
    utterance.lang = utterance.voice.lang;
  }
}
speechSynthesis.onvoiceschanged = loadVoices;
loadVoices();

speakBtn.addEventListener("click", () => {
  const text = textarea.value.trim();
  if (!text) return;
  speechSynthesis.cancel();
  utterance.text = text;
  utterance.voice = voices[voiceSelect.value];
  utterance.lang = utterance.voice.lang;
  utterance.pitch = parseFloat(pitchControl.value);
  utterance.rate = parseFloat(rateControl.value);
  speechSynthesis.speak(utterance);
});

pauseBtn.addEventListener("click", () => speechSynthesis.pause());
resumeBtn.addEventListener("click", () => speechSynthesis.resume());
stopBtn.addEventListener("click", () => speechSynthesis.cancel());
clearBtn.addEventListener("click", () => {
  textarea.value = "";
});

const recognition = window.SpeechRecognition || window.webkitSpeechRecognition
  ? new (window.SpeechRecognition || window.webkitSpeechRecognition)()
  : null;

let recognitionActive = false;

if (recognition) {
  recognition.continuous = false;
  recognition.lang = "en-US";
  recognition.interimResults = false;

  startRecBtn.addEventListener("click", () => {
    recognition.start();
    recognitionActive = true;
    startRecBtn.textContent = "🎙️ Listening...";
  });

  stopRecBtn.addEventListener("click", () => {
    recognition.stop();
    recognitionActive = false;
    startRecBtn.textContent = "🎙️ Start Speech to Text";
  });

  pauseRecBtn.addEventListener("click", () => {
    if (recognitionActive) {
      recognition.stop();
      recognitionActive = false;
      startRecBtn.textContent = "🎙️ Resume Listening";
    }
  });

  resumeRecBtn.addEventListener("click", () => {
    if (!recognitionActive) {
      recognition.start();
      recognitionActive = true;
      startRecBtn.textContent = "🎙️ Listening...";
    }
  });

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    textarea.value += (textarea.value ? " " : "") + transcript;
    startRecBtn.textContent = "🎙️ Start Speech to Text";
  };

  recognition.onerror = (event) => {
    alert("Speech recognition error: " + event.error);
    startRecBtn.textContent = "🎙️ Start Speech to Text";
  };
} else {
  alert("Speech Recognition not supported in this browser.");
}

toggleModeBtn.addEventListener("click", () => {
  if (currentMode === "tts") {
    currentMode = "stt";
    mainTitle.innerHTML = "Voice to Text <span>Converter</span>";
    toggleModeBtn.textContent = "🔊 Switch to Text to Voice";
    textarea.placeholder = "Speak something, it will appear here...";
    textarea.value = "";
    document.querySelectorAll(".tts-only").forEach(el => el.classList.add("hidden"));
    document.querySelectorAll(".stt-only").forEach(el => el.classList.remove("hidden"));
  } else {
    currentMode = "tts";
    mainTitle.innerHTML = "Text to Voice <span>Converter</span>";
    toggleModeBtn.textContent = "🎙️ Switch to Voice to Text";
    textarea.placeholder = "Write anything here...";
    textarea.value = "";
    document.querySelectorAll(".stt-only").forEach(el => el.classList.add("hidden"));
    document.querySelectorAll(".tts-only").forEach(el => el.classList.remove("hidden"));
  }
});
