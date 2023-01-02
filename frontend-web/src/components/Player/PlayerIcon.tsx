import {
  isActiveNomination,
  isInactiveNomination,
  isDay,
  isPendingNomination,
  isSetup,
  playerCanBeNominated,
  playerCanNominate,
  isFinished,
} from "@common/gameLogic";
import { ActiveStagePlayer, Game, Player } from "@common/model";
import { classnames } from "@common/util";
import { useContext, useEffect, useRef } from "react";
import { AppContext } from "../../context";
import { usePressDurationDependentHandlers } from "../../hooks";
import styles from "./PlayerIcon.module.scss";
import ghostVoteIcon from "../../assets/T_GhostVote.png";
import { CHARACTER_IMAGES } from "../../assets/characters/characterImages";
import { Character } from "@common/editions/editions";

type PlayerIconProps = {
  key: number;
  player: Player | ActiveStagePlayer;
  selectPlayer: (player: Player) => void;
  game: Game;
  onToggleContextMenu: (openState: boolean) => void;
  conditionalShow: boolean;
};

const PlayerIcon: React.FC<PlayerIconProps> = ({
  player,
  selectPlayer,
  game,
  onToggleContextMenu,
  conditionalShow,
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
    isSetup(game)
      ? { onShortPress: openContextMenu, onLongPress: undefined }
      : {
          onShortPress: handleSelectPlayer,
          onLongPress: openContextMenu,
        },
    500
  );

  // set --character-image-url to the character's image in useffect
  useEffect(() => {
    const gameIsFinishedAndShouldRevealCharacter =
      isFinished(game) && game.revealedPlayers.includes(player.id);
    const shouldRevealCharacter =
      conditionalShow &&
      playerIconRef.current &&
      player.character &&
      (globals.value.storytellerMode || gameIsFinishedAndShouldRevealCharacter);
    if (shouldRevealCharacter) {
      playerIconRef.current.style.setProperty(
        "--character-image-url",
        `url(${CHARACTER_IMAGES[player.character as Character]})`
      );
    } else if (playerIconRef.current) {
      playerIconRef.current.style.setProperty(
        "--character-image-url",
        `url("")`
      );
    }
  }, [
    conditionalShow,
    playerIconRef,
    player.character,
    globals.value.storytellerMode,
    game,
    player.id,
  ]);

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
        <div className={styles.characterUnderlay} />
      </div>
      {isDay(game) && isInactiveNomination(game) && !canNominate && !isDead && (
        <div
          className={classnames({
            [styles.forbiddenCircle]: true,
          })}
        >
          <span>😡</span>
        </div>
      )}
      {isDay(game) && !isActiveNomination(game) && !canBeNominated && (
        <div
          className={classnames({
            [styles.forbiddenCircle]: true,
            [styles.cannotBeNominated]: true,
          })}
        >
          <span>😨</span>
        </div>
      )}
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
