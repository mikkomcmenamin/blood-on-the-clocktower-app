import { GameAction, isDay } from "@common/gameLogic";
import { Game } from "@common/model";
import { useState } from "react";
import { usePrevious } from "../../hooks";
import Modal from "../Modal";
import styles from "./ErrorRecoveryMenuModal.module.scss";

const ErrorRecoveryMenuModal: React.FC<{
  dispatch: (action: GameAction) => void;
  onClose: () => void;
  game: Extract<Game, { stage: "active" }>;
}> = ({ dispatch, onClose, game }) => {
  const [onTheBlockForm, setOnTheBlockForm] = useState<{
    playerId: number;
    votes: number;
  } | null>(game.phase.phase === "day" ? game.phase.onTheBlock ?? null : null);

  const previousFormState = usePrevious(onTheBlockForm);

  if (game.phase.phase !== "day") return null;

  if (onTheBlockForm !== previousFormState) {
    const { onTheBlock: _, ...rest } = game.phase;
    dispatch({
      type: "replaceState",
      payload: {
        ...game,
        phase: onTheBlockForm
          ? {
              ...game.phase,
              onTheBlock: onTheBlockForm,
            }
          : rest,
      },
    });
  }

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
      <div className={styles.onTheBlock}>
        <span>About to die?</span>
        {(() => {
          const playerOnTheBlock = game.players.find(
            (p) => isDay(game) && p.id === game.phase.onTheBlock?.playerId
          );

          return (
            <div className={styles.onTheBlockForm}>
              <select
                value={playerOnTheBlock?.id ?? ""}
                onChange={(e) => {
                  if (e.target.value === "") {
                    setOnTheBlockForm(null);
                    return;
                  }

                  setOnTheBlockForm({
                    playerId: parseInt(e.target.value),
                    votes:
                      onTheBlockForm?.votes ??
                      Math.ceil(game.players.length / 2),
                  });
                }}
              >
                <option value="">None</option>
                {game.players.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
              <select
                value={onTheBlockForm?.votes ?? 0}
                disabled={!onTheBlockForm}
                onChange={(e) => {
                  setOnTheBlockForm({
                    playerId: playerOnTheBlock?.id ?? 0,
                    votes: parseInt(e.target.value),
                  });
                }}
              >
                {Array.from({ length: game.players.length }, (_, i) => i + 1)
                  .slice(Math.ceil(game.players.length / 2))
                  .map((i) => (
                    <option key={i} value={i} label={`${i} votes`}>
                      {i}
                    </option>
                  ))}
              </select>
            </div>
          );
        })()}
      </div>
    </Modal>
  );
};

export default ErrorRecoveryMenuModal;
