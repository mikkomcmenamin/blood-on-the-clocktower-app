import React, { useRef } from "react";
import { Player } from "@common/model";
import { classnames } from "@common/util";
import PlayerIcon from "../Player/PlayerIcon";

import clockHandMinute from "../../assets/clockhand.png";
import clockHandHour from "../../assets/clockhand-hour.png";
import { useDropzone, useWhilePressed } from "../../hooks";
import styles from "./GameBoard.module.scss";
import { getTwoClosestPlayers, reorderPlayerElements } from "../../reordering";
import {
  isActiveNomination,
  isPendingNomination,
  isSetup,
} from "@common/gameLogic";
import { useAtomValue } from "jotai";
import { gameAtom } from "../../atoms/gameAtoms";

type GameBoardProps = {
  onSelectPlayer: (playerId: number) => void;
  onModifyPlayers: (players: Player[]) => void;
  onCancelNomination: () => void;
  onToggleContextMenu: (playerId: number, open: boolean) => void;
  onAddPlayerButtonClick: () => void;
};

const GameBoard: React.FC<GameBoardProps> = ({
  onSelectPlayer,
  onModifyPlayers,
  onCancelNomination,
  onToggleContextMenu,
  onAddPlayerButtonClick,
}) => {
  const game = useAtomValue(gameAtom);
  const gameBoardRef = useRef<HTMLDivElement>(null);

  const showMinuteHand = isActiveNomination(game);
  const showHourHand = isActiveNomination(game) || isPendingNomination(game);

  const gameBoardContainerRef = useRef<HTMLElement>(null);

  useDropzone({
    ref: gameBoardRef,
    onDrop: (e) => {
      const id = e.dataTransfer?.getData("application/botc");
      if (!id) return;
      const playerElements =
        gameBoardRef.current?.querySelectorAll(`[data-playerid]`);
      if (!playerElements) return;

      // Find the two closest players to the dropped player.
      const { closestPlayerId, secondClosestPlayerId } = getTwoClosestPlayers(
        playerElements,
        {
          x: e.clientX,
          y: e.clientY,
        }
      );

      const reorderedPlayers = reorderPlayerElements({
        game,
        closestPlayerId,
        secondClosestPlayerId,
        droppedPlayerId: parseInt(id),
      });

      if (reorderedPlayers !== game.players) {
        onModifyPlayers(reorderedPlayers);
      }
    },
  });

  function onClickGameBoardContainer(e: React.PointerEvent<HTMLElement>) {
    if (e.target !== gameBoardContainerRef.current) {
      return;
    }

    onCancelNomination();
  }

  const [gameBoardPressed, setGameBoardPressed] = React.useState(false);
  useWhilePressed(
    gameBoardContainerRef,
    () => {
      setGameBoardPressed(true);
    },
    () => {
      setGameBoardPressed(false);
    },
    game.stage === "active"
  );

  return (
    <section
      onClick={onClickGameBoardContainer}
      ref={gameBoardContainerRef}
      id={styles.gameBoardContainer}
    >
      <div id={styles.gameBoard} ref={gameBoardRef}>
        {game.players.map((player) => (
          <PlayerIcon
            key={player.id}
            player={player}
            game={game}
            conditionalShow={game.stage === "active" ? gameBoardPressed : true}
            selectPlayer={() => onSelectPlayer(player.id)}
            onToggleContextMenu={(open) => {
              onToggleContextMenu(player.id, open);
            }}
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
        {isSetup(game) && (
          <div
            onClick={onAddPlayerButtonClick}
            className={styles.addPlayerInstruction}
          >
            <p>Tap here to add a player.</p>
            <p>Drag players to reorder them.</p>
            <p>Tap a player to edit them.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default GameBoard;
