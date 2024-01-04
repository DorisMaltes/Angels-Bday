// Pedir permiso para usar el micrófono
navigator.mediaDevices.getUserMedia({ audio: true, video: false })
  .then(handleAudioStream)
  .catch(err => console.error('Error al acceder al micrófono:', err));

function handleAudioStream(stream) {
  const audioContext = new AudioContext();
  const analyser = audioContext.createAnalyser();
  const microphone = audioContext.createMediaStreamSource(stream);
  microphone.connect(analyser);
  analyser.fftSize = 512;
  
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);

  function checkForBlow() {
    analyser.getByteFrequencyData(dataArray);
    let sum = 0;
    for(let i = 0; i < bufferLength; i++) {
      sum += dataArray[i];
    }
    let average = sum / bufferLength;

    // Si el volumen promedio supera un cierto umbral, "apaga" las velas
    if (average > 50) { // Puedes ajustar este valor según sea necesario
      blowOutCandles();
    }

    requestAnimationFrame(checkForBlow);
  }
  checkForBlow();
}

function blowOutCandles() {
    // Apagar las "estrellitas"
    const smallFlames = document.querySelectorAll('.flame .one, .flame .two, .flame .three');
    smallFlames.forEach(flame => {
      flame.style.opacity = '0';
      flame.style.animation = 'none';
      flame.style.textShadow = 'none';
    });
  
    // Apagar la llama principal agregando la clase 'out'
    const candle = document.querySelector('.candle');
    candle.classList.add('out');
  }
  
