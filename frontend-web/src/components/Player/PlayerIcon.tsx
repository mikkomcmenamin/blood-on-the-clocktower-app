import { Nomination, Player } from "@common/model";
import { classnames } from "@common/util";
import styles from "./PlayerIcon.module.scss";

type PlayerIconProps = {
  key: number;
  player: Player;
  selectPlayer: (player: Player) => void;
  onDragPlayer: (e: React.DragEvent<HTMLDivElement>, id: number) => void;
  nomination: Nomination;
};

const PlayerIcon: React.FC<PlayerIconProps> = ({
  player,
  selectPlayer,
  onDragPlayer,
  nomination,
}) => {
  return (
    <div className={styles.playerRotator}>
      <div
        onClick={() => {
          selectPlayer(player);
        }}
        draggable
        onDragStart={(e) => {
          e.dataTransfer.setData("application/botc", player.id.toString());
        }}
        className={classnames({
          [styles.playerContent]: true,
          [styles.nominator]: isNominator(player, nomination),
          [styles.nominee]: isNominee(player, nomination),
          [styles.notInvolvedInNomination]: notInvolvedInNomination(
            player,
            nomination
          ),
          [styles.shroud]: "alive" in player && !player.alive,
        })}
      >
        <div className={styles.name}>{player.name}</div>
      </div>
    </div>
  );
};

const isNominator = (player: Player, nomination: Nomination) =>
  nomination.state !== "inactive" && nomination.nominator.id === player.id;

const isNominee = (player: Player, nomination: Nomination) =>
  nomination.state === "active" && nomination.nominee.id === player.id;

const notInvolvedInNomination = (player: Player, nomination: Nomination) =>
  nomination.state === "active" &&
  ![nomination.nominator.id, nomination.nominee.id].includes(player.id);

export default PlayerIcon;
