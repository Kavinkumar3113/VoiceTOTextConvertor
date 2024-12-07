const micButton = document.getElementById('micButton');
const outputArea = document.getElementById('output');
const languageSelect = document.getElementById('language');
const copyButton = document.getElementById('copyButton');

let isListening = false;
let recognition;

if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new SpeechRecognition();

  recognition.continuous = true;
  recognition.interimResults = true;

  recognition.onstart = () => {
    isListening = true;
    micButton.textContent = '🛑 Stop Listening';
    outputArea.value = 'Listening...';
  };

  recognition.onend = () => {
    isListening = false;
    micButton.textContent = '🎤 Start Listening';
    if (outputArea.value === 'Listening...') {
      outputArea.value = 'Click the mic button to start again.';
    }
  };

  recognition.onerror = (event) => {
    console.error('Speech recognition error:', event.error);
    isListening = false;
    micButton.textContent = '🎤 Start Listening';
    outputArea.value = 'An error occurred. Please try again.';
  };

  recognition.onresult = (event) => {
    let transcript = '';
    for (let i = event.resultIndex; i < event.results.length; ++i) {
      transcript += event.results[i][0].transcript;
    }
    outputArea.value = transcript;
  };
} else {
  alert('Sorry, your browser does not support Speech Recognition.');
}

micButton.addEventListener('click', () => {
  if (isListening) {
    recognition.stop();
  } else {
    recognition.lang = languageSelect.value;
    recognition.start();
  }
});

// Copy to clipboard
copyButton.addEventListener('click', () => {
  outputArea.select();
  navigator.clipboard.writeText(outputArea.value).then(() => {
    alert('Text copied to clipboard!');
  }).catch(err => {
    console.error('Failed to copy text:', err);
    alert('Failed to copy text. Please try again.');
  });
});
