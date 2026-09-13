// A distinct visual identity per race, generated rather than photographed.
//
// Photographs of cities are copyrighted, heavy enough to hurt the page speed
// these pages currently enjoy, and need dimming so far to keep text legible
// that they end up as texture anyway. This gives each race its own colour and
// motif for about two kilobytes, inline, with no extra request.
//
// The motif is deliberately abstract: concentric arcs, not a line chart. This
// project has no verified elevation data for these courses, and a decorative
// squiggle that a reader could mistake for a course profile would be exactly
// the kind of invented fact the marathon pages are written to avoid.

const clamp01 = (n) => Math.min(1, Math.max(0, n));

// HSL to RGB, each channel 0-255.
export const hslToRgb = (h, s, l) => {
  const sat = s / 100;
  const lig = l / 100;
  const c = (1 - Math.abs(2 * lig - 1)) * sat;
  const hp = ((h % 360) + 360) % 360 / 60;
  const x = c * (1 - Math.abs((hp % 2) - 1));
  const [r, g, b] = hp < 1 ? [c, x, 0]
    : hp < 2 ? [x, c, 0]
    : hp < 3 ? [0, c, x]
    : hp < 4 ? [0, x, c]
    : hp < 5 ? [x, 0, c]
    : [c, 0, x];
  const m = lig - c / 2;
  return [r, g, b].map((v) => Math.round(clamp01(v + m) * 255));
};

export const toHex = ([r, g, b]) =>
  `#${[r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('')}`;

// WCAG relative luminance and contrast ratio.
export const relativeLuminance = ([r, g, b]) => {
  const channel = (v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
};

export const contrastWithWhite = (rgb) => 1.05 / (relativeLuminance(rgb) + 0.05);

// White body text sits on these, so contrast is solved rather than guessed.
// Lightness at a fixed value would pass for blue and fail for yellow, because
// luminance varies enormously with hue. Instead the lightness is walked down
// until the ratio clears the target, which makes every race legible by
// construction rather than by whichever hues happened to be picked.
export const TARGET_CONTRAST = 5;
const SATURATION = 52;

export const lightnessFor = (hue, target = TARGET_CONTRAST) => {
  for (let l = 46; l >= 12; l -= 1) {
    if (contrastWithWhite(hslToRgb(hue, SATURATION, l)) >= target) return l;
  }
  return 12;
};

// Hues are spread by index rather than picked, so adding a race never means
// choosing a colour by hand. Two adjustments make that automatic choice a
// good one:
//
// The yellow to yellow-green band is skipped entirely. Those hues have to be
// taken very dark to carry white text, and what survives is khaki. Four races
// landed there before this, and none of them looked deliberate. The wheel is
// therefore 300 degrees wide, starting past the band.
//
// The step is coprime with that range, so consecutive races in the list land
// far apart on the wheel instead of drifting slowly through one family.
const HUE_BAND_START = 105;
const HUE_BAND_WIDTH = 300;
const HUE_STEP = 137;
const HUE_OFFSET = 100;

export const hueForIndex = (index) =>
  ((HUE_OFFSET + index * HUE_STEP) % HUE_BAND_WIDTH + HUE_BAND_START) % 360;

export const themeForIndex = (index) => {
  const hue = hueForIndex(index);
  const l = lightnessFor(hue);
  const base = hslToRgb(hue, SATURATION, l);
  const deep = hslToRgb(hue, SATURATION + 6, Math.max(8, l - 13));
  return {
    hue,
    base: toHex(base),
    deep: toHex(deep),
    contrast: Number(contrastWithWhite(base).toFixed(2)),
    // Four abstract motif variants, chosen by index so a race always renders
    // the same way. Purely decorative: arcs and dots, never a line that could
    // be read as an elevation profile.
    motif: index % 4,
  };
};

export const themeFor = (races, raceId) => {
  const index = races.findIndex((race) => race.id === raceId);
  return index === -1 ? null : themeForIndex(index);
};
