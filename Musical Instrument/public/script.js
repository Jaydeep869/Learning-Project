const audioCtx = new (window.AudioContext)();

document.addEventListener('click', function initaudio() {
  audioCtx.resume();
  document.removeEventListener('click', initaudio);
});

const instrumentDest = audioCtx.createMediaStreamDestination();
let micStream = null;

navigator.mediaDevices.getUserMedia({ audio: true })
  .then(stream => { micStream = stream; })
  .catch(err => console.warn('Mic unavailable:', err));

const instruments = {
    drums: ["kick","snare","hihat","tom","clap","crash","ride"],
  piano: ["C","D","E","F","G","A","B"],
  guitar: ["E","F","G","A","B","C","D"]
};
const keyMap = { a:0, s:1, d:2, f:3, g:4, h:5, j:6 };
let currentInst = 'drums';

function renderInstrument(inst) {
  const container = document.getElementById('instrument-container');
  container.setAttribute('data-instrument', inst);
  container.innerHTML = '';
  instruments[inst].forEach(note => {
    const btn = document.createElement('div');
    btn.className = 'key';
    btn.textContent = note;
    btn.dataset.note = note;
    btn.onclick = () => playNote(inst, note, btn);
    container.appendChild(btn);
  });
}
function playNote(inst, note, btnEl) {
  const audio = new Audio(`sounds/${inst}/${note}.mp3`);
  const src = audioCtx.createMediaElementSource(audio);
  src.connect(audioCtx.destination);    
  src.connect(instrumentDest);          
  audio.play();
  btnEl.classList.add('active');
  setTimeout(() => btnEl.classList.remove('active'), 100);
}
window.addEventListener('keydown', e => {
  if (e.key in keyMap) {
    const idx = keyMap[e.key];
    const note = instruments[currentInst][idx];
    const btn = document.querySelector(`.key[data-note="${note}"]`);
    if (btn) playNote(currentInst, note, btn);
  }
});
document.getElementById('instrument-select')
  .addEventListener('change', e => {
    currentInst = e.target.value;
    renderInstrument(currentInst);
  });

let recorder, chunks = [];
let recordingStartTime;
let timerInterval;

function updateTimer() {
  const currentTime = Date.now();
  const elapsed = Math.floor((currentTime - recordingStartTime) / 1000);
  const minutes = String(Math.floor(elapsed / 60)).padStart(2, '0');
  const seconds = String(elapsed % 60).padStart(2, '0');
  document.querySelector('.timer').textContent = `${minutes}:${seconds}`;
}

function startRecording() {
  const mode = document.querySelector('input[name=mode]:checked').value;
  const stream = (mode === 'instrument') ? instrumentDest.stream : micStream;
  if (!stream) return alert('No audio available for recording.');
  recorder = new MediaRecorder(stream);
  chunks = [];
  recorder.ondataavailable = e => chunks.push(e.data);
  recorder.onstop = () => {
    const blob = new Blob(chunks, { type: 'audio/webm' });
    const url = URL.createObjectURL(blob);
    const dl = document.getElementById('download');
    dl.href = url;
    dl.classList.remove('disabled');
  };
  recorder.start();
  recordingStartTime = Date.now();
  document.querySelector('.timer').style.display = 'block';
  document.querySelector('.recording-indicator').style.display = 'block';
  timerInterval = setInterval(updateTimer, 1000);
  document.getElementById('record').disabled = true;
}

function stopRecording() {
  if (recorder && recorder.state === 'recording') recorder.stop();
  document.getElementById('stop').disabled = true;
  clearInterval(timerInterval);
  document.querySelector('.timer').style.display = 'none';
  document.querySelector('.recording-indicator').style.display = 'none';
  document.getElementById('record').disabled = false;
  document.querySelector('.timer').textContent = '00:00';
}

document.getElementById('download').addEventListener('click', function(e) {
  if (this.classList.contains('disabled')) {
    e.preventDefault();
  }
});

document.getElementById('record').onclick = () => {
  startRecording();
  document.getElementById('stop').disabled = false;
};
document.getElementById('stop').onclick = stopRecording;

renderInstrument(currentInst);

function toggleTheme() {
  const body = document.body;
  const currentTheme = body.getAttribute('data-theme');
  body.setAttribute('data-theme', currentTheme === 'light' ? 'dark' : 'light');
  localStorage.setItem('theme', currentTheme === 'light' ? 'dark' : 'light');
}

const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
  document.body.setAttribute('data-theme', savedTheme);
}
