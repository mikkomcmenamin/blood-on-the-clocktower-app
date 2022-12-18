import { useEffect, useLayoutEffect, useRef, useState } from "react";
import bgVideo from "./assets/bgv.webm";
import clockHandMinute from "./assets/clockhand.png";
import clockHandHour from "./assets/clockhand-hour.png";
import { cat, classnames, fakeNamesList } from "./util";
import "./App.scss";
import {
  createPlayer,
  Player,
  Nomination,
  isNominator,
  isNominee,
} from "./model";
import { useClickOutside } from "./hooks";
import Modal from "./components/Modal";

const initialPlayers = Array.from({ length: 3 }, (_, i) =>
  createPlayer(fakeNamesList[i])
);

function App() {
  const [players, setPlayers] = useState<Player[]>(initialPlayers);
  const [nomination, setNomination] = useState<Nomination>({
    state: "inactive",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  console.log({ players, nomination });

  useLayoutEffect(() => {
    // set the --num-players css variable defined on .App to be the number of players
    // this is used to calculate the rotation angle per player
    document.body.style.setProperty("--num-players", players.length.toString());
  }, [players.length]);

  // Handle setting the hour and minute hands of the clock to point at the nominating and nominated players respectively
  useEffect(() => {
    if (nomination.state === "inactive") {
      document.body.style.setProperty("--nominator-id", "0");
      document.body.style.setProperty("--nominee-id", "0");
      return;
    }

    if (nomination.state === "pending") {
      document.body.style.setProperty(
        "--nominator-id",
        nomination.nominator.id.toString()
      );
      document.body.style.setProperty("--nominee-id", "0");
      return;
    }

    if (nomination.state === "active") {
      document.body.style.setProperty(
        "--nominator-id",
        nomination.nominator.id.toString()
      );
      document.body.style.setProperty(
        "--nominee-id",
        nomination.nominee.id.toString()
      );
      return;
    }
  }, [nomination]);

  const addPlayer = (name: string) => {
      setPlayers((players) => [...players, createPlayer(name)]);
      setIsModalOpen(false);
  }

  // close the modal when clicking outside of it
  const modalRef = useRef<HTMLDivElement>(null);
  useClickOutside(modalRef, () => setIsModalOpen(false));

  // cancel the current nomination when clicking outside of the player-circle
  const playerCircleRef = useRef<HTMLDivElement>(null);
  useClickOutside(playerCircleRef, () => {
    if (nomination.state !== "inactive") {
      setNomination({ state: "inactive" });
    }
  });

  // handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // open the modal when pressing the "+" key
      if (e.key === "+") {
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

  // when a player is clicked, start the nomination process
  // 1. if Nomination is state "inactive", set it to "pending" and set the nominating player
  // 2. if Nomination is state "pending", set it to "active" and set the nominated player
  function handlePlayerClick(player: Player) {
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

  const showMinuteHand = nomination.state === "active";
  const showHourHand =
    nomination.state === "pending" || nomination.state === "active";

  return (
    <div className="App">
      <div id="background-video">
        <video autoPlay muted loop>
          <source src={bgVideo} type="video/mp4" />
        </video>
        <div id="background-video-overlay"></div>
      </div>
      <section id="play-area-container">
        <div
          id="player-circle"
          className={cat(
            nomination.state === "active" ? ["activeNomination"] : []
          )}
          ref={playerCircleRef}
        >
          {players.map((player) => (
            <div key={player.id} className="player">
              <div
                onClick={() => {
                  handlePlayerClick(player);
                }}
                className={classnames({
                  "player-content": true,
                  "in-nomination":
                    isNominator(player, nomination) ||
                    isNominee(player, nomination),
                  nominator: isNominator(player, nomination),
                  nominee: isNominee(player, nomination),
                  shroud: "alive" in player && !player.alive,
                })}
              >
                <div className="name">{player.name}</div>
              </div>
            </div>
          ))}
          <section
            style={{ visibility: showMinuteHand ? "visible" : "hidden" }}
            className="clockhand clockhand-minute"
          >
            <img src={clockHandMinute} alt="clock hand minute" />
          </section>
          <section
            style={{ visibility: showHourHand ? "visible" : "hidden" }}
            className="clockhand clockhand-hour"
          >
            <img src={clockHandHour} alt="clock hand hour" />
          </section>
        </div>
      </section>

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
      {isModalOpen && <Modal isOpen={isModalOpen} addPlayer={addPlayer} modalRef={modalRef} />}
    </div>
  );
}

export default App;
