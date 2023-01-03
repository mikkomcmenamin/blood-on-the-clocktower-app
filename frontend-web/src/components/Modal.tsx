import { useRef } from "react";
import { useClickOutside } from "../hooks";
import styles from "./Modal.module.scss";

export type ModalProps = {
  children: React.ReactNode;
  modalRef?: React.RefObject<HTMLDivElement>;
  onClose: () => void;
};

const Modal: React.FC<ModalProps> = ({ children, modalRef, onClose }) => {
  const defaultRef = useRef<HTMLDivElement>(null);
  const effectiveRef = modalRef ?? defaultRef;
  useClickOutside(effectiveRef, onClose);
  return (
    <div className={styles.modal}>
      <div ref={effectiveRef} className={styles.modalContent}>
        <div className={styles.closeModalX} onClick={() => onClose()}>
          X
        </div>
        {children}
      </div>
    </div>
  );
};

export default Modal;
