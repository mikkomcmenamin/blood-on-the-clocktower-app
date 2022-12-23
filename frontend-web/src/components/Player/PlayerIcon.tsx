import {
  isActiveNomination,
  isDay,
  isInactiveNomination,
  isNight,
  isPendingNomination,
  playerCanBeNominated,
  playerCanNominate,
} from "@common/gameLogic";
import { ActiveStagePlayer, Game, Nomination, Player } from "@common/model";
import { classnames } from "@common/util";
import { useRef } from "react";
import { usePressDurationDependentHandlers } from "../../hooks";
import styles from "./PlayerIcon.module.scss";

type PlayerIconProps = {
  key: number;
  player: Player | ActiveStagePlayer;
  selectPlayer: (player: Player) => void;
  game: Game;
};

const PlayerIcon: React.FC<PlayerIconProps> = ({
  player,
  selectPlayer,
  game,
}) => {
  const votingDisabled =
    isActiveNomination(game) &&
    "alive" in player &&
    !player.alive &&
    !player.ghostVote;
  const hasVoted =
    isActiveNomination(game) &&
    game.phase.nomination.voters.includes(player.id);

  const isOnTheBlock =
    isDay(game) && game.phase.onTheBlock?.playerId === player.id;

  const canNominate = playerCanNominate(player, game);
  const canBeNominated = playerCanBeNominated(player, game);

  const isNightDeath =
    isNight(game) && game.phase.nightDeaths.includes(player.id);

  const playerIconRef = useRef<HTMLDivElement>(null);

  function handleSelectPlayer(e: PointerEvent) {
    e.preventDefault();
    selectPlayer(player);
  }

  function onLongPress(e: PointerEvent) {
    e.preventDefault();
    // todo should open a context menu in certain situations
    alert("long press");
  }

  usePressDurationDependentHandlers(
    playerIconRef,
    {
      onShortPress: handleSelectPlayer,
      onLongPress: isDay(game) ? onLongPress : undefined,
    },
    1000
  );

  return (
    <div className={styles.playerRotator}>
      <div
        ref={playerIconRef}
        data-playerid={player.id}
        onDragStart={(e) => {
          // no dragging unless it's setup phase
          if (game.stage !== "setup") {
            e.preventDefault();
            return;
          }
          e.dataTransfer.setData("application/botc", player.id.toString());
        }}
        className={classnames({
          [styles.playerContent]: true,
          [styles.nominator]: isNominator(player, game),
          [styles.nominee]: isNominee(player, game),
          [styles.notInvolvedInNomination]: notInvolvedInNomination(
            player,
            game
          ),
          [styles.shroud]: "alive" in player && !player.alive,
          [styles.votingDisabled]: votingDisabled,
          [styles.hasVoted]: hasVoted,
          [styles.onTheBlock]: isOnTheBlock,
          [styles.canNominate]: canNominate,
          [styles.canBeNominated]: canBeNominated,
          [styles.nightDeath]: isNightDeath,
        })}
      >
        <div className={styles.name}>{player.name}</div>
      </div>
    </div>
  );
};

const isNominator = (player: Player, game: Game) =>
  (isPendingNomination(game) || isActiveNomination(game)) &&
  game.phase.nomination.nominator.id === player.id;

const isNominee = (player: Player, game: Game) =>
  isActiveNomination(game) && game.phase.nomination.nominee.id === player.id;

const notInvolvedInNomination = (player: Player, game: Game) =>
  isActiveNomination(game) &&
  ![
    game.phase.nomination.nominator.id,
    game.phase.nomination.nominee.id,
  ].includes(player.id);

export default PlayerIcon;
