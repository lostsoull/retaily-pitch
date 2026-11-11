/**
 * Traction numbers for the milestones slide. Edit here only.
 * null = not confirmed yet: the slide shows an amber "to confirm" marker in its place,
 * so a missing number can never slip onto the stage looking real.
 */
export const TRACTION = {
  // from the pitch deck
  discoveryToShippedDays: 4, // met two merchants Jun 4, shipped their full ask Jun 8
  pilots: 3, // pilot merchants secured
  pipelinePerWeek: '3–5', // merchants onboarding per week
  testSuccessPct: 92, // internal production test suite

  // to confirm with the team (shown as an amber "to confirm" marker until filled in)
  adCampaigns: null as number | null, // Meta ad campaigns we ran on e-commerce products to test the agent
  conversations: null as number | null, // customer conversations the agent handled from those ads
}
