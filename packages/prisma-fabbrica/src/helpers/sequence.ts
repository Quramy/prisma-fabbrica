let sequenceCounterMap: WeakMap<any, number> = new Map();

export function resetSequence() {
  sequenceCounterMap = new Map();
}

export function getSequenceCounter(key: any) {
  const c = sequenceCounterMap.get(key);
  if (c == null) {
    sequenceCounterMap.set(key, 0);
    return 0;
  }
  sequenceCounterMap.set(key, c + 1);
  return c + 1;
}
