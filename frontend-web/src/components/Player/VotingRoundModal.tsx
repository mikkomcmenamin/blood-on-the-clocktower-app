import { playerCanVote } from "@common/gameLogic";
import { classnames } from "@common/util";
import { useAtomValue } from "jotai";
import React from "react";
import { gameAtom } from "../../atoms/gameAtoms";
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
  onVoted: (voted: boolean) => void;
};

const VotingRoundModal: React.FC<Props> = ({
  onClose,
  modalRef,
  votingRoundState,
  onVoted,
}) => {
  const game = useAtomValue(gameAtom);

  // onclick, set the .clicked class to the button that was clicked
  // and timeout to remove it later. This is for animation purposes.
  const onClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    voted: boolean
  ) => {
    e.preventDefault();
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

  const canVote = playerCanVote(currentPlayer, game);

  return (
    <Modal onClose={onClose} modalRef={modalRef}>
      {canVote && (
        <button
          disabled={!canVote}
          onClick={(e) => onClick(e, true)}
          className={classnames({
            [styles.voteButton]: true,
            [styles.voteYesButton]: true,
            [styles.disabled]: !canVote,
          })}
        >
          YES
        </button>
      )}
      <div className={styles.didPlayerVoteText}>
        {canVote
          ? `${currentPlayer.name} voted?`
          : `${currentPlayer.name} can't vote`}
      </div>
      <button
        onClick={(e) => onClick(e, false)}
        className={classnames({
          [styles.voteButton]: true,
          [styles.voteNoButton]: true,
        })}
      >
        NO
      </button>
    </Modal>
  );
};

export default VotingRoundModal;
