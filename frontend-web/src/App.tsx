import { useEffect, useRef, useState } from "react";

import clockHandMinute from "./assets/clockhand.png";
import clockHandHour from "./assets/clockhand-hour.png";
import { cat, fakeNamesList } from "./util";
import "./App.scss";
import { Player, createPlayer, Nomination } from "./model";
import {
  useClickOutside,
  useHandleNominationUIEffects,
  useHandlePlayerCountChangeUIEffects,
} from "./hooks";
import Modal from "./components/Modal";
import Background from "./components/Background";
import PlayerIcon from "./components/Player/PlayerIcon";
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

  // when a player is clicked, start the nomination process
  // 1. if Nomination is state "inactive", set it to "pending" and set the nominating player
  // 2. if Nomination is state "pending", set it to "active" and set the nominated player
  function handleSelectPlayer(player: Player) {
    if (
      nomination.state === "inactive" ||
      player.id === nomination.nominator.id ||
      nomination.state === "active"
    ) {
      setNomination({
        state: "pending",
        nominator: player,
      });
    } else if (nomination.state === "pending") {
      setNomination({
        ...nomination,
        state: "active",
        nominee: player,
        voters: [],
      });
    }
  }

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
