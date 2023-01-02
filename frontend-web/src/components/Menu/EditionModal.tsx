import { EditionId, EDITIONS } from "@common/editions/editions";
import Modal from "../Modal";
import styles from "./EditionModal.module.scss";
import Button from "../Reusable/Button";

type Props = {
  onClose: () => void;
  onEditionChosen: (edition: EditionId) => void;
};

const EditionModal: React.FC<Props> = ({ onClose, onEditionChosen }) => {
  const editions = Object.values(EDITIONS);

  const handleButtonClick = (edition: EditionId) => {
    onEditionChosen(edition);
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
