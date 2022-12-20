import React, { useRef } from "react";
import { Nomination, Player } from "@common/model";
import { classnames } from "@common/util";
import PlayerIcon from "../Player/PlayerIcon";

import clockHandMinute from "../../assets/clockhand.png";
import clockHandHour from "../../assets/clockhand-hour.png";
import { useClickOutside } from "../../hooks";
import styles from "./GameBoard.module.scss";

type GameBoardProps = {
  players: Player[];
  nomination: Nomination;
  onSelectPlayer: (playerId: number) => void;
  onDropPlayer: (id: number) => void;
  onClickOutside: () => void;
};

const GameBoard: React.FC<GameBoardProps> = ({
  players,
  nomination,
  onSelectPlayer,
  onDropPlayer,
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

  // These two events need to be prevented to allow the drop event to fire.
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };
  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  // Handle the drop here; only consider it if the target is the game board, i.e. not its children.
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (
      !gameBoardContainerRef.current ||
      e.target !== gameBoardContainerRef.current
    )
      return;
    const playerId = e.dataTransfer.getData("application/botc");
    if (!playerId) {
      return;
    }
    onDropPlayer(parseInt(playerId));
  };

  return (
    <section
      ref={gameBoardContainerRef}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      id={styles.gameBoardContainer}
    >
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
