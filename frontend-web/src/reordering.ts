import { Game } from "@common/model";

function getDistance(x1: number, y1: number, x2: number, y2: number) {
  return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
}

type Coords = {
  x: number;
  y: number;
};

type PlayerHTMLElement = {
  id: number;
  element: HTMLElement;
};

export function getTwoClosestPlayers(
  playerElements: NodeListOf<Element>,
  coords: Coords
): { closestPlayerId: number; secondClosestPlayerId: number } {
  const playerElementsArray = Array.from(playerElements).filter(
    (el): el is HTMLElement => el instanceof HTMLElement
  );
  const players: PlayerHTMLElement[] = playerElementsArray.map((element) => {
    const id = element.getAttribute("data-playerid");
    if (!id) {
      throw new Error("Player element has no data-playerid attribute");
    }
    return {
      id: parseInt(id),
      element,
    };
  });

  const getCenter = (player: PlayerHTMLElement): Coords => {
    const { left, top, width, height } = player.element.getBoundingClientRect();
    return {
      x: left + width / 2,
      y: top + height / 2,
    };
  };

  const getDistanceToCoords = (player: PlayerHTMLElement): number => {
    const center = getCenter(player);
    return getDistance(coords.x, coords.y, center.x, center.y);
  };

  const playersSortedByDistance = players.sort((player1, player2) => {
    return getDistanceToCoords(player1) - getDistanceToCoords(player2);
  });

  if (playersSortedByDistance.length < 2) {
    throw new Error("Could not find two closest players");
  }

  return {
    closestPlayerId: playersSortedByDistance[0].id,
    secondClosestPlayerId: playersSortedByDistance[1].id,
  };
}

type ReorderProps = {
  droppedPlayerId: number;
  closestPlayerId: number;
  secondClosestPlayerId: number;
  game: Game;
};

export function reorderPlayerElements({
  droppedPlayerId,
  closestPlayerId,
  secondClosestPlayerId,
  game,
}: ReorderProps) {
  // Reorder players so that the dropped player is between the two closest players.
  // If the dropped player is one of the two closest players, do nothing.
  // If the closest players are next to each other, reorder them so that the dropped player is between them.
  // If the closest player are the first and last in the list, move the dropped player to the end of the list.
  const playerIds = game.players.map((player) => player.id);
  const droppedPlayerIndex = playerIds.indexOf(droppedPlayerId);
  const closestPlayerIndex = playerIds.indexOf(closestPlayerId);
  const secondClosestPlayerIndex = playerIds.indexOf(secondClosestPlayerId);
  if (
    droppedPlayerIndex === closestPlayerIndex ||
    droppedPlayerIndex === secondClosestPlayerIndex
  ) {
    return game.players;
  }

  const reorderedPlayerIds = [...playerIds];
  const TEMPORARY_DUMMY = Infinity;
  reorderedPlayerIds.splice(droppedPlayerIndex, 1, TEMPORARY_DUMMY);
  if (
    closestPlayerIndex === 0 &&
    secondClosestPlayerIndex === reorderedPlayerIds.length - 1
  ) {
    reorderedPlayerIds.push(droppedPlayerId);
  } else if (
    closestPlayerIndex === reorderedPlayerIds.length - 1 &&
    secondClosestPlayerIndex === 0
  ) {
    reorderedPlayerIds.splice(0, 0, droppedPlayerId);
  } else if (closestPlayerIndex < secondClosestPlayerIndex) {
    reorderedPlayerIds.splice(secondClosestPlayerIndex, 0, droppedPlayerId);
  } else {
    reorderedPlayerIds.splice(closestPlayerIndex, 0, droppedPlayerId);
  }
  reorderedPlayerIds.splice(reorderedPlayerIds.indexOf(TEMPORARY_DUMMY), 1);

  const reorderedPlayers = reorderedPlayerIds.map(
    (id) => game.players.find((player) => player.id === id)!
  )!;

  return reorderedPlayers;
}
