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
