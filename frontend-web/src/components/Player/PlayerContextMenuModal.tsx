import { getCharactersInPlay, isSetup } from "@common/gameLogic";
import { Game, Player } from "@common/model";
import Modal, { ModalProps } from "../Modal";
import styles from "./PlayerContextMenuModal.module.scss";
import { EDITIONS, formatCharacterName } from "@common/editions/editions";
import { classnames } from "@common/util";
import { AppContext } from "../../context";
import { useContext } from "react";

const CHARACTER_BASE_URL = new URL("../../assets/characters", import.meta.url)
  .href;

type Props = Omit<ModalProps, "children"> & {
  playerId: number;
  game: Game;
  onKillOrResurrect: (playerId: number) => void;
  onModifyPlayer: (player: Player) => void;
  onRemovePlayer: (playerId: number) => void;
  onClose: () => void;
};

type PlayerIconContainerProps = {
  children: React.ReactNode;
  onLeftArrowClick: () => void;
  onRightArrowClick: () => void;
};

const EDITION_IDS = [
  "TROUBLE_BREWING",
  "SECTS_AND_VIOLETS",
  "BAD_MOON_RISING",
] as const;

// TODO get rid of these inline styles
const PlayerIconContainer: React.FC<PlayerIconContainerProps> = ({
  children,
  onLeftArrowClick,
  onRightArrowClick,
}) => {
  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        alignItems: "flex-start",
        position: "relative",
        paddingBlock: "1rem",
        gap: "1rem",
      }}
    >
      <button onClick={onLeftArrowClick} className={styles.arrow}>
        {"<"}
      </button>
      <div
        style={{
          flex: 1,
          display: "flex",
          flexWrap: "wrap",
          gap: "0.5rem",
          width: "100%",
          padding: "1rem",
          justifyContent: "center",
          overflowY: "scroll",
          background: "#ccc",
          borderRadius: "0.2rem",
          height: "300px",
        }}
      >
        {children}
      </div>
      <button onClick={onRightArrowClick} className={styles.arrow}>
        {">"}
      </button>
    </div>
  );
};

const PlayerContextMenuModal: React.FC<Props> = ({
  playerId,
  game,
  onKillOrResurrect,
  onClose,
  onModifyPlayer,
  onRemovePlayer,
  modalRef,
}) => {
  const globals = useContext(AppContext);
  const player = game.players.find((p) => p.id === playerId);

  if (!player) {
    return null;
  }

  const isAlive = "alive" in player && player.alive;

  const currentCharacter =
    ("character" in player && player.character) || "no character";

  return (
    <Modal onClose={onClose} modalRef={modalRef}>
      <h2>
        {player.name} ({formatCharacterName(currentCharacter)})
      </h2>

      <div
        onClick={() => {
          if (!isSetup(game)) {
            return;
          }
          onModifyPlayer({
            ...player,
            character: undefined,
          });
        }}
        style={{
          cursor: isSetup(game) && !!player.character ? "pointer" : "default",
        }}
        className={classnames({
          [styles.character]: true,
          [styles.selected]: currentCharacter !== "no character",
        })}
      >
        {(() => {
          if (currentCharacter === "no character") {
            return <span className={styles.noCharacter}>?</span>;
          }

          return (
            <img
              src={`${CHARACTER_BASE_URL}/${currentCharacter}.png`}
              alt={currentCharacter}
            />
          );
        })()}
      </div>

      {isSetup(game) && (
        <button
          className={styles.removePlayerButton}
          onClick={() => onRemovePlayer(player.id)}
        >
          Remove player
        </button>
      )}
      {!isSetup(game) && (
        <button
          className={styles.button}
          onClick={() => {
            onKillOrResurrect(player.id);
            onClose();
          }}
        >
          {isAlive ? "Kill player" : "Resurrect player"}
        </button>
      )}

      <PlayerIconContainer
        onLeftArrowClick={() => {
          const curIdx = EDITION_IDS.indexOf(globals.value.edition);
          const newIdx = curIdx === 0 ? EDITION_IDS.length - 1 : curIdx - 1;
          globals.setValue({
            ...globals.value,
            edition: EDITION_IDS[newIdx],
          });
        }}
        onRightArrowClick={() => {
          const curIdx = EDITION_IDS.indexOf(globals.value.edition);
          const newIdx = curIdx === EDITION_IDS.length - 1 ? 0 : curIdx + 1;
          globals.setValue({
            ...globals.value,
            edition: EDITION_IDS[newIdx],
          });
        }}
      >
        {EDITIONS[globals.value.edition].characters.map((character) => {
          const isSelected = currentCharacter === character.id;

          const charactersInPlay = getCharactersInPlay(game);

          // Duplicate characters are disallowed in setup, but allowed in play
          // Due to characters like imp or fang-gu who can have multiple copies
          const disabled = isSetup(game)
            ? !isSelected && charactersInPlay.includes(character.id)
            : false;
          return (
            <button
              key={character.id}
              disabled={disabled}
              className={classnames({
                [styles.character]: true,
                [styles.selected]: isSelected,
                [styles.disabled]: disabled,
              })}
              onClick={() => {
                const didSelectCharacter = currentCharacter !== character.id;
                onModifyPlayer({
                  ...player,
                  character: didSelectCharacter ? character.id : undefined,
                });

                if (didSelectCharacter) {
                  onClose();
                }
              }}
            >
              <img
                src={`${CHARACTER_BASE_URL}/${character.id}.png`}
                alt={character.id}
              />
            </button>
          );
        })}
      </PlayerIconContainer>
    </Modal>
  );
};

export default PlayerContextMenuModal;
