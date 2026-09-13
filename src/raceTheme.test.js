import { MARATHONS } from './marathons';
import {
  TARGET_CONTRAST,
  contrastWithWhite,
  hslToRgb,
  lightnessFor,
  relativeLuminance,
  themeFor,
  themeForIndex,
  toHex,
} from './raceTheme';

describe('colour helpers', () => {
  test('hslToRgb hits known corners', () => {
    expect(hslToRgb(0, 100, 50)).toEqual([255, 0, 0]);
    expect(hslToRgb(120, 100, 50)).toEqual([0, 255, 0]);
    expect(hslToRgb(240, 100, 50)).toEqual([0, 0, 255]);
    expect(hslToRgb(0, 0, 100)).toEqual([255, 255, 255]);
  });

  test('luminance and contrast agree with the WCAG extremes', () => {
    expect(relativeLuminance([255, 255, 255])).toBeCloseTo(1, 5);
    expect(relativeLuminance([0, 0, 0])).toBeCloseTo(0, 5);
    expect(contrastWithWhite([0, 0, 0])).toBeCloseTo(21, 1);
    expect(contrastWithWhite([255, 255, 255])).toBeCloseTo(1, 2);
  });

  test('toHex pads single digit channels', () => {
    expect(toHex([0, 17, 255])).toBe('#0011ff');
  });
});

describe('race themes', () => {
  const themes = MARATHONS.map((race, i) => ({ race, theme: themeForIndex(i) }));

  // The reason lightness is computed rather than fixed. A single lightness
  // value passes for blue and fails badly for yellow, because luminance varies
  // enormously with hue. This asserts every race is legible, not most of them.
  test('white text clears the contrast target on every race', () => {
    themes.forEach(({ race, theme }) => {
      expect({ id: race.id, contrast: theme.contrast >= TARGET_CONTRAST }).toEqual({
        id: race.id,
        contrast: true,
      });
    });
  });

  test('the deeper gradient stop is at least as dark as the base', () => {
    themes.forEach(({ theme }) => {
      const lum = (hex) =>
        relativeLuminance([1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16)));
      expect(lum(theme.deep)).toBeLessThanOrEqual(lum(theme.base));
    });
  });

  test('lightnessFor solves for the hue rather than returning a constant', () => {
    // Yellow is far more luminous than blue, so it has to be taken darker.
    expect(lightnessFor(60)).toBeLessThan(lightnessFor(240));
  });

  test('every race gets a colour and no two adjacent races share a hue', () => {
    const hues = themes.map((t) => t.theme.hue);
    expect(new Set(hues).size).toBe(hues.length);
    hues.slice(1).forEach((hue, i) => {
      const gap = Math.abs(hue - hues[i]);
      expect(Math.min(gap, 360 - gap)).toBeGreaterThan(40);
    });
  });

  test('themes are stable for a race and lookup misses cleanly', () => {
    expect(themeFor(MARATHONS, 'berlin')).toEqual(themeForIndex(0));
    expect(themeFor(MARATHONS, 'atlantis')).toBeNull();
  });

  test('motif is one of the four decorative variants', () => {
    themes.forEach(({ theme }) => expect([0, 1, 2, 3]).toContain(theme.motif));
  });
});

// Yellow and yellow-green have to be taken so dark to carry white text that
// what is left is khaki. Skipping the band is why the palette holds up as
// races are added without anyone choosing a colour.
describe('the khaki band', () => {
  test('no race lands in it', () => {
    MARATHONS.forEach((race, i) => {
      const { hue } = themeForIndex(i);
      expect({ id: race.id, khaki: hue >= 50 && hue <= 100 }).toEqual({
        id: race.id,
        khaki: false,
      });
    });
  });

  test('holds for far more races than currently exist', () => {
    for (let i = 0; i < 200; i += 1) {
      const { hue } = themeForIndex(i);
      expect(hue >= 50 && hue <= 100).toBe(false);
    }
  });
});

// Share images are committed rather than generated during the build, because
// rendering 22 images needs a headless browser and that does not belong in the
// deploy path. The tradeoff is that they can go stale, so this is the guard:
// add a race without running scripts/generate-og-images.js and the suite fails.
describe('share images', () => {
  const fs = require('fs');
  const path = require('path');
  const dir = path.join(__dirname, '..', 'public', 'og', 'marathons');

  test('every race has one', () => {
    MARATHONS.forEach((race) => {
      expect({ id: race.id, exists: fs.existsSync(path.join(dir, `${race.id}.jpg`)) }).toEqual({
        id: race.id,
        exists: true,
      });
    });
  });

  test('none is empty, and none is heavy enough to slow a share preview', () => {
    MARATHONS.forEach((race) => {
      const kb = fs.statSync(path.join(dir, `${race.id}.jpg`)).size / 1024;
      expect(kb).toBeGreaterThan(5);
      expect({ id: race.id, kb: kb < 150 }).toEqual({ id: race.id, kb: true });
    });
  });

  test('no orphans left behind by a renamed or removed race', () => {
    const ids = new Set(MARATHONS.map((r) => r.id));
    fs.readdirSync(dir).forEach((file) => {
      expect({ file, known: ids.has(file.replace(/\.jpg$/, '')) }).toEqual({ file, known: true });
    });
  });
});
