import {Nomination, Player} from "../../model";
import {classnames} from "../../util";
import "./PlayerIcon.scss";

type PlayerIconProps = {
  player: Player
  selectPlayer: (player: Player) => void
  nomination: Nomination
}

const PlayerIcon: React.FC<PlayerIconProps> = ({player, selectPlayer, nomination}) => {
  return (
    <div key={player.id} className="player">
      <div
        onClick={() => {
          selectPlayer(player);
        }}
        className={classnames({
          "player-content": true,
          "in-nomination":
            isNominator(player, nomination) ||
            isNominee(player, nomination),
          nominator: isNominator(player, nomination),
          nominee: isNominee(player, nomination),
          shroud: "alive" in player && !player.alive,
        })}
      >
        <div className="name">{player.name}</div>
      </div>
    </div>
  )
}

const isNominator = (player: Player, nomination: Nomination) =>
  nomination.state !== "inactive" && nomination.nominator.id === player.id;

const isNominee = (player: Player, nomination: Nomination) =>
  nomination.state === "active" && nomination.nominee.id === player.id;

export default PlayerIcon;