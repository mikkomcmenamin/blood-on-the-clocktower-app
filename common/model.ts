import { z } from "zod";
import { nextId } from "./util";

export const teamSchema = z.union([z.literal("good"), z.literal("evil")]);

export type Team = z.infer<typeof teamSchema>;

export const playerSchema = z.object({
  name: z.string(),
  id: z.number(),
  character: z.string().optional(),
});

export type Player = z.infer<typeof playerSchema>;

export const setupStagePlayerSchema = playerSchema;

export type SetupStagePlayer = z.infer<typeof setupStagePlayerSchema>;

export const characterStateSchema = z.object({
  character: z.string(),
  team: teamSchema,
});

export type CharacterState = z.infer<typeof characterStateSchema>;

const _activeStagePlayerSchema = playerSchema.merge(characterStateSchema);

export const activeStagePlayerSchema = z.union([
  z.object({ alive: z.literal(true) }).merge(_activeStagePlayerSchema),
  z
    .object({ alive: z.literal(false), ghostVote: z.boolean() })
    .merge(_activeStagePlayerSchema),
]);

export type ActiveStagePlayer = z.infer<typeof activeStagePlayerSchema>;

export const editionIdSchema = z.union([
  z.literal("TROUBLE_BREWING"),
  z.literal("SECTS_AND_VIOLETS"),
  z.literal("BAD_MOON_RISING"),
]);

export const globalSettingsSchema = z.object({
  editionId: editionIdSchema,
});

export const nominationSchema = z.union([
  z.object({
    state: z.literal("active"),
    nominator: activeStagePlayerSchema,
    nominee: activeStagePlayerSchema,
    voters: z.array(z.number()),
  }),
  z.object({
    state: z.literal("pending"),
    nominator: activeStagePlayerSchema,
  }),
  z.object({
    state: z.literal("inactive"),
  }),
]);

export type Nomination = z.infer<typeof nominationSchema>;

export const phaseSchema = z.union([
  z.object({
    phase: z.literal("day"),
    nomination: nominationSchema,
    dayNumber: z.number(),
    onTheBlock: z.optional(
      z.object({
        playerId: z.number(),
        votes: z.number(),
      })
    ),
    nominationBookkeeping: z.object({
      hasNominated: z.array(z.number()),
      hasBeenNominated: z.array(z.number()),
    }),
  }),
  z.object({
    phase: z.literal("night"),
    nightNumber: z.number(),
  }),
]);

export type Phase = z.infer<typeof phaseSchema>;

export const gameSchema = z.union([
  z.object({
    stage: z.literal("setup"),
    players: z.array(setupStagePlayerSchema),
    globalSettings: globalSettingsSchema,
  }),
  z.object({
    stage: z.literal("active"),
    players: z.array(activeStagePlayerSchema),
    phase: phaseSchema,
    globalSettings: globalSettingsSchema,
  }),
  z.object({
    stage: z.literal("finished"),
    players: z.array(activeStagePlayerSchema),
    revealedPlayers: z.array(z.number()),
    winningTeam: teamSchema,
  }),
]);

export type Game = z.infer<typeof gameSchema>;

export const createSetupStagePlayer = (
  name: string,
  existingPlayers: Player[]
): Player => ({
  name,
  id: nextId(existingPlayers),
});

export const initialGameState: Game = {
  stage: "setup",
  players: [],
  globalSettings: {
    editionId: "TROUBLE_BREWING",
  },
};
