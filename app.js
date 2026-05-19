const inputText = document.getElementById('inputText');
const outputText = document.getElementById('outputText');
const sourceLang = document.getElementById('sourceLang');
const targetLang = document.getElementById('targetLang');
const statusText = document.getElementById('status');
const translateButton = document.getElementById('translateButton');

function setStatus(message) {
  statusText.textContent = message;
}

async function translateText() {
  const text = inputText.value.trim();

  if (!text) {
    outputText.value = '';
    setStatus('Digite um texto primeiro');
    return;
  }

  setStatus('Traduzindo...');
  translateButton.disabled = true;

  try {
    const source = sourceLang.value === 'auto' ? 'auto' : sourceLang.value;
    const target = targetLang.value;
    const url = 'https://api.mymemory.translated.net/get?q=' + encodeURIComponent(text) + '&langpair=' + source + '|' + target;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('Falha na traducao');
    }

    const data = await response.json();
    outputText.value = data.responseData.translatedText || 'Nao foi possivel traduzir.';
    setStatus('Concluido');
  } catch (error) {
    outputText.value = '';
    setStatus('Erro ao traduzir. Tente novamente.');
  } finally {
    translateButton.disabled = false;
  }
}

function speak(text, lang) {
  const value = text.trim();
  if (!value || !('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(value);
  utterance.lang = lang === 'auto' ? 'pt-BR' : lang;
  window.speechSynthesis.speak(utterance);
}

document.getElementById('clearInput').addEventListener('click', () => {
  inputText.value = '';
  outputText.value = '';
  setStatus('Pronto');
});

document.getElementById('copyOutput').addEventListener('click', async () => {
  if (!outputText.value) return;
  await navigator.clipboard.writeText(outputText.value);
  setStatus('Copiado');
});

document.getElementById('speakInput').addEventListener('click', () => speak(inputText.value, sourceLang.value));
document.getElementById('speakOutput').addEventListener('click', () => speak(outputText.value, targetLang.value));
translateButton.addEventListener('click', translateText);

inputText.addEventListener('keydown', (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
    translateText();
  }
});

document.getElementById('swapLanguages').addEventListener('click', () => {
  if (sourceLang.value === 'auto') sourceLang.value = 'pt';
  const oldSource = sourceLang.value;
  sourceLang.value = targetLang.value;
  targetLang.value = oldSource;
  const oldInput = inputText.value;
  inputText.value = outputText.value;
  outputText.value = oldInput;
});
