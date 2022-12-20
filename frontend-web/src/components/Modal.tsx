import { useRef, useState, useEffect } from "react";
import styles from "./Modal.module.scss";

type ModalProps = {
  addPlayer: (name: string) => void;
  modalRef: React.RefObject<HTMLDivElement>;
};

const Modal: React.FC<ModalProps> = ({ addPlayer, modalRef }) => {
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
    addPlayer(newPlayerName);
    setNewPlayerName("");
  };

  return (
    <div className={styles.modal}>
      <div ref={modalRef} className={styles.modalContent}>
        <h2>Add a new player</h2>
        <form id="add-player-form" onSubmit={handleAddPlayer}>
          <input
            ref={playerInputRef}
            type="text"
            value={newPlayerName}
            onChange={handleNewPlayerNameChange}
          />
          <div className={styles.buttons}>
            <button type="submit" onClick={handleAddPlayer}>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Modal;
