import { getCharactersInPlay, isSetup } from "@common/gameLogic";
import { Game, Player } from "@common/model";
import Modal, { ModalProps } from "../Modal";
import styles from "./PlayerContextMenuModal.module.scss";
import {
  Character,
  EDITIONS,
  formatCharacterName,
} from "@common/editions/editions";
import { classnames } from "@common/util";
import { CHARACTER_IMAGES } from "../../assets/characters/characterImages";

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
};

// TODO get rid of these inline styles
const PlayerIconContainer: React.FC<PlayerIconContainerProps> = ({
  children,
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
        onClick={(e) => {
          e.preventDefault();
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
              src={CHARACTER_IMAGES[currentCharacter as Character]}
              alt={currentCharacter}
            />
          );
        })()}
      </div>

      {isSetup(game) && (
        <button
          className={styles.removePlayerButton}
          onClick={(e) => {
            e.preventDefault();
            onRemovePlayer(player.id);
          }}
        >
          Remove player
        </button>
      )}
      {!isSetup(game) && (
        <button
          className={styles.button}
          onClick={(e) => {
            e.preventDefault();
            onKillOrResurrect(player.id);
            onClose();
          }}
        >
          {isAlive ? "Kill player" : "Resurrect player"}
        </button>
      )}

      <PlayerIconContainer>
        {(game.stage === "setup" || game.stage === "active") &&
          EDITIONS[game.globalSettings.editionId].characters.map(
            (character) => {
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
                  onClick={(e) => {
                    e.preventDefault();
                    const didSelectCharacter =
                      currentCharacter !== character.id;
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
                    src={CHARACTER_IMAGES[character.id]}
                    alt={character.id}
                  />
                </button>
              );
            }
          )}
      </PlayerIconContainer>
    </Modal>
  );
};

export default PlayerContextMenuModal;
