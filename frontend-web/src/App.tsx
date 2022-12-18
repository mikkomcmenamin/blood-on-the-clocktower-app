import { useEffect, useLayoutEffect, useRef, useState } from "react";
import bgVideo from "./assets/bgv.webm";
import clockHand from "./assets/clockhand.png";
import { fakeNamesList } from "./util";
import "./App.scss";

let id = 0;

const nextId = () => id++;

type Player = {
  name: string;
  id: number;
};

const createPlayer = (name: string): Player => ({
  name,
  id: nextId(),
});

function useClickOutside(
  ref: React.RefObject<HTMLElement>,
  callback: () => void
) {
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        callback();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [ref, callback]);
}

function App() {
  const [players, setPlayers] = useState<Player[]>(
    Array.from({ length: 0 }, (_, i) => createPlayer(fakeNamesList[i]))
  );
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [newPlayerName, setNewPlayerName] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  console.log(players);

  const selectedPlayerId = selectedPlayer?.id ?? -1;

  useLayoutEffect(() => {
    // set the --num-players css variable defined on .App to be the number of players
    document.body.style.setProperty("--num-players", players.length.toString());
  }, [players.length]);

  useLayoutEffect(() => {
    if (selectedPlayerId === -1) {
      // unset the property
      document.body.style.removeProperty("--selected-player-id");
      return;
    }
    // set the --selected-player-id css variable defined on .App to be the id of the selected player
    document.body.style.setProperty(
      "--selected-player-id",
      selectedPlayerId.toString()
    );
  }, [selectedPlayerId]);

  const handleNewPlayerNameChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setNewPlayerName(e.target.value);

  const handleAddPlayer = (e: any) => {
    e.preventDefault();
    setPlayers((players) => [...players, createPlayer(newPlayerName)]);
    setNewPlayerName("");
    setIsModalOpen(false);
  };

  const modalRef = useRef<HTMLDivElement>(null);
  const modalPlayerInputRef = useRef<HTMLInputElement>(null);

  useClickOutside(modalRef, () => setIsModalOpen(false));

  // autofocus the input field inside the modal when the modal becomes visible
  useEffect(() => {
    if (isModalOpen) {
      modalPlayerInputRef.current?.focus();
    }
  }, [isModalOpen]);

  // handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "+") {
        if (!isModalOpen) {
          e.preventDefault();
          setIsModalOpen(true);
        }
      }
      if (e.key === "Escape") {
        setIsModalOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // handle doubleclick: also open the modal
  useEffect(() => {
    const handleDoubleClick = () => {
      if (!isModalOpen) {
        setIsModalOpen(true);
      }
    };

    document.addEventListener("dblclick", handleDoubleClick);

    return () => document.removeEventListener("dblclick", handleDoubleClick);
  }, [isModalOpen]);

  return (
    <div className="App">
      <div id="background-video">
        <video autoPlay muted loop>
          <source src={bgVideo} type="video/mp4" />
        </video>
        <div id="background-video-overlay"></div>
      </div>
      <div id="player-circle">
        {selectedPlayerId !== -1 && (
          <section className="clockhand">
            <img src={clockHand} alt="clock hand" />
          </section>
        )}
        {players.map((player) => (
          <div key={player.id} className="player">
            <div
              onClick={() => {
                setSelectedPlayer(player);
              }}
              className="player-content"
            >
              <div className="name">{player.name}</div>
            </div>
          </div>
        ))}
      </div>
      {isModalOpen && (
        <div className="modal">
          <div ref={modalRef} className="modal-content">
            <h2>Add a new player</h2>
            <form id="add-player-form" onSubmit={handleAddPlayer}>
              <input
                ref={modalPlayerInputRef}
                type="text"
                value={newPlayerName}
                onChange={handleNewPlayerNameChange}
              />
              <div className="buttons">
                <button type="submit" onClick={handleAddPlayer}>
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
