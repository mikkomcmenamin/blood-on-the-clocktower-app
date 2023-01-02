import React from "react";
import { EDITIONS } from "@common/editions/editions";
import Modal from "../Modal";
import styles from "./EditionModal.module.scss";
import Button from "../Reusable/Button";

type Props = {
  onClose: () => void;
  //modalRef: React.RefObject<HTMLDivElement>;
};

const EditionModal: React.FC<Props> = ({ onClose }) => {
  const editions = Object.values(EDITIONS);

  return (
    <Modal onClose={onClose}>
      <h1 className={styles.title}>Choose Edition</h1>

      {editions.map((edition) => (
        <Button onClick={onClose}>{edition.name}</Button>
      ))}
    </Modal>
  );
};

export default EditionModal;
