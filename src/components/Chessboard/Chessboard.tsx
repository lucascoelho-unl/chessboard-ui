import { useEffect, useState } from 'react';
import Tile from '../Tile/Tile';
import './Chessboard.css';
import Referee from '../../referee/Referee';
import {
    PieceType,
    PieceColor,
    Piece,
} from "../../Types";
import {
    readBoard,
    inBoardBounds
} from "../../Utils";

// FEN notation for building positions
const initialPosition = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR";
// const dificultPosition = "8/5k2/3p4/1p1Pp2p/pP2Pp1P/P4P1K/8/8 b"

const initialBoardState = readBoard(initialPosition)

// Setting up the board
const verticalAxis = ["1", "2", "3", "4", "5", "6", "7", "8"]
const horizontalAxis = ["a", "b", "c", "d", "e", "f", "g", "h"]

// RowLabel component
const RowLabel = ({ label }: { label: string }) => {
    return <div className="row-label">{label}</div>;
};

// ColumnLabel component
const ColumnLabel = ({ label }: { label: string }) => {
    return <div className="column-label">{label}</div>;
};

/**
* Chess board. 
* Creates a chessboard to the HTML page. 
* Sets the pieces to correct places with FEN notation.
* 
* @returns a div of the entire chessboard with OnMouseMove commands for interaction with pieces
*/
export default function Chessboard() {
    let board = []
    let rowLabels = []
    let columnLabels = []

    const [initialGridX, setGridX] = useState(0)
    const [initialGridY, setGridY] = useState(0)
    const [pieces, setPieces] = useState<Piece[]>(initialBoardState)
    const [activePiece, setActivePiece] = useState<HTMLElement | null>(null)
    const referee = new Referee()

    useEffect(() => {
        setPieces(pieces)
    })

    // Generating chessboard tiles
    for (let file = verticalAxis.length - 1; file >= 0; file--) {
        for (let rank = 0; rank < horizontalAxis.length; rank++) {
            let isWhite = (file + rank + 2) % 2 === 0;
            let image = ""

            pieces.forEach((piece) => {
                if (piece.verticalPosition === rank && piece.horizontalPosition === file) {
                    image = piece.image;
                }
            });

            board.push(<Tile key={`${file},${rank}`} isWhite={isWhite} image={image} />);
        }
    }

    // Generating row labels
    for (let file = verticalAxis.length - 1; file >= 0; file--) {
        rowLabels.push(<RowLabel key={`row-${file}`} label={verticalAxis[file]} />);
    }

    // Generating column labels
    for (let rank = 0; rank < horizontalAxis.length; rank++) {
        columnLabels.push(<ColumnLabel key={`col-${rank}`} label={horizontalAxis[rank]} />);
    }

    return (
        <div id="chessboard-container">
            <div className="column-labels">{columnLabels}</div>
            <div
                onMouseMove={(e) => movePiece(e)}
                onMouseDown={(e) => grabPiece(e)}
                onMouseUp={(e) => dropPiece(e)}
                id="chessboard"
            >
                {board}
                <div className="row-labels">{rowLabels}</div>
            </div>
        </div>
    );

    /**
     * Move pieces function. Called when piece is active (is clicked).
     * Sets the piece div have its location equal to the mouse location.
     * 
     * @param e 
     */
    function movePiece(e: React.MouseEvent) {
        if (activePiece) {
            // Calculate the new position relative to the chessboard container
            const chessboardContainerRect = document.getElementById("chessboard-container")?.getBoundingClientRect();
            if (!chessboardContainerRect) return;

            const offsetX = activePiece.offsetWidth / 2;
            const offsetY = activePiece.offsetHeight / 2;
            const x = e.clientX - chessboardContainerRect.left - offsetX;
            const y = e.clientY - chessboardContainerRect.top - offsetY;

            // Update the position of the active piece
            activePiece.style.left = `${x}px`;
            activePiece.style.top = `${y}px`;
        }
    }

    /**
     * Selects a piece and stores it in a global scope variable.
     * Sets the piece selected to be grabed by the mouse.
     * After it happens, calls the move piece.
     * 
     * @param e 
     */
    function grabPiece(e: React.MouseEvent) {
        const element = e.target as HTMLElement;
        if (element.classList.contains("chess-piece")) {

            // Calculate the position of the chessboard container relative to the viewport
            const chessboardContainerRect = document.getElementById("chessboard-container")?.getBoundingClientRect();
            if (!chessboardContainerRect) return;

            // Know what piece you grabed for drop function.
            setGridX(Math.floor((e.clientX - chessboardContainerRect.left) / (chessboardContainerRect.width / 8)))
            setGridY(Math.abs(Math.ceil((e.clientY - chessboardContainerRect.top - 800) / (chessboardContainerRect.height / 8))))

            const offsetX = element.offsetWidth / 2;
            const offsetY = element.offsetHeight / 2;
            const x = e.clientX - chessboardContainerRect.left - offsetX;
            const y = e.clientY - chessboardContainerRect.top - offsetY;

            // Set the initial position of the piece
            element.style.position = "absolute";
            element.style.left = `${x}px`;
            element.style.top = `${y}px`;

            // Store the active piece
            setActivePiece(element)
        }
    }

    /**
     * Function to drop the piece when click is released.
     * 
     * @param e 
     */
    function dropPiece(e: React.MouseEvent) {
        const chessboardContainerRect = document.getElementById("chessboard-container")?.getBoundingClientRect();
        if (activePiece && chessboardContainerRect) {

            // If dropped inside the board boundaries, update the position of the piece
            const gridX = Math.floor((e.clientX - chessboardContainerRect.left) / (chessboardContainerRect.width / 8));
            const gridY = Math.abs(Math.ceil((e.clientY - chessboardContainerRect.top - 800) / (chessboardContainerRect.height / 8)));

            if (!inBoardBounds(e.clientX, e.clientY)) {
                // Snap the piece back to its original position
                const element = e.target as HTMLElement;

                // Calculate the size of each grid cell
                const gridCellWidth = chessboardContainerRect.width / 8;
                const gridCellHeight = chessboardContainerRect.height / 8;

                // Calculate the position of the piece within the grid cell (centered)
                const offsetX = element.offsetWidth / 2;
                const offsetY = element.offsetHeight / 2;
                const x = (initialGridX * gridCellWidth) + (gridCellWidth / 2) - offsetX;
                const y = Math.abs((initialGridY * gridCellHeight - 700) + (gridCellHeight / 2) - offsetY);

                // Set the initial position of the piece
                element.style.position = "absolute";
                element.style.left = `${x}px`;
                element.style.top = `${y}px`;

                setActivePiece(null)
                return pieces;
            }

            const currentPiece = pieces.find((p) => p.verticalPosition === initialGridX && p.horizontalPosition === initialGridY)

            if (currentPiece) {
                const isValidMove = referee.isValidMove(initialGridX, initialGridY, gridX, gridY, currentPiece.type, currentPiece.color, pieces)

                const enPassant = referee.isEnPassant(initialGridX, initialGridY, gridX, gridY, currentPiece.type, currentPiece.color, pieces)

                const pawnDirection = currentPiece.color === PieceColor.WHITE ? 1 : -1;

                if (enPassant) {
                    const updatePieces = pieces.reduce((results, piece) => {
                        if (piece.verticalPosition === initialGridX && piece.horizontalPosition === initialGridY) {
                            piece.verticalPosition = gridX
                            piece.horizontalPosition = gridY
                            piece.enPassant = false
                            results.push(piece)
                        }
                        else if (!(piece.verticalPosition === gridX && piece.horizontalPosition === gridY - pawnDirection)) {
                            if (piece.type === PieceType.PAWN) {
                                piece.enPassant = false
                            }
                            results.push(piece)
                        }

                        return results
                    }, [] as Piece[])

                    setPieces(updatePieces)
                }
                else if (isValidMove) {
                    const updatePieces = pieces.reduce((results, piece) => {
                        if (piece.verticalPosition === initialGridX && piece.horizontalPosition === initialGridY) {
                            if (Math.abs(initialGridY - gridY) === 2 && piece.type === PieceType.PAWN) {
                                piece.enPassant = true
                            } else {
                                piece.enPassant = false
                            }
                            piece.verticalPosition = gridX
                            piece.horizontalPosition = gridY
                            results.push(piece)
                        }
                        else if (!(piece.verticalPosition === gridX && piece.horizontalPosition === gridY)) {
                            if (piece.type === PieceType.PAWN) {
                                piece.enPassant = false
                            }
                            results.push(piece)
                        }

                        return results
                    }, [] as Piece[])

                    setPieces(updatePieces)
                }
                activePiece.style.position = "relative"
                activePiece.style.removeProperty("top")
                activePiece.style.removeProperty("left")
            }
            setActivePiece(null)
        }
    }
}
