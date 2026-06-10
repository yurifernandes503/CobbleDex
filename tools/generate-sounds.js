const fs = require('fs');
const path = require('path');

function createWav(filepath, frequency, durationSec, volume = 0.3) {
  const sampleRate = 22050;
  const numSamples = Math.floor(sampleRate * durationSec);
  const dataSize = numSamples * 2;
  const buffer = Buffer.alloc(44 + dataSize);

  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(1, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * 2, 28);
  buffer.writeUInt16LE(2, 32);
  buffer.writeUInt16LE(16, 34);
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);

  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const attack = Math.min(1, i / 150);
    const release = Math.max(0, 1 - Math.max(0, i - numSamples + 150) / 150);
    const envelope = attack * release;
    const sample = Math.sin(2 * Math.PI * frequency * t) * envelope * volume;
    buffer.writeInt16LE(Math.max(-32768, Math.min(32767, Math.floor(sample * 32767))), 44 + i * 2);
  }

  fs.writeFileSync(filepath, buffer);
}

const dir = path.join(__dirname, '../assets/sounds');
fs.mkdirSync(dir, { recursive: true });
createWav(path.join(dir, 'tap.wav'), 920, 0.05, 0.22);
createWav(path.join(dir, 'select.wav'), 1240, 0.07, 0.28);
createWav(path.join(dir, 'favorite.wav'), 740, 0.1, 0.32);
createWav(path.join(dir, 'success.wav'), 520, 0.14, 0.26);
console.log('Generated sounds in assets/sounds/');
