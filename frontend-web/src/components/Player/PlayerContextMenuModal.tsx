import { getCharactersInPlay, isSetup } from "@common/gameLogic";
import { Game, Player } from "@common/model";
import Modal, { ModalProps } from "../Modal";
import styles from "./PlayerContextMenuModal.module.scss";
import { CHARACTERS } from "@common/editions/editions";
import { classnames } from "@common/util";

const CHARACTER_BASE_URL = new URL("../../assets/characters", import.meta.url)
  .href;

type Props = Omit<ModalProps, "children"> & {
  playerId: number;
  game: Game;
  onKillOrResurrect: (playerId: number) => void;
  onModifyPlayer: (player: Player) => void;
  onClose: () => void;
};

type PlayerIconContainerProps = {
  children: React.ReactNode;
};

const PlayerIconContainer: React.FC<PlayerIconContainerProps> = ({
  children,
}) => {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "0.5rem",
        width: "100%",
        padding: "1rem",
      }}
    >
      {children}
    </div>
  );
};

const PlayerContextMenuModal: React.FC<Props> = ({
  playerId,
  game,
  onKillOrResurrect,
  onClose,
  onModifyPlayer,
  modalRef,
}) => {
  const player = game.players.find((p) => p.id === playerId)!;
  const isAlive = "alive" in player && player.alive;

  const currentCharacter =
    ("character" in player && player.character) || "no character";

  return (
    <Modal modalRef={modalRef}>
      <h2>
        {player.name} ({currentCharacter})
      </h2>

      <div
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

      {(() => {
        if (isSetup(game)) {
          return (
            <PlayerIconContainer>
              {CHARACTERS.TROUBLE_BREWING.map((character) => {
                const isSelected = currentCharacter === character.id;

                const charactersInPlay = getCharactersInPlay(game);
                return (
                  <button
                    key={character.id}
                    disabled={
                      !isSelected && charactersInPlay.includes(character.id)
                    }
                    className={classnames({
                      [styles.character]: true,
                      [styles.selected]: isSelected,
                      [styles.disabled]:
                        !isSelected && charactersInPlay.includes(character.id),
                    })}
                    onClick={() => {
                      onModifyPlayer({
                        ...player,
                        character:
                          currentCharacter === character.id
                            ? undefined
                            : character.id,
                      });
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
          );
        }

        return (
          <button
            className={styles.button}
            onClick={() => {
              onKillOrResurrect(player.id);
              onClose();
            }}
          >
            {isAlive ? "Kill player" : "Resurrect player"}
          </button>
        );
      })()}
    </Modal>
  );
};

export default PlayerContextMenuModal;
