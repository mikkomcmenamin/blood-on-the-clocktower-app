import { z } from "zod";
import { nextId } from "./util";

const teamSchema = z.union([z.literal("good"), z.literal("evil")]);

export type Team = z.infer<typeof teamSchema>;

const playerSchema = z.object({
  name: z.string(),
  id: z.number(),
});

export type Player = z.infer<typeof playerSchema>;

const setupStagePlayerSchema = playerSchema;

export type SetupStagePlayer = z.infer<typeof setupStagePlayerSchema>;

const characterStateSchema = z.object({
  character: z.string(),
  team: z.union([z.literal("good"), z.literal("evil")]),
});

export type CharacterState = z.infer<typeof characterStateSchema>;

const _activeStagePlayerSchema = playerSchema.merge(characterStateSchema);

const activeStagePlayerSchema = z.union([
  z.object({ alive: z.literal(true) }).merge(_activeStagePlayerSchema),
  z
    .object({ alive: z.literal(false), ghostVote: z.boolean() })
    .merge(_activeStagePlayerSchema),
]);

export type ActiveStagePlayer = z.infer<typeof activeStagePlayerSchema>;

const nominationSchema = z.union([
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

const phaseSchema = z.union([
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
    nightDeaths: z.array(z.number()),
    nightNumber: z.number(),
  }),
]);

export type Phase = z.infer<typeof phaseSchema>;

const gameSchema = z.union([
  z.object({
    stage: z.literal("setup"),
    players: z.array(setupStagePlayerSchema),
  }),
  z.object({
    stage: z.literal("active"),
    players: z.array(activeStagePlayerSchema),
    phase: phaseSchema,
  }),
  z.object({
    stage: z.literal("finished"),
    players: z.array(activeStagePlayerSchema),
    winningTeam: teamSchema,
  }),
]);

export type Game = z.infer<typeof gameSchema>;

export const createSetupStagePlayer = (name: string): Player => ({
  name,
  id: nextId(),
});

export const createMockActiveStagePlayer = (
  name: string
): ActiveStagePlayer => ({
  name,
  id: nextId(),
  character: "character",
  team: "good",
  alive: true,
});
