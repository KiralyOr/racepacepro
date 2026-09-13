import { SPLIT_STRATEGIES } from './paceMath';

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
  customValue: '5',
  unit: 'km',
  mode: 'timeFromPace',
  paceSeconds: 300,
  totalSeconds: 1500,
  strategy: 'even',
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
  if (state.strategy !== 'even') params.set('s', state.strategy);
  return params.toString();
};

// Everything here arrives from a URL someone else may have crafted, so each
// field is validated against its own allowed set or numeric range.
export const decodeState = (search) => {
  const params = new URLSearchParams(search || '');
  if (Array.from(params.keys()).length === 0) return null;

  let { selectedKey, customValue } = DEFAULT_STATE;
  const distance = params.get('d');
  if (distance && KEY_BY_SLUG[distance]) {
    selectedKey = KEY_BY_SLUG[distance];
  } else if (distance) {
    const parsed = clamp(distance, 0.01, 100000, null);
    if (parsed !== null) {
      selectedKey = 'custom';
      customValue = String(parsed);
    }
  }

  const strategyId = params.get('s');

  return {
    selectedKey,
    customValue,
    unit: params.get('u') === 'mi' ? 'mi' : 'km',
    mode: params.get('m') === 'time' ? 'paceFromTime' : 'timeFromPace',
    paceSeconds: clamp(params.get('p'), 1, 86400, DEFAULT_STATE.paceSeconds),
    totalSeconds: clamp(params.get('t'), 1, 86400, DEFAULT_STATE.totalSeconds),
    strategy: SPLIT_STRATEGIES.some((s) => s.id === strategyId) ? strategyId : 'even',
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
