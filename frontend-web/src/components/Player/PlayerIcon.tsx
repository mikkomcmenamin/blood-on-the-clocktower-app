import {
  isActiveNomination,
  isDay,
  isPendingNomination,
  playerCanBeNominated,
  playerCanNominate,
} from "@common/gameLogic";
import { ActiveStagePlayer, Game, Player } from "@common/model";
import { classnames } from "@common/util";
import { useContext, useRef } from "react";
import { AppContext } from "../../context";
import { usePressDurationDependentHandlers } from "../../hooks";
import styles from "./PlayerIcon.module.scss";
import ghostVoteIcon from "../../assets/T_GhostVote.png";

type PlayerIconProps = {
  key: number;
  player: Player | ActiveStagePlayer;
  selectPlayer: (player: Player) => void;
  game: Game;
  onToggleContextMenu: (openState: boolean) => void;
};

const PlayerIcon: React.FC<PlayerIconProps> = ({
  player,
  selectPlayer,
  game,
  onToggleContextMenu,
}) => {
  const globals = useContext(AppContext);

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

  const isDead = "alive" in player && !player.alive;

  const showDeathReminder =
    !isDead &&
    globals.value.storytellerMode &&
    globals.value.deathReminders.includes(player.id);

  const hasGhostVote =
    isActiveNomination(game) &&
    "alive" in player &&
    !player.alive &&
    player.ghostVote;

  const playerIconRef = useRef<HTMLDivElement>(null);

  function handleSelectPlayer(e: PointerEvent) {
    e.preventDefault();
    selectPlayer(player);
  }

  function openContextMenu(e: PointerEvent) {
    e.preventDefault();
    onToggleContextMenu(true);
  }

  usePressDurationDependentHandlers(
    playerIconRef,
    {
      onShortPress: handleSelectPlayer,
      onLongPress: openContextMenu,
    },
    500
  );

  return (
    <div className={styles.playerRotator}>
      <div
        ref={playerIconRef}
        data-playerid={player.id}
        draggable
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
          [styles.shroud]: isDead,
          [styles.votingDisabled]: votingDisabled,
          [styles.hasVoted]: hasVoted,
          [styles.onTheBlock]: isOnTheBlock,
          [styles.canNominate]: canNominate,
          [styles.canBeNominated]: canBeNominated,
          [styles.nightDeath]: showDeathReminder,
        })}
      >
        <div className={styles.name}>{player.name}</div>
        {hasGhostVote && (
          <img className={styles.ghostVote} src={ghostVoteIcon} />
        )}
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
