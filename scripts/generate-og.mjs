// =========================================================================
// OG 이미지 생성기 — 다크 블루 아트디렉션
// 사용:  npm i --no-save sharp  &&  node scripts/generate-og.mjs
// 결과:  public/og-image.png (1200x630)
// =========================================================================
import sharp from 'sharp'
import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')

// 팔레트
const C = {
  paper:   '#F4F6FB',
  ink:     '#14213D',
  pigment: '#1D4E89',
  accent:  '#E8A33D',
  wash:    '#DCE6F2',
}

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${C.ink}"/>
      <stop offset="1" stop-color="${C.pigment}"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>

  <!-- 청사진 모눈 -->
  <g stroke="${C.wash}" stroke-opacity="0.10" stroke-width="1">
    ${Array.from({ length: 17 }, (_, i) => `<line x1="0" y1="${i*40}" x2="1200" y2="${i*40}"/>`).join('')}
    ${Array.from({ length: 31 }, (_, i) => `<line x1="${i*40}" y1="0" x2="${i*40}" y2="630"/>`).join('')}
  </g>

  <!-- 형광펜 자국 (시그니처) -->
  <rect x="86" y="300" width="430" height="46" rx="6" fill="${C.accent}" opacity="0.92"/>

  <!-- 카피 -->
  <text x="90" y="206" font-family="serif" font-size="40" fill="${C.wash}" opacity="0.85">ONLINE LEARNING</text>
  <text x="86" y="300" font-family="serif" font-weight="700" font-size="82" fill="${C.paper}">오늘 그은 한 줄이,</text>
  <text x="86" y="392" font-family="serif" font-weight="700" font-size="82" fill="${C.paper}">내일의 나를 만든다</text>
  <text x="90" y="470" font-family="sans-serif" font-size="32" fill="${C.wash}" opacity="0.75">배움은 중요한 것에 밑줄을 긋는 일.</text>

  <!-- 브랜드 -->
  <g transform="translate(90, 540)">
    <rect x="0" y="-26" width="34" height="34" rx="8" fill="${C.accent}"/>
    <text x="14" y="0" font-family="serif" font-size="26" font-weight="700" fill="${C.ink}" text-anchor="middle">✎</text>
    <text x="50" y="0" font-family="serif" font-size="30" font-weight="700" fill="${C.paper}">러닝노트</text>
  </g>

  <!-- 성장 곡선 오브제 (우측) -->
  <g transform="translate(870, 150)" opacity="0.95">
    <circle cx="130" cy="170" r="160" fill="${C.wash}" opacity="0.06"/>
    <path d="M40 300 C 90 250, 110 150, 190 90" fill="none" stroke="${C.wash}" stroke-width="5" stroke-linecap="round" stroke-opacity="0.7"/>
    <path d="M190 90 c 14 -36, 50 -42, 70 -28 c -11 30, -46 40, -70 28 z" fill="${C.accent}"/>
    <circle cx="40" cy="300" r="9" fill="${C.wash}"/>
  </g>
</svg>`

const out = resolve(root, 'public/og-image.png')
await sharp(Buffer.from(svg)).png().toFile(out)
console.log('✓ OG 이미지 생성:', out)
