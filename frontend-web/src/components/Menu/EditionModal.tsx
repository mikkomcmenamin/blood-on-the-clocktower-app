import React, { useContext } from "react";
import { EditionId, EDITIONS } from "@common/editions/editions";
import Modal from "../Modal";
import styles from "./EditionModal.module.scss";
import Button from "../Reusable/Button";
import { AppContext } from "../../context";

type Props = {
  onClose: () => void;
};

const EditionModal: React.FC<Props> = ({ onClose }) => {
  const editions = Object.values(EDITIONS);
  const globals = useContext(AppContext);

  const handleButtonClick = (edition: EditionId) => {
    globals.setValue({
      ...globals.value,
      edition: edition,
    });

    onClose();
  };

  return (
    <Modal onClose={onClose}>
      <h1 className={styles.title}>Choose Edition</h1>

      {editions.map((edition) => (
        <Button key={edition.id} onClick={() => handleButtonClick(edition.id)}>
          {edition.name}
        </Button>
      ))}
    </Modal>
  );
};

export default EditionModal;
