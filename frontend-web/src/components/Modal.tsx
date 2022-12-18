import {useRef, useState, useEffect} from 'react';
import './Modal.scss'

type ModalProps = {
    isOpen: boolean;
    addPlayer: (name: string) => void;
    modalRef: React.RefObject<HTMLDivElement>;
};

const Modal: React.FC<ModalProps> = ({isOpen, addPlayer, modalRef}) => {
    const playerInputRef = useRef<HTMLInputElement>(null);
    const [newPlayerName, setNewPlayerName] = useState('');

    useEffect(() => {
        if (isOpen) playerInputRef.current?.focus();
    }, [isOpen]);

    const handleNewPlayerNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewPlayerName(e.target.value);
    }

    const handleAddPlayer = (e: any) => {
        e.preventDefault();
        addPlayer(newPlayerName);
        setNewPlayerName("");
    }

    return (
        <div className="modal">
            <div ref={modalRef} className="modal-content">
                <h2>Add a new player</h2>
                <form id="add-player-form" onSubmit={handleAddPlayer}>
                    <input
                        ref={playerInputRef}
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
    );
};

export default Modal;