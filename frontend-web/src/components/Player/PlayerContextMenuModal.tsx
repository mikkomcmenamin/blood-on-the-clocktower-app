import { Game } from "@common/model";
import Modal, { ModalProps } from "../Modal";
import styles from "./PlayerContextMenuModal.module.scss";

type Props = Omit<ModalProps, "children"> & {
  playerId: number;
  game: Game;
  onKillOrResurrect: (playerId: number) => void;
  onClose: () => void;
};

const PlayerContextMenuModal: React.FC<Props> = ({
  playerId,
  game,
  onKillOrResurrect,
  onClose,
  modalRef,
}) => {
  const player = game.players.find((p) => p.id === playerId)!;
  const isAlive = "alive" in player && player.alive;

  return (
    <Modal modalRef={modalRef}>
      <h2>{player.name}</h2>
      <button
        className={styles.button}
        onClick={() => {
          onKillOrResurrect(player.id);
          onClose();
        }}
      >
        {isAlive ? "Kill player" : "Resurrect player"}
      </button>
    </Modal>
  );
};

export default PlayerContextMenuModal;
