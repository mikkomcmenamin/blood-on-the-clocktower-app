import styles from "./Modal.module.scss";

export type ModalProps = {
  children: React.ReactNode;
  modalRef: React.RefObject<HTMLDivElement>;
};

const Modal: React.FC<ModalProps> = ({ children, modalRef }) => {
  return (
    <div className={styles.modal}>
      <div ref={modalRef} className={styles.modalContent}>
        {children}
      </div>
    </div>
  );
};

export default Modal;
