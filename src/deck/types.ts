import type { ComponentType } from 'react'

export type SceneProps = {
  /** Current reveal step, 0-based. A scene renders purely from this value. */
  step: number
}

export type SceneDef = {
  id: string
  title: string
  /** Number of reveal steps (>= 1). */
  steps: number
  /** Stage background; also used for letterboxing. */
  bg: string
  Component: ComponentType<SceneProps>
}
