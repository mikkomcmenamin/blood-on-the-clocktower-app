import { Game } from "@common/model";
import { classnames } from "@common/util";
import React from "react";
import Modal from "../Modal";
import styles from "./VotingRoundModal.module.scss";

export type VotingRoundState =
  | {
      open: false;
    }
  | {
      open: true;
      playerVotingOrder: number[];
      currentIndex: number;
    };

type Props = {
  onClose: () => void;
  modalRef: React.RefObject<HTMLDivElement>;
  votingRoundState: VotingRoundState;
  game: Extract<Game, { stage: "active" }>;
  onVoted: (voted: boolean) => void;
};

const VotingRoundModal: React.FC<Props> = ({
  onClose,
  modalRef,
  votingRoundState,
  game,
  onVoted,
}) => {
  // onclick, set the .clicked class to the button that was clicked
  // and timeout to remove it later. This is for animation purposes.
  const onClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    voted: boolean
  ) => {
    const target = e.target as HTMLDivElement;
    target.classList.add(styles.clicked);
    setTimeout(() => {
      target.classList.remove(styles.clicked);
    }, 500);

    onVoted(voted);
  };

  if (!votingRoundState.open) {
    return null;
  }

  const { playerVotingOrder, currentIndex } = votingRoundState;

  const currentPlayerId = playerVotingOrder[currentIndex];

  const currentPlayer = game.players.find(
    (player) => player.id === currentPlayerId
  )!;

  return (
    <Modal onClose={onClose} modalRef={modalRef}>
      <div
        onClick={(e) => onClick(e, true)}
        className={classnames({
          [styles.voteButton]: true,
          [styles.voteYesButton]: true,
        })}
      >
        YES
      </div>
      <div className={styles.didPlayerVoteText}>
        {currentPlayer.name} voted?
      </div>
      <div
        onClick={(e) => onClick(e, false)}
        className={classnames({
          [styles.voteButton]: true,
          [styles.voteNoButton]: true,
        })}
      >
        NO
      </div>
    </Modal>
  );
};

export default VotingRoundModal;
