import React, { useRef } from "react";
import { Nomination, Player } from "@common/model";
import { classnames } from "@common/util";
import PlayerIcon from "../Player/PlayerIcon";

import clockHandMinute from "../../assets/clockhand.png";
import clockHandHour from "../../assets/clockhand-hour.png";
import { useClickOutside, useDropzone } from "../../hooks";
import styles from "./GameBoard.module.scss";

type GameBoardProps = {
  players: Player[];
  nomination: Nomination;
  onSelectPlayer: (playerId: number) => void;
  onDeletePlayer: (id: number) => void;
  onReorderPlayers: (playerIds: number[]) => void;
  onClickOutside: () => void;
};

const GameBoard: React.FC<GameBoardProps> = ({
  players,
  nomination,
  onSelectPlayer,
  onDeletePlayer,
  onReorderPlayers,
  onClickOutside,
}) => {
  // cancel the current nomination when clicking outside of the player-circle
  const gameBoardRef = useRef<HTMLDivElement>(null);
  useClickOutside(gameBoardRef, onClickOutside);

  const showMinuteHand = nomination.state === "active";
  const showHourHand =
    nomination.state === "pending" || nomination.state === "active";

  // When a Player is dropped onto the background in setup, remove them from the game.
  const gameBoardContainerRef = useRef<HTMLElement>(null);
  useDropzone({
    ref: gameBoardContainerRef,
    onDrop: (e) => {
      const id = e.dataTransfer?.getData("application/botc");
      if (!id) return;
      const playerId = parseInt(id);
      onDeletePlayer(playerId);
    },
    exact: true,
  });

  // When a Player is dropped onto the .gameBoard, calculate what are the two nearest players.
  // The players can be retrieved by querying for the data-playerid attribute.
  function getDistance(x1: number, y1: number, x2: number, y2: number) {
    return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
  }

  useDropzone({
    ref: gameBoardRef,
    onDrop: (e) => {
      const id = e.dataTransfer?.getData("application/botc");
      if (!id) return;
      const playerElements =
        gameBoardRef.current?.querySelectorAll(`[data-playerid]`);
      if (!playerElements) return;
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
      const playerCenterX = e.clientX;
      const playerCenterY = e.clientY;
      for (const playerElement of playerElementsWithId) {
        const { left, top, width, height } =
          playerElement.element.getBoundingClientRect();
        const centerX = left + width / 2;
        const centerY = top + height / 2;
        const distance = getDistance(
          playerCenterX,
          playerCenterY,
          centerX,
          centerY
        );
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

      if (closestPlayerId === null || secondClosestPlayerId === null) {
        throw Error("Could not find closest players");
      }

      console.log("closestPlayerId", closestPlayerId);
      console.log("secondClosestPlayerId", secondClosestPlayerId);

      // Reorder players so that the dropped player is between the two closest players.
      // If the dropped player is one of the two closest players, do nothing.
      // If the closest players are next to each other, reorder them so that the dropped player is between them.
      // If the closest player are the first and last in the list, move the dropped player to the end of the list.
      const playerIds = players.map((player) => player.id);
      const droppedPlayerId = parseInt(id);
      const droppedPlayerIndex = playerIds.indexOf(droppedPlayerId);
      const closestPlayerIndex = playerIds.indexOf(closestPlayerId);
      const secondClosestPlayerIndex = playerIds.indexOf(secondClosestPlayerId);
      if (
        droppedPlayerIndex === closestPlayerIndex ||
        droppedPlayerIndex === secondClosestPlayerIndex
      ) {
        return;
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
      onReorderPlayers(reorderedPlayerIds);
    },
    deps: [players],
  });

  return (
    <section ref={gameBoardContainerRef} id={styles.gameBoardContainer}>
      <div id={styles.gameBoard} ref={gameBoardRef}>
        {players.map((player) => (
          <PlayerIcon
            key={player.id}
            player={player}
            nomination={nomination}
            selectPlayer={() => onSelectPlayer(player.id)}
          />
        ))}
        <section
          style={{ visibility: showMinuteHand ? "visible" : "hidden" }}
          className={classnames({
            [styles.clockhand]: true,
            [styles.clockhandMinute]: true,
          })}
        >
          <img src={clockHandMinute} alt="clock hand minute" />
        </section>
        <section
          style={{ visibility: showHourHand ? "visible" : "hidden" }}
          className={classnames({
            [styles.clockhand]: true,
            [styles.clockhandHour]: true,
          })}
        >
          <img src={clockHandHour} alt="clock hand hour" />
        </section>
      </div>
    </section>
  );
};

export default GameBoard;
