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

  return (
    <div className={styles.playerRotator}>
      <div
        data-playerid={player.id}
        onClick={() => {
          selectPlayer(player);
        }}
        draggable
        onDragStart={(e) => {
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
