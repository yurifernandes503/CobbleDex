/**
 * Generates a simple 1024x1024 CobbleDex app icon (dark + cyan accent).
 * Run: node tools/generate-icon.js
 */
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const SIZE = 1024;

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i];
    for (let k = 0; k < 8; k++) c = c & 1 ? (0xedb88320 ^ (c >>> 1)) : c >>> 1;
  }
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const body = Buffer.concat([Buffer.from(type), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body), 0);
  return Buffer.concat([len, body, crc]);
}

function createPng(filepath) {
  const raw = Buffer.alloc((SIZE * 4 + 1) * SIZE);
  const bg = [10, 14, 23];
  const accent = [0, 229, 255];
  const card = [22, 31, 53];

  for (let y = 0; y < SIZE; y++) {
    const row = y * (SIZE * 4 + 1) + 1;
    raw[row - 1] = 0;
    for (let x = 0; x < SIZE; x++) {
      const i = row + x * 4;
      const cx = SIZE / 2;
      const cy = SIZE / 2;
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const rOuter = SIZE * 0.38;
      const rInner = SIZE * 0.12;

      let r = bg[0];
      let g = bg[1];
      let b = bg[2];

      if (dist < rOuter && dist > rInner) {
        const t = (dist - rInner) / (rOuter - rInner);
        r = Math.round(card[0] * (1 - t) + accent[0] * t * 0.4);
        g = Math.round(card[1] * (1 - t) + accent[1] * t * 0.4);
        b = Math.round(card[2] * (1 - t) + accent[2] * t * 0.4);
      } else if (dist <= rInner) {
        r = accent[0];
        g = accent[1];
        b = accent[2];
      }

      if (y > cy && Math.abs(dx) < SIZE * 0.42) {
        r = Math.round(r * 0.85 + 255 * 0.15);
        g = Math.round(g * 0.85 + 255 * 0.15);
        b = Math.round(b * 0.85 + 255 * 0.15);
      }

      raw[i] = r;
      raw[i + 1] = g;
      raw[i + 2] = b;
      raw[i + 3] = 255;
    }
  }

  const compressed = zlib.deflateSync(raw, { level: 9 });
  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(SIZE, 0);
  ihdr.writeUInt32BE(SIZE, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  const png = Buffer.concat([
    signature,
    chunk('IHDR', ihdr),
    chunk('IDAT', compressed),
    chunk('IEND', Buffer.alloc(0)),
  ]);

  fs.writeFileSync(filepath, png);
}

const assets = path.join(__dirname, '../assets');
fs.mkdirSync(assets, { recursive: true });
createPng(path.join(assets, 'icon.png'));
fs.copyFileSync(path.join(assets, 'icon.png'), path.join(assets, 'splash-icon.png'));
fs.copyFileSync(path.join(assets, 'icon.png'), path.join(assets, 'adaptive-icon.png'));
fs.copyFileSync(path.join(assets, 'icon.png'), path.join(assets, 'favicon.png'));
console.log('Generated CobbleDex icon assets');
