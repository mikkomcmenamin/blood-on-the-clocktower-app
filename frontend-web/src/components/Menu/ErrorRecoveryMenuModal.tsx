import { GameAction } from "@common/gameLogic";
import { Game } from "@common/model";
import Modal from "../Modal";
import styles from "./ErrorRecoveryMenuModal.module.scss";

const ErrorRecoveryMenuModal: React.FC<{
  dispatch: (action: GameAction) => void;
  onClose: () => void;
  game: Extract<Game, { stage: "active" }>;
}> = ({ dispatch, onClose, game }) => {
  // Should show each player in a list with:
  // - their name
  // - have they nominated today (checkbox)
  // - have they been nominated today (checkbox)
  // - are they alive or dead (checkbox)
  // - if dead, do they have a ghost vote
  //
  // Ticking those boxes should update the game state using dispatch
  if (game.phase.phase !== "day") return null;

  return (
    <Modal onClose={onClose}>
      <h2>Error recovery menu</h2>
      <ul className={styles.errorRecoveryPlayerList}>
        {game.players.map((player) => {
          // typescript doesnt get it
          if (game.phase.phase !== "day") return null;
          return (
            <li className={styles.errorRecoveryPlayerListItem} key={player.id}>
              <span>{player.name}</span>
              <label>
                <input
                  type="checkbox"
                  checked={game.phase.nominationBookkeeping.hasNominated.includes(
                    player.id
                  )}
                  onChange={(e) => {
                    // typescript doesnt get it
                    if (game.phase.phase !== "day") return null;
                    const toggleState = e.target.checked;
                    dispatch({
                      type: "replaceState",
                      payload: {
                        ...game,
                        phase: {
                          ...game.phase,
                          nominationBookkeeping: {
                            ...game.phase.nominationBookkeeping,
                            hasNominated: toggleState
                              ? [
                                  ...game.phase.nominationBookkeeping
                                    .hasNominated,
                                  player.id,
                                ]
                              : game.phase.nominationBookkeeping.hasNominated.filter(
                                  (id) => id !== player.id
                                ),
                          },
                        },
                      },
                    });
                  }}
                />
                Nom
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={game.phase.nominationBookkeeping.hasBeenNominated.includes(
                    player.id
                  )}
                  onChange={(e) => {
                    // typescript doesnt get it
                    if (game.phase.phase !== "day") return null;
                    const toggleState = e.target.checked;
                    dispatch({
                      type: "replaceState",
                      payload: {
                        ...game,
                        phase: {
                          ...game.phase,
                          nominationBookkeeping: {
                            ...game.phase.nominationBookkeeping,
                            hasBeenNominated: toggleState
                              ? [
                                  ...game.phase.nominationBookkeeping
                                    .hasBeenNominated,
                                  player.id,
                                ]
                              : game.phase.nominationBookkeeping.hasBeenNominated.filter(
                                  (id) => id !== player.id
                                ),
                          },
                        },
                      },
                    });
                  }}
                />
                Nom'd
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={player.alive}
                  onChange={(e) => {
                    // typescript doesnt get it
                    if (game.phase.phase !== "day") return null;
                    const setAlive = e.target.checked;
                    dispatch({
                      type: "replaceState",
                      payload: {
                        ...game,
                        players: game.players.map((p) =>
                          p.id === player.id
                            ? setAlive
                              ? {
                                  ...p,
                                  alive: true as const,
                                }
                              : {
                                  ...p,
                                  alive: false,
                                  ghostVote: true,
                                }
                            : p
                        ),
                      },
                    });
                  }}
                />
                Alive
              </label>
              <label>
                <input
                  type="checkbox"
                  disabled={player.alive}
                  checked={!player.alive && player.ghostVote}
                  onChange={(e) => {
                    // typescript doesnt get it
                    if (game.phase.phase !== "day") return null;
                    const setGhostVote = e.target.checked;
                    dispatch({
                      type: "replaceState",
                      payload: {
                        ...game,
                        players: game.players.map((p) =>
                          p.id === player.id
                            ? {
                                ...p,
                                ghostVote: setGhostVote,
                              }
                            : p
                        ),
                      },
                    });
                  }}
                />
                Ghost
              </label>
            </li>
          );
        })}
      </ul>
    </Modal>
  );
};

export default ErrorRecoveryMenuModal;
