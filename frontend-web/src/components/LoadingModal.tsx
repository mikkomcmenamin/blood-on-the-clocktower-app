import Modal from "./Modal";
import styles from "./LoadingModal.module.scss";

const LoadingModal = () => {
  return (
    <Modal>
      <div className={styles.loadingModal}>
        <div className={styles.loadingSpinner} />
        <div className={styles.loadingText}>
          Awaiting connection to server...
        </div>
        <div className={styles.loadingTextSmall}>
          This might take a while if the server is sleeping due to inactivity.
          Try reloading if this takes too long.
        </div>
      </div>
    </Modal>
  );
};

export default LoadingModal;
