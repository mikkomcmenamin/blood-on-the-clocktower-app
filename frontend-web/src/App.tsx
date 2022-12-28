import { useContext, useEffect, useReducer, useRef, useState } from "react";
import { createTRPCProxyClient, createWSClient, wsLink } from "@trpc/client";
import type { AppRouter } from "@common/router";
import "./App.scss";
import {
  createSetupStagePlayer,
  initialGameState,
  Player,
} from "@common/model";
import {
  useClickOutside,
  useHandleNominationUIEffects,
  useHandlePlayerCountChangeUIEffects,
  useWindowInnerWidth,
} from "./hooks";
import Background from "./components/Background";
import GameBoard from "./components/GameBoard/GameBoard";
import {
  calculateVotesRequired,
  GameAction,
  gameStateReducer,
  isDay,
  isNight,
  isSetup,
  playerCanBeNominated,
  playerCanNominate,
  playerCanVote,
} from "@common/gameLogic";
import Menu from "./components/Menu/Menu";
import InfoPanel from "./components/InfoPanel";
import SoundPlayer from "./components/SoundPlayer";
import NightLoop from "./assets/S_NightLoop.mp3";
import VideoAnimation from "./components/VideoAnimation";
import ReaperVideo from "./assets/V_Reaper.mp4";
import AddPlayerModal from "./components/Player/AddPlayerModal";
import { AppContext } from "./context";

// create persistent WebSocket connection
const wsClient = createWSClient({
  url: `ws://${window.location.hostname}:2022`,
});
// configure TRPCClient to use WebSockets transport
const client = createTRPCProxyClient<AppRouter>({
  links: [
    wsLink({
      client: wsClient,
    }),
  ],
});

client.onHeartbeat.subscribe(undefined, {
  onData: () => {
    // console.log("heartbeat", data);
  },
  onError: (err) => {
    console.error(err);
  },
});

function App() {
  const [game, _dispatch] = useReducer(gameStateReducer, initialGameState);
  const [isAddPlayerModalOpen, setIsAddPlayerModalOpen] = useState(false);
  const globals = useContext(AppContext);

  const dispatch = (action: GameAction) => {
    _dispatch(action);
    client.gameAction.mutate(action);
  };

  useEffect(() => {
    const unsub = client.onGameAction.subscribe(undefined, {
      onData: (data) => {
        console.log("Got server state", data);
        _dispatch({ type: "replaceState", payload: data });
      },
      onError: (err) => {
        console.error(err);
      },
    });
    return () => {
      unsub.unsubscribe();
    };
  }, []);

  const nomination = isDay(game)
    ? game.phase.nomination
    : { state: "inactive" as const };

  useHandlePlayerCountChangeUIEffects(game.players);
  useHandleNominationUIEffects(nomination, game.players);

  const addPlayer = (name: string, existingPlayers: Player[]) => {
    dispatch({
      type: "addPlayer",
      stage: "setup",
      payload: createSetupStagePlayer(name, existingPlayers),
    });
    setIsAddPlayerModalOpen(false);
  };

  const removePlayer = (id: number) => {
    if (game.stage !== "setup") {
      return;
    }
    dispatch({ type: "removePlayer", stage: "setup", payload: id });
  };

  // close the modal when clicking outside of it
  const addPlayerModalRef = useRef<HTMLDivElement>(null);
  useClickOutside(addPlayerModalRef, () => setIsAddPlayerModalOpen(false));

  // handle keyboard and mouse shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // open the modal when pressing the "+" or Space key
      if (e.key === "+" || e.key === " ") {
        if (isSetup(game) && !isAddPlayerModalOpen) {
          e.preventDefault();
          setIsAddPlayerModalOpen(true);
        }
      }
      // close the modal when pressing the "Escape" key
      // if modal is not open, cancel the current nomination
      if (e.key === "Escape") {
        e.preventDefault();
        if (isSetup(game)) {
          setIsAddPlayerModalOpen(false);
        }

        if (isDay(game)) {
          dispatch({ type: "cancelNomination", stage: "active" });
        }
      }
    };

    // open the modal when double-clicking
    const handleDoubleClick = () => {
      if (!isSetup(game)) return;
      if (!isAddPlayerModalOpen) {
        setIsAddPlayerModalOpen(true);
      }
    };

    document.addEventListener("dblclick", handleDoubleClick);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("dblclick", handleDoubleClick);
    };
  }, [isAddPlayerModalOpen, game]);

  function handleNomination(playerId: number) {
    if (!isDay(game)) return;
    const player = game.players.find((p) => p.id === playerId)!;
    if (nomination.state === "inactive") {
      if (!playerCanNominate(player, game)) {
        return;
      }
      dispatch({
        type: "setNominator",
        stage: "active",
        payload: player,
      });
    } else if (nomination.state === "pending") {
      if (!playerCanBeNominated(player, game)) {
        return;
      }
      dispatch({
        type: "setNominee",
        stage: "active",
        payload: player,
      });
    } else {
      // Count the player's vote if they can vote
      if (!playerCanVote(player, game)) {
        return;
      }
      dispatch({
        type: "toggleVote",
        stage: "active",
        payload: player,
      });
    }
  }

  function toggleDeathReminder(playerId: number, onState?: boolean) {
    if (!globals.value.storytellerMode) {
      return;
    }

    const deathReminders = globals.value.deathReminders;

    const updatedDeathReminders =
      onState ?? !deathReminders.includes(playerId)
        ? [...deathReminders, playerId]
        : deathReminders.filter((id) => id !== playerId);

    globals.setValue({
      ...globals.value,
      deathReminders: updatedDeathReminders,
    });
  }

  function handleSelectPlayer(playerId: number) {
    if (isDay(game)) {
      handleNomination(playerId);
      return;
    } else if (isNight(game)) {
      toggleDeathReminder(playerId);
    }
  }

  function getGameStateText(): string {
    switch (game.stage) {
      case "setup":
        return "Setup Players";
      case "active": {
        if (isDay(game)) {
          return `Day ${game.phase.dayNumber}`;
        } else if (isNight(game)) {
          return `Night ${game.phase.nightNumber}`;
        }
      }
      case "finished":
        return "Game Finished";
    }
  }

  const windowInnerWidth = useWindowInnerWidth();
  const MOBILE_THRESHOLD = 768;

  const onTheBlock = isDay(game) && game.phase.onTheBlock;

  console.log(onTheBlock);

  return (
    <div className="App">
      <InfoPanel position={"top-left"}>
        <p>{getGameStateText()}</p>
      </InfoPanel>
      <Background phase={isNight(game) ? "night" : "day"} />
      <GameBoard
        game={game}
        onSelectPlayer={handleSelectPlayer}
        onModifyPlayers={(players) => {
          dispatch({
            type: "modifyPlayers",
            stage: "setup",
            payload: players,
          });
        }}
        onDeletePlayer={removePlayer}
        onCancelNomination={() => {
          if (nomination.state !== "inactive") {
            dispatch({ type: "cancelNomination", stage: "active" });
          }
        }}
        onKillOrResurrect={(playerId: number) => {
          if (!isNight(game) && !isDay(game)) return;
          const player = game.players.find((p) => p.id === playerId)!;
          dispatch({
            type: "togglePlayerAliveStatus",
            stage: "active",
            payload: player,
          });
          toggleDeathReminder(playerId, false);
        }}
      />

      <Menu game={game} dispatch={dispatch} />
      {isAddPlayerModalOpen && (
        <AddPlayerModal
          onClose={() => setIsAddPlayerModalOpen(false)}
          addPlayer={(p) => addPlayer(p, game.players)}
          modalRef={addPlayerModalRef}
        />
      )}
      {(nomination.state === "active" || onTheBlock) &&
        windowInnerWidth > MOBILE_THRESHOLD && (
          <div>
            <InfoPanel position={"top-right"}>
              <p>Votes required: {calculateVotesRequired(game)}</p>
            </InfoPanel>
            <InfoPanel position={"top-right-2"}>
              {onTheBlock && (
                <p>
                  {game.players.find((p) => p.id === onTheBlock.playerId)!.name}{" "}
                  about to die
                </p>
              )}
              {nomination.state === "active" &&
                nomination.voters.length > 0 && (
                  <p>{nomination.voters.length} votes given</p>
                )}
            </InfoPanel>
          </div>
        )}
      {isNight(game) && <SoundPlayer src={NightLoop} loop={true} />}
      {isNight(game) && <VideoAnimation src={ReaperVideo} />}
    </div>
  );
}

export default App;
