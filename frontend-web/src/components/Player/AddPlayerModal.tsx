import { useRef, useState, useEffect } from "react";
import Modal, { ModalProps } from "../Modal";
import styles from "./AddPlayerModal.module.scss";

type Props = Omit<ModalProps, "children"> & {
  addPlayer: (name: string) => void;
};

const AddPlayerModal: React.FC<Props> = ({ addPlayer, modalRef, onClose }) => {
  const playerInputRef = useRef<HTMLInputElement>(null);
  const [newPlayerName, setNewPlayerName] = useState("");

  useEffect(() => {
    playerInputRef.current?.focus();
  }, []);

  const handleNewPlayerNameChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setNewPlayerName(e.target.value);
  };

  const handleAddPlayer = (e: any) => {
    e.preventDefault();
    if (newPlayerName.length === 0) {
      return;
    }
    addPlayer(newPlayerName);
    setNewPlayerName("");
  };

  return (
    <Modal onClose={onClose} modalRef={modalRef}>
      <h2>Add a new player</h2>
      <form id="add-player-form" onSubmit={handleAddPlayer}>
        <input
          ref={playerInputRef}
          type="text"
          value={newPlayerName}
          onChange={handleNewPlayerNameChange}
        />
        <div className={styles.buttons}>
          <button
            className={styles.addPlayerButton}
            disabled={newPlayerName.length === 0}
            type="submit"
            onClick={handleAddPlayer}
          ></button>
        </div>
      </form>
    </Modal>
  );
};

export default AddPlayerModal;
