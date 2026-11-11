import type { SceneDef } from '../deck/types'
import F0Meet from './F0Meet'
import F0PlugIn from './F0PlugIn'
import F1Conversation from './F1Conversation'
import F2Address from './F2Address'
import F3Facts from './F3Facts'
import F4Permissions from './F4Permissions'
import F5Delivery from './F5Delivery'
import F6Console from './F6Console'
import S00Title from './S00Title'
import S01GrowthTrap from './S01GrowthTrap'
import S02Chaos from './S02Chaos'
import S10Close from './S10Close'
import S11Market from './S11Market'
import S12Model from './S12Model'
import S13Traction from './S13Traction'
import S14Compete from './S14Compete'
import S15GoToMarket from './S15GoToMarket'

// Kept on disk, out of the running order: S01Receipt, S03Solution, S04Autopilot and S05Demo (their visuals
// now live in F4Permissions via BrakeTrack and ApprovalCard), S06Market, S07Model, S08Compete, S09Proof, S03Fired (merged into S14Compete),
// and components/CodStruggles (the removed cold-open talking slides).

const PAPER = '#f4f7fb'

export const SCENES: SceneDef[] = [
  // the opener, the room, and the problem
  { id: 'title', title: 'RetailyAI', steps: 1, bg: '#06102b', Component: S00Title },
  { id: 'chaos', title: 'A quick test: hands up', steps: 3, bg: '#1e6bff', Component: S02Chaos },
  { id: 'trap', title: 'The growth trap', steps: 6, bg: PAPER, Component: S01GrowthTrap },
  // the solution, one story per feature
  { id: 'meet', title: 'The solution: meet RetailyAI', steps: 1, bg: PAPER, Component: F0Meet },
  { id: 'f-plug', title: '1 · Plug in, connect', steps: 2, bg: PAPER, Component: F0PlugIn },
  { id: 'f-chat', title: '2 · Conversation agent', steps: 2, bg: PAPER, Component: F1Conversation },
  { id: 'f-address', title: '3 · Address check', steps: 2, bg: PAPER, Component: F2Address },
  { id: 'f-facts', title: '4 · Product Q&A', steps: 2, bg: PAPER, Component: F3Facts },
  { id: 'f-perms', title: '5 · Handoffs and permissions', steps: 5, bg: PAPER, Component: F4Permissions },
  { id: 'f-delivery', title: '6 · Delivery', steps: 3, bg: PAPER, Component: F5Delivery },
  { id: 'f-console', title: '7 · Owner’s console', steps: 3, bg: PAPER, Component: F6Console },
  // the market
  { id: 'market', title: 'The market', steps: 3, bg: PAPER, Component: S11Market },
  { id: 'model', title: 'Business model', steps: 3, bg: PAPER, Component: S12Model },
  { id: 'traction', title: 'Traction', steps: 5, bg: PAPER, Component: S13Traction },
  // trust, against the alternatives
  { id: 'compete', title: 'Competition: who talks to your customers', steps: 5, bg: PAPER, Component: S14Compete },
  { id: 'gtm', title: 'Go-to-market', steps: 3, bg: PAPER, Component: S15GoToMarket },
  // the close
  { id: 'close', title: 'Team and the ask', steps: 2, bg: PAPER, Component: S10Close },
]
