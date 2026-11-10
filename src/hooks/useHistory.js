import { useCallback, useRef, useState } from 'react';

// Menyimpan snapshot (ImageData) untuk undo / redo.
export default function useHistory(limit = 40) {
  const stack = useRef([]);
  const idx = useRef(-1);
  const [flags, setFlags] = useState({ canUndo: false, canRedo: false });

  const sync = () =>
    setFlags({
      canUndo: idx.current > 0,
      canRedo: idx.current < stack.current.length - 1,
    });

  const reset = useCallback((snap) => {
    stack.current = [snap];
    idx.current = 0;
    sync();
  }, []);

  const push = useCallback((snap) => {
    stack.current = stack.current.slice(0, idx.current + 1);
    stack.current.push(snap);
    if (stack.current.length > limit) stack.current.shift();
    idx.current = stack.current.length - 1;
    sync();
  }, [limit]);

  const undo = useCallback(() => {
    if (idx.current <= 0) return null;
    idx.current -= 1;
    sync();
    return stack.current[idx.current];
  }, []);

  const redo = useCallback(() => {
    if (idx.current >= stack.current.length - 1) return null;
    idx.current += 1;
    sync();
    return stack.current[idx.current];
  }, []);

  return { push, undo, redo, reset, ...flags };
}
