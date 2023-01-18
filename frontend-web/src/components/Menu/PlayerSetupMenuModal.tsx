import { Reorder } from "framer-motion";
import { useAtomValue } from "jotai";
import { actionsAtom, gameAtom } from "../../atoms/gameAtoms";
import Modal from "../Modal";
import styles from "./ReorderPlayersModal.module.scss";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { createSetupStagePlayer } from "@common/model";

type Props = {
  onClose: () => void;
};

const ReorderPlayersModal = ({ onClose }: Props) => {
  const game = useAtomValue(gameAtom);
  const actions = useAtomValue(actionsAtom);

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
    actions.addPlayer(createSetupStagePlayer(newPlayerName, game.players));
    setNewPlayerName("");
  };

  return (
    <Modal onClose={onClose}>
      <div className={styles.container}>
        <h4>Player setup menu</h4>
        {game.players.length > 0 && (
          <Reorder.Group
            style={{
              listStyleType: "none",
              width: "100%",
            }}
            onReorder={(order) => {
              actions.replaceState({
                ...game,
                players: order,
              });
            }}
            values={game.players}
            axis="y"
          >
            {game.players.map((player) => (
              <Reorder.Item value={player} key={player.id}>
                <motion.div layout className={styles.playerButton}>
                  <span>{player.name}</span>
                  <button
                    className={styles.remove}
                    onClick={() => actions.removePlayer(player.id)}
                  >
                    Remove
                  </button>
                </motion.div>
              </Reorder.Item>
            ))}
          </Reorder.Group>
        )}
        <div>
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
        </div>
      </div>
    </Modal>
  );
};

export default ReorderPlayersModal;
