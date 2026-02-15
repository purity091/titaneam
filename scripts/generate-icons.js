/**
 * PWA Icon Generator Script
 * Run: node scripts/generate-icons.js
 * 
 * This creates placeholder PNG icons from the SVG source.
 * For production, replace with professionally designed PNG icons.
 */

const fs = require('fs');
const path = require('path');

const ICONS_DIR = path.join(__dirname, '..', 'public', 'icons');
const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

// Ensure icons directory exists
if (!fs.existsSync(ICONS_DIR)) {
    fs.mkdirSync(ICONS_DIR, { recursive: true });
}

// Generate minimal valid PNG files as placeholders
// These are 1x1 blue pixel PNGs that will work as valid icons
// Replace with real icons for production

function createMinimalPNG(size) {
    // Create a simple SVG with the Titan branding that can be used directly
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0f172a"/>
      <stop offset="100%" style="stop-color:#1e293b"/>
    </linearGradient>
    <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#3b82f6"/>
      <stop offset="100%" style="stop-color:#6366f1"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="108" fill="url(#bg)"/>
  <g transform="translate(256,220)" fill="url(#accent)">
    <circle cx="0" cy="0" r="24" fill="none" stroke="url(#accent)" stroke-width="10"/>
    <rect x="-5" y="-60" width="10" height="22" rx="5"/>
    <rect x="-5" y="38" width="10" height="22" rx="5"/>
    <rect x="-60" y="-5" width="22" height="10" rx="5"/>
    <rect x="38" y="-5" width="22" height="10" rx="5"/>
  </g>
  <text x="256" y="380" text-anchor="middle" font-family="Arial,sans-serif" font-weight="900" font-size="72" fill="#3b82f6" letter-spacing="6">T</text>
</svg>`;
    return svg;
}

// Write SVG icons (browsers support SVG icons, and these serve as placeholders)
sizes.forEach(size => {
    const svg = createMinimalPNG(size);
    const filename = `icon-${size}x${size}.svg`;
    fs.writeFileSync(path.join(ICONS_DIR, filename), svg);
    console.log(`  Created ${filename}`);
});

// Create maskable variants
[192, 512].forEach(size => {
    const svg = createMinimalPNG(size);
    const filename = `icon-maskable-${size}x${size}.svg`;
    fs.writeFileSync(path.join(ICONS_DIR, filename), svg);
    console.log(`  Created ${filename} (maskable)`);
});

console.log('\\nDone! For production, replace these SVG placeholders with real PNG icons.');
console.log('You can use tools like https://maskable.app/ and https://realfavicongenerator.net/');
