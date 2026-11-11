import { AnimatePresence, motion } from 'motion/react'
import { EASE } from '../deck/motion'

/**
 * Stage version of the product's inbox HandoffCard ("Approval required"):
 * header, order meta, proposed before/after, Approve-led action stack.
 */
export function ApprovalCard({
  approved,
  showAfter,
  pressed,
  onApprove,
  width = 640,
  height,
  approveDelay = 0,
}: {
  /** Fixed height: the proposed-change block grows to fill it. */
  height?: number
  approved: boolean
  showAfter: boolean
  pressed?: boolean
  onApprove?: () => void
  width?: number
  /** Seconds to wait before the card settles to approved (lets a demo tap land first). */
  approveDelay?: number
}) {
  return (
    <div
      className="flex flex-col overflow-hidden rounded-[28px] bg-white text-ink shadow-[0_40px_80px_-40px_rgba(6,16,43,0.45),0_0_0_1px_rgba(6,16,43,0.06)]"
      style={{ width, height }}
    >
      {/* header */}
      <div className="flex items-start justify-between gap-4 px-8 pb-6 pt-7">
        <div className="flex items-start gap-4">
          <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-electric-soft text-electric">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M12 3 4 6v6c0 4.5 3.4 8.3 8 9 4.6-.7 8-4.5 8-9V6l-8-3z" />
              <path d="m8.5 12 2.5 2.5 4.5-5" />
            </svg>
          </div>
          <div>
            <div className="text-[30px] font-semibold leading-tight">Approval required</div>
            <div className="mt-1 text-[22px] text-ink-3">The customer asked to change the delivery address.</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 border-t border-line text-[22px]">
        <div className="px-8 py-4">
          <div className="text-[19px] text-ink-3">Order</div>
          <div className="mt-1 font-mono font-semibold">#2841</div>
        </div>
        <div className="border-l border-line px-8 py-4">
          <div className="text-[19px] text-ink-3">Received</div>
          <div className="mt-1 font-semibold tabular">21:46</div>
        </div>
      </div>

      {/* proposed change, before / after */}
      <div className="flex flex-1 flex-col justify-center border-t border-line px-8 py-6">
        <div className="mb-4 text-[19px] text-ink-3">Proposed change: delivery address</div>
        <div className="rounded-2xl border-2 border-electric/25 bg-electric/[0.04] px-6 py-5">
          <div className="text-[23px] text-ink-3 line-through decoration-loss decoration-[3px]">Hay Riad, Rabat</div>
          <motion.div
            initial={false}
            animate={{ opacity: showAfter ? 1 : 0, y: showAfter ? 0 : 10 }}
            transition={{ duration: 0.6, ease: EASE, delay: showAfter ? 0.6 : 0 }}
            className="mt-3 flex items-start gap-3"
          >
            <svg width="26" height="26" viewBox="0 0 24 24" className="mt-0.5 shrink-0 text-electric" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden>
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
            <div>
              <div className="text-[25px] font-semibold leading-snug">14 Rue Ibnou Mounir, Maarif, Casablanca</div>
              <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-paper px-3 py-1 text-[19px] text-ink-2">
                <span className="h-2.5 w-2.5 rounded-full bg-electric" />
                Address validated before the delivery ticket
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* actions */}
      <div className="relative border-t border-line px-8 py-6">
        <motion.div initial={false} animate={{ opacity: approved ? 0 : 1 }} transition={{ duration: 0.3, delay: approved ? approveDelay : 0 }}>
          <motion.button
            data-interactive
            onClick={onApprove}
            initial={false}
            animate={{ scale: approved ? [1, 1, 0.95, 1] : pressed ? 0.96 : 1 }}
            transition={approved ? { duration: approveDelay || 0.3, times: [0, 0.75, 0.88, 1] } : { type: 'spring', bounce: 0.5, duration: 0.35 }}
            className="flex h-[72px] w-full items-center justify-center gap-3 rounded-2xl bg-go text-[27px] font-semibold text-white"
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="m3 12.5 4 4L14 9.5M10 16.5l1 1 9-9" />
            </svg>
            Approve
          </motion.button>
          <div className="mt-3 grid grid-cols-2 gap-3 text-[23px] text-ink-2">
            <div className="flex h-[60px] items-center justify-center rounded-2xl border-2 border-line">Edit</div>
            <div className="flex h-[60px] items-center justify-center rounded-2xl border-2 border-line">Reject</div>
          </div>
        </motion.div>
        <AnimatePresence>
          {approved && (
            <motion.div
              className="absolute inset-x-8 inset-y-6 flex items-center justify-center gap-3 rounded-2xl bg-go-soft text-[27px] font-semibold text-[#2f6a4c]"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: EASE, delay: approveDelay + 0.1 }}
            >
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#3a7a5a" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="m4 12.5 5 5L20 6.5" />
              </svg>
              Approved. Address updated.
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
