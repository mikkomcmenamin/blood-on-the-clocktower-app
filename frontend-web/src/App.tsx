import { useEffect, useReducer, useRef, useState } from "react";
import { fakeNamesList } from "./util";
import "./App.scss";
import { Player, createSetupStagePlayer, Nomination, Game } from "./model";
import {
  useClickOutside,
  useHandleNominationUIEffects,
  useHandlePlayerCountChangeUIEffects,
} from "./hooks";
import Modal from "./components/Modal";
import Background from "./components/Background";
import GameBoard from "./components/GameBoard/GameBoard";
import { gameStateReducer } from "./gameLogic";

const initialPlayers = Array.from({ length: 3 }, (_, i) =>
  createSetupStagePlayer(fakeNamesList[i])
);

const initialGameState: Game = {
  stage: "setup",
  players: initialPlayers,
};

function App() {
  const [game, dispatch] = useReducer(gameStateReducer, initialGameState);
  const [isModalOpen, setIsModalOpen] = useState(false);

  console.log(game);

  const nomination =
    game.stage === "active" && game.phase.phase === "day"
      ? game.phase.nomination
      : { state: "inactive" as const };

  useHandlePlayerCountChangeUIEffects(game.players);
  useHandleNominationUIEffects(nomination);

  const addPlayer = (name: string) => {
    dispatch({
      type: "addPlayer",
      stage: "setup",
      payload: createSetupStagePlayer(name),
    });
    setIsModalOpen(false);
  };

  // close the modal when clicking outside of it
  const modalRef = useRef<HTMLDivElement>(null);
  useClickOutside(modalRef, () => setIsModalOpen(false));

  // handle keyboard and mouse shortcuts
  useEffect(() => {
    const isSetup = game.stage === "setup";
    const isDay = game.stage === "active" && game.phase.phase === "day";
    const handleKeyDown = (e: KeyboardEvent) => {
      // open the modal when pressing the "+" or Space key
      if (e.key === "+" || e.key === " ") {
        if (isSetup && !isModalOpen) {
          e.preventDefault();
          setIsModalOpen(true);
        }
      }
      // close the modal when pressing the "Escape" key
      // if modal is not open, cancel the current nomination
      if (e.key === "Escape") {
        e.preventDefault();
        if (isSetup) {
          setIsModalOpen(false);
        }

        if (isDay) {
          dispatch({ type: "cancelNomination", stage: "active" });
        }
      }
    };

    // open the modal when double-clicking
    const handleDoubleClick = () => {
      if (!isSetup) return;
      if (!isModalOpen) {
        setIsModalOpen(true);
      }
    };

    document.addEventListener("dblclick", handleDoubleClick);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.addEventListener("dblclick", handleDoubleClick);
    };
  }, [isModalOpen, game]);

  // when a player is clicked, start the nomination process
  // 1. if Nomination is state "inactive", set it to "pending" and set the nominating player
  // 2. if Nomination is state "pending", set it to "active" and set the nominated player
  function handleSelectPlayer(playerId: number) {
    if (game.stage !== "active") return;
    if (game.phase.phase !== "day") return;
    const player = game.players.find((p) => p.id === playerId)!;
    if (
      nomination.state === "inactive" ||
      playerId === nomination.nominator.id ||
      nomination.state === "active"
    ) {
      dispatch({
        type: "setNominator",
        stage: "active",
        payload: player,
      });
    } else if (nomination.state === "pending") {
      dispatch({
        type: "setNominee",
        stage: "active",
        payload: player,
      });
    }
  }

  return (
    <div className="App">
      <div className="gameStageIndicator">
        {(() => {
          switch (game.stage) {
            case "setup":
              return "Game stage: Setup";
            case "active": {
              if (game.phase.phase === "day") {
                return `Game stage: Day ${game.phase.dayNumber}`;
              }
              return `Game stage: Night ${game.phase.nightNumber}`;
            }
            case "finished":
              return "Game stage: Finished";
          }
        })()}
      </div>
      <Background phase={game.stage === "active" ? game.phase.phase : "day"} />
      <GameBoard
        players={game.players}
        nomination={nomination}
        onSelectPlayer={handleSelectPlayer}
        onClickOutside={() => {
          if (nomination.state !== "inactive") {
            dispatch({ type: "cancelNomination", stage: "active" });
          }
        }}
      />

      <nav id="controls">
        <div aria-roledescription="navigation" id="menu">
          {game.stage === "setup" && (
            <button
              onClick={(e) => {
                e.preventDefault();
                dispatch({ type: "stageTransitionToActive", stage: "setup" });
              }}
            >
              Start game
            </button>
          )}
          {game.stage === "active" && (
            <button
              onClick={(e) => {
                e.preventDefault();
                dispatch({
                  type: "stageTransitionToFinished",
                  stage: "active",
                  payload: "good",
                });
              }}
            >
              Finish game
            </button>
          )}
          {game.stage === "active" && (
            <button
              onClick={(e) => {
                e.preventDefault();
                dispatch(
                  game.phase.phase === "day"
                    ? { type: "phaseTransitionToNight", stage: "active" }
                    : { type: "phaseTransitionToDay", stage: "active" }
                );
              }}
            >
              {game.phase.phase === "day"
                ? "Transition to night"
                : "Transition to day"}
            </button>
          )}
        </div>
      </nav>
      {isModalOpen && <Modal addPlayer={addPlayer} modalRef={modalRef} />}
    </div>
  );
}

export default App;
