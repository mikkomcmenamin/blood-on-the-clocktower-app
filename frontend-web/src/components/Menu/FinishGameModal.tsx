import { useAtomValue } from "jotai";
import { actionsAtom } from "../../atoms/gameAtoms";
import Modal from "../Modal";
import styles from "./FinishGameModal.module.scss";

const FinishGameModal: React.FC<{
  onClose: () => void;
}> = ({ onClose }) => {
  const actions = useAtomValue(actionsAtom);
  return (
    <Modal onClose={onClose}>
      <h2>Finish game</h2>
      <p>Which team won?</p>
      <div className={styles.finishGameModalButtons}>
        <button
          onClick={() => {
            actions.stageTransitionToFinished("evil");
            onClose();
          }}
        >
          Evil
        </button>
        <button
          onClick={() => {
            actions.stageTransitionToFinished("good");
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
