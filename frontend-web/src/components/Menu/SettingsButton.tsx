import React from "react";
import styles from "./SettingsButton.module.scss";

type Props = {
  handleClick: () => void;
};

const SettingsButton: React.FC<Props> = ({ handleClick }) => {
  return <button className={styles.button} onClick={handleClick} />;
};

export default SettingsButton;
