function getDistance(x1: number, y1: number, x2: number, y2: number) {
  return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
}
// When a Player is dropped onto the .gameBoard, calculate what are the two nearest players.
// The players can be retrieved by querying for the data-playerid attribute.
type Coords = {
  x: number;
  y: number;
};

export function getTwoClosestPlayers(
  playerElements: NodeListOf<Element>,
  coords: Coords
) {
  const playerElementsArray = Array.from(playerElements).filter(
    (el): el is HTMLElement => el instanceof HTMLElement
  );
  const playerElementsWithId = playerElementsArray.map((element) => {
    const id = element.getAttribute("data-playerid");
    if (!id) {
      throw Error("Player element has no data-playerid attribute");
    }
    return {
      id: parseInt(id),
      element,
    };
  });

  let closestPlayerId = null;
  let closestDistance = Infinity;
  let secondClosestPlayerId = null;
  let secondClosestDistance = Infinity;
  for (const playerElement of playerElementsWithId) {
    const { left, top, width, height } =
      playerElement.element.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    const distance = getDistance(coords.x, coords.y, centerX, centerY);
    if (distance < closestDistance) {
      secondClosestPlayerId = closestPlayerId;
      secondClosestDistance = closestDistance;
      closestPlayerId = playerElement.id;
      closestDistance = distance;
    } else if (distance < secondClosestDistance) {
      secondClosestPlayerId = playerElement.id;
      secondClosestDistance = distance;
    }
  }

  if (!closestPlayerId || !secondClosestPlayerId) {
    throw Error("Could not find two closest players");
  }

  return {
    closestPlayerId,
    secondClosestPlayerId,
  };
}
