import React, {useRef} from "react";
import {Nomination, Player} from "../../model";
import {cat, classnames} from "../../util"
import PlayerIcon from "../Player/PlayerIcon";

import clockHandMinute from "../../assets/clockhand.png";
import clockHandHour from "../../assets/clockhand-hour.png";
import {useClickOutside} from "../../hooks";
import styles from "./GameBoard.module.scss";

type GameBoardProps = {
  players: Player[]
  nomination: Nomination
  setNomination: (nomination: Nomination) => void
}

const GameBoard: React.FC<GameBoardProps> = ({players, nomination, setNomination}) => {

  // cancel the current nomination when clicking outside of the player-circle
  const gameBoardRef = useRef<HTMLDivElement>(null);
  useClickOutside(gameBoardRef, () => {
    if (nomination.state !== "inactive") {
      setNomination({state: "inactive"});
    }
  });

  const showMinuteHand = nomination.state === "active";
  const showHourHand = nomination.state === "pending" || nomination.state === "active";

  // when a player is clicked, start the nomination process
  // 1. if Nomination is state "inactive", set it to "pending" and set the nominating player
  // 2. if Nomination is state "pending", set it to "active" and set the nominated player
  function handleSelectPlayer(player: Player) {
    if (
      nomination.state === "inactive" ||
      player.id === nomination.nominator.id ||
      nomination.state === "active"
    ) {
      setNomination({
        state: "pending",
        nominator: player,
      });
    } else if (nomination.state === "pending") {
      setNomination({
        ...nomination,
        state: "active",
        nominee: player,
        voters: [],
      });
    }
  }

  return (
    <section id={styles.gameBoardContainer}>
      <div
        id={styles.gameBoard}
        ref={gameBoardRef}
      >
        {players.map((player) => (
          <PlayerIcon
            key={player.id}
            player={player}
            nomination={nomination}
            selectPlayer={handleSelectPlayer}
          />
        ))}
        <section
          style={{visibility: showMinuteHand ? "visible" : "hidden"}}
          className={classnames({
            [styles.clockhand]: true,
            [styles.clockhandMinute]: true
          })}
        >
          <img src={clockHandMinute} alt="clock hand minute"/>
        </section>
        <section
          style={{visibility: showHourHand ? "visible" : "hidden"}}
          className={classnames({
            [styles.clockhand]: true,
            [styles.clockhandHour]: true
          })}
        >
          <img src={clockHandHour} alt="clock hand hour"/>
        </section>
      </div>
    </section>
  );
};

export default GameBoard;


