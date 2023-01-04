import { GameAction } from "@common/gameLogic";
import Modal from "../Modal";
import styles from "./FinishGameModal.module.scss";

const FinishGameModal: React.FC<{
  dispatch: (action: GameAction) => void;
  onClose: () => void;
}> = ({ dispatch, onClose }) => {
  return (
    <Modal onClose={onClose}>
      <h2>Finish game</h2>
      <p>Which team won?</p>
      <div className={styles.finishGameModalButtons}>
        <button
          onClick={() => {
            dispatch({
              type: "stageTransitionToFinished",
              stage: "active",
              payload: "evil",
            });
            onClose();
          }}
        >
          Evil
        </button>
        <button
          onClick={() => {
            dispatch({
              type: "stageTransitionToFinished",
              stage: "active",
              payload: "good",
            });
            onClose();
          }}
        >
          Good
        </button>
      </div>
    </Modal>
  );
};

export default FinishGameModal;
