import { useCallback, useEffect, useReducer } from 'react'
import type { SceneDef } from './types'

type State = { scene: number; step: number }
type Action =
  | { type: 'next' }
  | { type: 'prevStep' }
  | { type: 'prevScene' }
  | { type: 'goto'; scene: number; step?: number | 'last' }

const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n))

function makeReducer(scenes: SceneDef[]) {
  const last = scenes.length - 1
  const lastStep = (s: number) => scenes[s].steps - 1
  return (st: State, a: Action): State => {
    switch (a.type) {
      case 'next':
        if (st.step < lastStep(st.scene)) return { ...st, step: st.step + 1 }
        if (st.scene < last) return { scene: st.scene + 1, step: 0 }
        return st
      case 'prevStep':
        if (st.step > 0) return { ...st, step: st.step - 1 }
        if (st.scene > 0) return { scene: st.scene - 1, step: lastStep(st.scene - 1) }
        return st
      case 'prevScene':
        // Land on the previous scene's final state: everything visible.
        if (st.scene > 0) return { scene: st.scene - 1, step: lastStep(st.scene - 1) }
        return { scene: 0, step: 0 }
      case 'goto': {
        const scene = clamp(a.scene, 0, last)
        const step = a.step === 'last' ? lastStep(scene) : clamp(a.step ?? 0, 0, lastStep(scene))
        return { scene, step }
      }
    }
  }
}

/** Hash format: #3 or #3.2 (scene.step, both 0-based). */
function parseHash(scenes: SceneDef[]): State {
  const m = /^#(\d+)(?:\.(\d+))?$/.exec(window.location.hash)
  if (!m) return { scene: 0, step: 0 }
  const scene = clamp(Number(m[1]), 0, scenes.length - 1)
  const step = clamp(Number(m[2] ?? 0), 0, scenes[scene].steps - 1)
  return { scene, step }
}

export function useDeck(scenes: SceneDef[]) {
  const [state, dispatch] = useReducer(makeReducer(scenes), undefined, () => parseHash(scenes))

  useEffect(() => {
    const h = `#${state.scene}${state.step ? `.${state.step}` : ''}`
    if (window.location.hash !== h) history.replaceState(null, '', h)
  }, [state])

  useEffect(() => {
    const onHash = () => {
      const s = parseHash(scenes)
      dispatch({ type: 'goto', scene: s.scene, step: s.step })
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [scenes])

  return {
    ...state,
    next: useCallback(() => dispatch({ type: 'next' }), []),
    prevStep: useCallback(() => dispatch({ type: 'prevStep' }), []),
    prevScene: useCallback(() => dispatch({ type: 'prevScene' }), []),
    goto: useCallback((scene: number, step: number | 'last' = 0) => dispatch({ type: 'goto', scene, step }), []),
  }
}
