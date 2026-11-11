import { createContext, useContext } from 'react'

/** Lets an on-stage control (e.g. the Approve button) advance the deck. */
export const DeckNav = createContext<{ next: () => void }>({ next: () => {} })
export const useDeckNav = () => useContext(DeckNav)
