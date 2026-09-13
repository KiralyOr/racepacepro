import { clampNegativeSplitPct, unitToKm } from './paceMath';

const STORAGE_KEY = 'racepacepro:last';

const SLUG_BY_KEY = {
  '5K': '5k',
  '10K': '10k',
  'Half Marathon': 'half',
  Marathon: 'marathon',
};
const KEY_BY_SLUG = Object.fromEntries(
  Object.entries(SLUG_BY_KEY).map(([key, slug]) => [slug, key])
);

export const DEFAULT_STATE = {
  selectedKey: '5K',
  // customValue is what the field shows, in the unit on screen; customKm is the
  // same distance in kilometres and is the value a unit switch converts from.
  // Deriving the display from the rounded display would compound error on every
  // switch (10 km -> 6.21 mi -> 9.99 km).
  customValue: '5',
  customKm: 5,
  unit: 'km',
  mode: 'timeFromPace',
  paceSeconds: 300,
  totalSeconds: 1500,
  negativeSplitPct: 0,
};

const clamp = (raw, min, max, fallback) => {
  const value = Number(raw);
  return Number.isFinite(value) && value >= min && value <= max ? value : fallback;
};

export const encodeState = (state) => {
  const params = new URLSearchParams();
  params.set(
    'd',
    state.selectedKey === 'custom' ? String(state.customValue) : SLUG_BY_KEY[state.selectedKey]
  );
  params.set('u', state.unit);
  if (state.mode === 'timeFromPace') {
    params.set('m', 'pace');
    params.set('p', String(Math.round(state.paceSeconds)));
  } else {
    params.set('m', 'time');
    params.set('t', String(Math.round(state.totalSeconds)));
  }
  if (state.negativeSplitPct > 0) params.set('s', String(state.negativeSplitPct));
  return params.toString();
};

// Everything here arrives from a URL someone else may have crafted, so each
// field is validated against its own allowed set or numeric range.
export const decodeState = (search) => {
  const params = new URLSearchParams(search || '');
  if (Array.from(params.keys()).length === 0) return null;

  const unit = params.get('u') === 'mi' ? 'mi' : 'km';

  let { selectedKey, customValue, customKm } = DEFAULT_STATE;
  const distance = params.get('d');
  if (distance && KEY_BY_SLUG[distance]) {
    selectedKey = KEY_BY_SLUG[distance];
  } else if (distance) {
    const parsed = clamp(distance, 0.01, 100000, null);
    if (parsed !== null) {
      selectedKey = 'custom';
      customValue = String(parsed);
      customKm = unitToKm(parsed, unit);
    }
  }

  return {
    selectedKey,
    customValue,
    customKm,
    unit,
    mode: params.get('m') === 'time' ? 'paceFromTime' : 'timeFromPace',
    paceSeconds: clamp(params.get('p'), 1, 86400, DEFAULT_STATE.paceSeconds),
    totalSeconds: clamp(params.get('t'), 1, 86400, DEFAULT_STATE.totalSeconds),
    negativeSplitPct: clampNegativeSplitPct(params.get('s')),
  };
};

const readStored = () => {
  try {
    return decodeState(window.localStorage.getItem(STORAGE_KEY));
  } catch {
    return null;
  }
};

export const initialState = () => {
  if (typeof window === 'undefined') return DEFAULT_STATE;
  return decodeState(window.location.search) || readStored() || DEFAULT_STATE;
};

export const persist = (query) => {
  try {
    window.localStorage.setItem(STORAGE_KEY, query);
  } catch {
    // Private browsing or blocked storage; the URL still carries the state.
  }
  try {
    window.history.replaceState(null, '', `?${query}`);
  } catch {
    // Non-browser or restricted history; nothing else depends on this.
  }
};

export const shareUrl = (query) =>
  `${window.location.origin}${window.location.pathname}?${query}`;
