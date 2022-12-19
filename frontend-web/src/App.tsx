import { useEffect, useRef, useState } from "react";
import { fakeNamesList } from "./util";
import "./App.scss";
import { Player, createPlayer, Nomination } from "./model";
import {
  useClickOutside,
  useHandleNominationUIEffects,
  useHandlePlayerCountChangeUIEffects,
} from "./hooks";
import Modal from "./components/Modal";
import Background from "./components/Background";
import GameBoard from "./components/GameBoard/GameBoard";

const initialPlayers = Array.from({ length: 3 }, (_, i) =>
  createPlayer(fakeNamesList[i])
);

function App() {
  const [players, setPlayers] = useState<Player[]>(initialPlayers);
  const [nomination, setNomination] = useState<Nomination>({
    state: "inactive",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  useHandlePlayerCountChangeUIEffects(players);
  useHandleNominationUIEffects(nomination);

  const addPlayer = (name: string) => {
    setPlayers((players) => [...players, createPlayer(name)]);
    setIsModalOpen(false);
  };

  // close the modal when clicking outside of it
  const modalRef = useRef<HTMLDivElement>(null);
  useClickOutside(modalRef, () => setIsModalOpen(false));

  // handle keyboard and mouse shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // open the modal when pressing the "+" or Space key
      if (e.key === "+" || e.key === " ") {
        if (!isModalOpen) {
          e.preventDefault();
          setIsModalOpen(true);
        }
      }
      // close the modal when pressing the "Escape" key
      // if modal is not open, cancel the current nomination
      if (e.key === "Escape") {
        e.preventDefault();
        setIsModalOpen(false);
        if (!isModalOpen) {
          setNomination({ state: "inactive" });
        }
      }
    };

    // open the modal when double-clicking
    const handleDoubleClick = () => {
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
  }, [isModalOpen]);

  return (
    <div className="App">
      <Background />
      <GameBoard players={players} nomination={nomination} setNomination={setNomination}/>

      <nav id="controls">
        <div aria-roledescription="navigation" id="menu">
          <button
            onClick={() => {
              setIsModalOpen(true);
            }}
          >
            Menu option 1
          </button>
          <button onClick={() => setIsModalOpen(true)}>Menu option 2</button>
          <button
            onClick={() => {
              setIsModalOpen(true);
            }}
          >
            Menu option 3
          </button>
          <button onClick={() => setIsModalOpen(true)}>Menu option 4</button>
        </div>
      </nav>
      {isModalOpen && <Modal addPlayer={addPlayer} modalRef={modalRef} />}
    </div>
  );
}

export default App;
