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

const PlayerIconContainer: React.FC<PlayerIconContainerProps> = ({
  children,
  onLeftArrowClick,
  onRightArrowClick,
}) => {
  return (
    <div style={{ display: "flex", width: "100%" }}>
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
  modalRef,
}) => {
  const globals = useContext(AppContext);
  const player = game.players.find((p) => p.id === playerId)!;
  const isAlive = "alive" in player && player.alive;

  const currentCharacter =
    ("character" in player && player.character) || "no character";

  return (
    <Modal modalRef={modalRef}>
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

      {(() => {
        if (isSetup(game)) {
          return (
            <PlayerIconContainer
              onLeftArrowClick={() => {
                const curIdx = EDITION_IDS.indexOf(globals.value.edition);
                const newIdx =
                  curIdx === 0 ? EDITION_IDS.length - 1 : curIdx - 1;
                globals.setValue({
                  ...globals.value,
                  edition: EDITION_IDS[newIdx],
                });
              }}
              onRightArrowClick={() => {
                const curIdx = EDITION_IDS.indexOf(globals.value.edition);
                const newIdx =
                  curIdx === EDITION_IDS.length - 1 ? 0 : curIdx + 1;
                globals.setValue({
                  ...globals.value,
                  edition: EDITION_IDS[newIdx],
                });
              }}
            >
              {EDITIONS[globals.value.edition].characters.map((character) => {
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
