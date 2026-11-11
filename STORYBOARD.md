# RetailyAI · Checkmate & Connect, Casablanca, 11 Nov 2026

Five minutes. Eleven scenes. One idea per scene.
Source of truth for every number: `pitch-deck.pdf` (Sifeddine's deck).

## Visual language

**The material is the merchant's world, not "AI".** Everything on stage is something a
Moroccan COD merchant already handles: a thermal receipt, a WhatsApp thread, an order
card, an approve button. No robots, no brains, no glow.

### Colour (current: the cool system)

One palette for the whole deck, tokens in `src/styles.css`:

| Token | Hex | Role |
|-------|-----|------|
| `navy` | `#06102B` → `#0B1F5C` | The night stage: title and the closing ask, lit by an azure bloom and a fine dot grid. |
| `electric` (azure) | `#1E6BFF` | RetailyAI. The cold open's stage, the brand, the agent. |
| `sky` | `#7FB2FF` | The one highlighted word on navy ("orders.", "WhatsApp?"), rings, light accents. |
| `paper` (ice) | `#F4F7FB` | Every content slide. Crisp and cool, never cream. |
| `ink` | `#0B1324` | Text on ice. |
| `go` / `brake` | `#3A7A5A` / `#B88A2E` | Muted status colors, only inside product UI (done / waiting). |

No red anywhere. Glass cards (white at 5–14%, 18px backdrop blur) appear only on the
navy stage. The deck opens on azure, goes to night for the title, works on ice, and
closes back on night. The table below is the original palette, kept for reference.

### Colour (original)

| Token      | Hex       | Role |
|------------|-----------|------|
| `paper`    | `#F2F4F8` | Default canvas. Cool thermal-receipt white, not cream. |
| `ink`      | `#0A1230` | Text and dark scenes. Deep navy, never pure black. |
| `electric` | `#2F54FF` | RetailyAI. Used for the brand, the operator, and nothing else. |
| `loss`     | `#F03E3E` | Money leaving the merchant. Only appears when margin dies. |
| `go`       | `#0FB46B` | Approved. Only after a human taps Approve. |
| `brake`    | `#FFB21E` | The AI stopped and is waiting for the merchant. |
| `wa-night` | `#0B141A` | WhatsApp dark theme. The chaos scene only. |

Colour is semantic: if something is red, money is being lost; if it's amber, the AI is
waiting; green only follows a human decision.

### Type

- **Archivo** (variable width + weight). Headlines run at heavy weight, slightly
  condensed (`font-stretch: 88%`) so 5-word headlines hold the stage at 120 to 150px.
  Width is animated on purpose in one place: the "FIRED" stamp.
- **IBM Plex Mono** only on things that are physically printed: receipts, the
  termination slip. Never for labels.
- **IBM Plex Sans Arabic** for Darija customer messages written in Arabic script.
- Minimum on-stage size: 28px for supporting text, 20px inside product mockups.

### Rhythm

Backgrounds alternate to pace the talk: loud scenes break the paper calm.

```
 0 Title      ███ electric   quiet, confident
 1 Problem    ░░░ paper      quiet → painful      (hero scene)
 2 Chaos      ▓▓▓ wa-night   LOUD → freeze
 3 Fired      ░░░ paper      funny
 4 Solution   ░░░ paper      calm, mechanical
 5 Demo       ░░░ paper      precise, interactive
 6 Market     ░░░ paper      flowing
 7 Model      ░░░ paper      arithmetic
 8 Compete    ░░░ paper      comparative, wry
 9 Proof      ░░░ paper      quiet, factual
10 Team / CTA ███ electric   warm → ask
```

### Layout: one frame (`src/components/Cine.tsx`)

- Caption column on the left (x 140 → 780): chapter marker at y 150, headline, one line
  of substance. Feature chapters anchor its foot with a thin chapter numeral (01 / 06)
  whose last digit rolls in from the previous chapter.
- Everything visual fills `BOX` on the right: x 860 → 1780, y 150 → 930. Objects align to
  its edges: tops on 150, bottoms on 930. No card ends at a random height.
- Asymmetry is deliberate, never accidental: unequal column splits (548 | 348, 420 | 476,
  620 | 276), one hero that may bleed off the frame (the phone, the waybill, the console
  screenshot), at most one satellite overlapping it (the 02:14 pill, the customer's bubble,
  the top-up card).

### Motion rules

1. Every animation shows a change in the story (money leaves, a message arrives, a gate
   drops). Things travel to show cause and effect: the owner's answer flies into the
   approved facts, the parcel flies to the carrier, follow-ups launch out of the phone.
2. Every scene is a pure function of `(scene, step)`. Going back replays the previous
   state exactly; no timers mutate state.
3. Shots, not pop-ups. `Reveal` gives a small vocabulary: `focus` (blur-to-sharp pull),
   `lift` (stands up toward the camera in 3D), `wipe` (unfolds behind a mask), `swing`
   (door hinged left), `left` / `right` / `drop` / `rise`. Headlines swing up out of their
   mask; supporting copy comes into focus.
4. Every scene opens on a slow camera settle (`Camera`, 2 s dolly back). Multi-step scenes
   move the camera instead of stacking cards: Handoffs pans down shot by shot.
5. Scene cuts are a directional wipe with one electric line on its edge; the old scene
   recedes under the new one. Backwards navigation wipes the other way.
6. House curve `cubic-bezier(0.16, 1, 0.3, 1)`; wipes and camera moves `(0.76, 0, 0.24, 1)`.
   Physical things (cards dealt, a stamp, a thrown top-up) use springs.
7. Reduced motion (`M`, or the OS setting): no movement, no blur, opacity only, same
   final frames; cuts become a crossfade.

### Self-review against generic defaults

- First instinct was a navy/black keynote with one blue accent: that is the stock
  "AI launch" look. Replaced with a paper base drawn from the receipt, and dark used
  once, for WhatsApp at night, where it means something.
- First instinct for the market was a TAM/SAM/SOM circle chart. Replaced with the actual
  funnel a customer walks through: an ad, a chat, a cash-on-delivery order.
- First instinct for competition was a feature-checkmark table. Replaced with one
  customer message sent to four systems, and what each one does.

## Running order (current)

| # | Scene | Steps |
|---|-------|-------|
| 0 | Title, the opener, on the night stage: "Turn conversations into orders." One tilted phone: Khadija asks, the agent answers with the product photo, she orders, the agent writes Order #3112 into the chat, and the order lifts out of the phone into the room. | 1 |
| 1 | Cold open, a quick test, on the azure stage: "Raise your hand if you've ever tried COD e-commerce." A typing indicator, then a giant WhatsApp bubble types out "ch7al?", the first message every COD seller gets → "Keep it up if you've ever answered this all night." The first bubble recedes into soft focus; every spelling of the same question pops in front of it, each one whole, faster and faster (ch7al?, شحال؟, Prix svp, Combien?…), the unread counter races 1 → 247 → freeze: "Hands down. We've all been buried here." | 3 |
| 2 | The growth trap, one problem per click, each with its own animated picture: 1 Time, "20 minutes, per order." (a stopwatch sweeps to 20:00 while a by-hand checklist ticks) · 2 Slow replies, "Reply late, lose the sale." (she gives up at 14:38, the reply lands at 16:10, the clock spins, the chat goes cold) · 3 Missed upsells, "They wanted more." (the second watch nobody offered fades to grey: 229 DH left on the table) · 4 Nights, "Nobody’s awake at 02:14." (messages pile up on the lock screen until 09:12: 3 orders lost) · 5 Cost, "15 DH an order, to an agency." (each order pays a coin into the agency’s jar: 9,000 DH a month at 20 a day) · verdict: Burnout / Lost sales / Cash burn, "Small, you burn time. Big, you burn cash." | 6 |
| 3 | The solution, kept simple: "Meet RetailyAI." and its seven chapters laid out like a contents page (01 Plug in, connect · 02 Conversation agent · 03 Address check · 04 Product Q&A · 05 Handoffs and permissions · 06 Delivery · 07 Owner’s console). | 1 |
| 4 | 1 · Plug in, connect: "Plug in your store." (the store’s products and orders stream into RetailyAI; no website, add products by hand) → "Your number, never blocked." (the merchant’s own WhatsApp number, connected through Meta’s verified WhatsApp API; next to unofficial tools that hack WhatsApp Web and get numbers blocked). | 2 |
| 5 | 2 · Conversation agent: "It sells while you sleep." The real product recording (`src/assets/phone_convo.mp4`, 26 s, sound on) rests on its first frame with a play button; the presenter clicks it (or presses P) to play it with sound when ready to talk over it: voice notes both ways in Darija, colours, size, order R-006 (Olive Green, L, 199 MAD). A log beside it lights up in sync; at 0:24 the order lifts out of the phone into the log. Then a change, a cancellation, "where is my parcel?" fly out of the same phone. P pauses and resumes. Let the video run before advancing. | 2 |
| 6 | 3 · Address check: "No more parcels to nowhere." "Kaza" → Casablanca matched; "Sidi" → 3 possible towns, on hold | 2 |
| 7 | 4 · Product Q&A: "It never makes things up." Missing fact → owner answers once → next customer answered instantly | 2 |
| 8 | 5 · Handoffs and permissions: "You decide what it can do." (Do it alone / Ask me first / Leave it to me) → "Autopilot, with brakes." (routine orders pass the checkpoint, the address change stops at the barrier, "Waiting for you") → "It proposes. You decide." (that waiting change arrives as the approval card, before/after) → one tap on Approve (or click it yourself), customer gets the confirmation → "It knows when to call you." (take over, hand back) | 5 |
| 9 | 6 · Delivery: "From chat to waybill." Carrier booked (Ozon Express, Olivraison, Speedaf), waybill prints, live status on the order | 3 |
| 10 | 7 · Owner's console: the real overview → live numbers and what needs a human → the real inbox | 3 |
| 11 | The market, on the map of Morocco (Sahara included, one territory): merchant dots spread from Casablanca across the cities → "30K–50K COD merchants" → "145–240M MAD a year, the Moroccan COD market", 38–58M reachable today → the map zooms out: MENA and francophone Africa light up, "Morocco is the beachhead." | 3 |
| 12 | Business model, told like prepaid phone credit: "You pay per reply." (each AI reply ticks the reply-credit balance down by one) → "Pick a monthly plan." Five recharge cards: Free 0 MAD · 200 credits (freemium) · Launch 190 · 600 credits · ≈30 deliveries · −68% vs agency · Starter 390 · 1,400 · ≈70 · −72% · Growth 790 · 3,200 · ≈160 · −75% · Scale 1,800 · 8,000 · ≈400 · −78%. One credit = one AI reply, WhatsApp template fees included → "Ran out? Top up." | 3 |
| 13 | Traction as a journey, one story per click, while a road draws itself along the foot of the frame and a delivery van drives stop to stop: 1 June, "We built the MVP." (a terminal writes v0.1) · 2 Demos, "We put it in front of merchants." (a live demo, merchants’ questions pop up around it) · 3 Feedback, "Their feedback, our next version." (each question crosses the board and ships; June 4 → 8, 4 days) · 4 Meta ads, "We ran Meta ads." (a Meta ad on a real product; taps on Send message become chats the agent answers) · 5 Pilots, "3 pilots, live today." (three storefronts switch on; 92% test suite; 3–5 a week). Campaign and chat counts live in `src/data/traction.ts` and show amber "to confirm" until filled in. | 5 |
| 14 | Competition, as a hiring decision: "Who should talk to your customers?" (channel-neutral). Four candidate files: Agency (TOO EXPENSIVE) · eGrow · Generic AI chatbot (FIRED) · RetailyAI (HIRED). | 5 |
| 15 | Go-to-market in three beats, on a wall of 100 storefronts: "Start them free." (200 credits on their own real chats; now: 3 pilots) → "The numbers sell it." (the same 30 deliveries: agency ≈ 600 DH vs Launch 190 MAD, −68%, up to −78%; Q1: ~25) → "Merchants bring merchants." (referrals, COD communities, 3–5 a week, >70% retention; Q4: 100 paying merchants). | 3 |
| 16 | Team, then the ask on the night stage: "Know a merchant drowning in messages?" A thermal receipt prints "your next order: 1 × pilot, 200 credits to start" with the retaily.ai QR code (scannable, logo in the centre) and a scanner beam sweeps it. | 2 |

Out of the running order but kept on disk: S01Receipt, S03Solution, S04Autopilot and S05Demo
(their visuals now live in scene 7 via BrakeTrack and ApprovalCard; the real inbox moved to
scene 9), S06Market, S07Model, S08Compete, S09Proof, components/CodStruggles.

The detailed notes below describe earlier versions of some scenes.

## Storyboard

Steps advance with → / Space / clicker. Timings are speaking guides.

### 0 · Title (10s)
Electric blue stage. RetailyAI mark draws in, wordmark, one line: "The AI operator for
Moroccan cash-on-delivery merchants." Event and date small at the foot.

### 0 · Cold open: hands up (35s), before the title
WhatsApp at night. The room answers before the slide does.
1. "Raise your hand if you've ever sold on WhatsApp." A first ping: "Salam, ch7al?"
2. "Keep it up if you've ever confirmed an order by phone." Two more pings.
   "Look around. That's most of the room."
3. The flood: messages pour in faster and faster, unread counter races to 247.
4. Freeze and dim: "Hands down. We've all been buried here."
   "Every ping is a sale waiting to be confirmed, by hand. For a merchant, that's
   5–6 hours a day inside WhatsApp."

Then the title (1), which answers it: "Turn conversations into orders."

### 2 · The growth trap: the leaking pipeline (40s)
Orders (small order cards) flow continuously along a lane from WhatsApp to
"Confirmed". It starts as a perfect flow; each click drops in an obstacle that
physically breaks it, and the orders' journeys change to match:
- a barrier where orders queue (20+ min per order),
- a gap in the lane where unanswered chats fall through (slow replies),
- a +89 upsell that pops up and vanishes (missed upsells),
- a night zone at 02:14 where orders disappear (no 24/7),
- an agency toll booth that knocks a red −15 DH coin off each order into a pile.
Verdict brackets: Burnout (solo, 5–10/day) · Lost sales · Cash burn (team or agency,
100+/day). Speech bubbles: "I can't grow. I'm stuck in DMs." / "We can't keep up!"

### 3 · RetailyAI seals every leak (40s)
The exact same pipeline, fixed station by station in the same order:
barrier lifts (Seconds), gap bridged (Instant replies, with a real 14:02 exchange),
the +89 sticks to each order (Upsells offered), the night zone lights up (24/7, a 02:14
exchange), the toll booth turns into "0 DH" (One flat plan). Verdict: Hours back ·
More sales · Margin back.

Then "AI, you're fired" (4): why merchants distrust other AI. Then autopilot with brakes.

### (previous version of scene 2, kept for reference)
One axis, orders per day, from a solo founder (5–10 a day) to a scaling merchant
(100+ a day, a team or an agency). Five stops, each a real artifact:
1. Solo founder: "I can't grow. I'm stuck in DMs."
2. 20+ min per order (a timer) and slow replies ("Seen. No reply.").
3. Missed upsells and lost impulse buys (an order card with the bag never offered).
4. Scaling merchant: "We can't keep up with the volume!" No 24/7 (02:14, unanswered)
   and 15+ DH per order (an agency invoice, 1,500 DH a day at 100 orders).
5. Verdict: the axis turns from Burnout to Cash burn, a red line runs under all of it:
   "Small, you burn time. Big, you burn cash. Either way, sales slip through."

(The earlier 150 DH receipt scene is kept in `src/scenes/S01Receipt.tsx`, unused.)

### 3 · AI, you're fired (30s)
A printed termination slip for "AI Chatbot". Three exhibits pinned beside it, each a real
failure merchants told us about:
1. It guessed a price it didn't know.
2. It copied a bad address straight onto the delivery.
3. It replied when it should have stayed quiet.
Final step: a red FIRED stamp slams onto the slip. Line: "Merchants didn't quit AI over
features. They quit over trust."

### 4 · Autopilot with brakes (25s)
Orders travel along a track and confirm themselves. Routine orders glide through.
An address change arrives: an amber barrier drops, the card stops, "Waiting for you."
Headline: "Autopilot, with brakes." Sub: "It runs the routine 70%. It never touches an
order without you."

### 5 · Demo: it proposes, you decide (45s)
Left, a WhatsApp thread in Darija. Right, the approval card.
1. Customer: wants to change the delivery address.
2. RetailyAI replies it will check with the store; the before/after card appears
   (old address struck through, new address filled).
3. A cursor taps Approve; card turns green; customer gets confirmation.
4. Pull back: the real RetailyAI inbox screenshot.

### 6 · Market (30s)
A sponsored ad → "Send message" → WhatsApp chat → cash-on-delivery order. One line:
"In Morocco, the checkout is a WhatsApp chat." Evidence, labelled as estimates:
~3,544 live YouCan stores plus sellers with no storefront at all; bottom-up reachable
market 38–58M MAD / year.

### 7 · Business model (30s)
Left: an agency meter charging 15–25 DH per delivered order; at 20 orders a day that is
9,000 DH a month at the low end. Right: flat monthly plans, 190 / 390 / 790 / 1,800 MAD.
Quiet footer, clearly separated: "Our own AI cost: 2–6 DH per delivered order. That is our
~65% gross margin, not your price."

### 8 · Competition (25s)
One customer message: "Change my address, I'm in Casa now." Four answers revealed:
- Confirmation agency: "We'll call you back tomorrow."
- Rule-based bot: "Sorry, I didn't understand. Type 1 for orders."
- Generic AI chatbot: "Done! Address updated." (nobody checked)
- RetailyAI: proposes the change, waits for the merchant.
Headline: "Everyone automates. The question is who asks first."

### 9 · Proof (25s)
A calendar strip June 4 → June 8. A line draws across it: met two merchants → shipped
their full ask. "Discovery to production in four days."
Then: 3 pilot merchants. 92% success, labelled "internal production test suite".

### 10 · Team and the ask (30s)
Sifeddine, Founder/CTO: ran his own COD store, built the system.
Yassine, CPO: owns the console merchants touch.
Final step, electric stage: "Know a merchant drowning in WhatsApp? Introduce us."
retaily.ai

## Controls

| Key | Action |
|-----|--------|
| → / Space / PageDown | Next step, then next scene |
| PageUp / ↑ | Previous step |
| ← | Previous scene (lands on its final state) |
| F | Fullscreen |
| R | Restart from scene 0 |
| G or Esc | Scene overview (click to jump) |
| 0–9 then Enter | Jump to scene number |
| M | Toggle reduced motion |
| ? | Show controls |
| Move the mouse | Navigation bar: previous/next step and slide, a clickable strip of every slide, all slides, fullscreen |
