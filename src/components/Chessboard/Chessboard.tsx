import { useEffect, useState } from 'react';
import Tile from '../Tile/Tile'
import './Chessboard.css'
import Referee from '../../referee/Referee'

/**
 * Interface that models a Piece. 
 * Image refers to public repository of assets.
 */
export interface Piece {
    image: string;
    horizontalPosition: number;
    verticalPosition: number;
    type: PieceType;
    color: PieceColor
}

export enum PieceColor {
    BLACK,
    WHITE
}

export enum PieceType {
    PAWN,
    BISHOP,
    KNIGHT,
    ROOK,
    QUEEN,
    KING,
    UNDEFINED
}

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
    for (let rank = verticalAxis.length - 1; rank >= 0; rank--) {
        for (let file = 0; file < horizontalAxis.length; file++) {
            let isWhite = (rank + file + 2) % 2 === 0;
            let image = ""

            pieces.forEach((piece) => {
                if (piece.verticalPosition === file && piece.horizontalPosition === rank) {
                    image = piece.image;
                }
            });

            board.push(<Tile key={`${rank},${file}`} isWhite={isWhite} image={image} />);
        }
    }

    // Generating row labels
    for (let rank = verticalAxis.length - 1; rank >= 0; rank--) {
        rowLabels.push(<RowLabel key={`row-${rank}`} label={verticalAxis[rank]} />);
    }

    // Generating column labels
    for (let file = 0; file < horizontalAxis.length; file++) {
        columnLabels.push(<ColumnLabel key={`col-${file}`} label={horizontalAxis[file]} />);
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
        if (activePiece) {
            const chessboardContainerRect = document.getElementById("chessboard-container")?.getBoundingClientRect();
            if (!chessboardContainerRect) return;

            // If dropped inside the board boundaries, update the position of the piece
            const gridCellX = Math.floor((e.clientX - chessboardContainerRect.left) / (chessboardContainerRect.width / 8));
            const gridCellY = Math.abs(Math.ceil((e.clientY - chessboardContainerRect.top - 800) / (chessboardContainerRect.height / 8)));

            // Update the position of the piece in the state
            const updatedPieces = pieces.map(piece => {
                if (piece.horizontalPosition === initialGridY && piece.verticalPosition === initialGridX) {
                    // Snap the piece back to its original position

                    if (!inBoardBounds(e.clientX, e.clientY)) {
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

                        // console.log(`Current  positions: (${x}, ${y})`)
                        // console.log(`Previous positions: (${initialGridX}, ${initialGridY})`)
                    }
                    else if (referee.isValidMove(initialGridX, initialGridY, gridCellX, gridCellY, piece.type, piece.color, pieces)) {

                        piece.verticalPosition = gridCellX
                        piece.horizontalPosition = gridCellY
                        setGridX(gridCellX)
                        setGridY(gridCellY)

                    }
                    else {
                        activePiece!.style.position = 'relative'
                        activePiece!.style.removeProperty('top')
                        activePiece!.style.removeProperty('left')
                    }

                }
                return piece
            })
            setPieces(updatedPieces);
        }

        // Reset the active piece
        setActivePiece(null)
    }
}

/**
 * Function to read board based on FEN notation. 
 * 
 * @param position 
 * @returns a list of the pieces with correct positions
 */
function readBoard(position: string) {
    // Initialize a pieces list 
    let pieces: Piece[] = []
    let rank = 7;
    let file = 0;
    // Loop trough all the characters in the FEN string
    for (let i = 0; i < position.length; i++) {

        let currChar = position[i]

        // Base case. If hits the first space, return the list of pieces
        // TODO: read the rest of the FEN string (who's move, possible moves, how many moves each player has)
        if (currChar === " ") {
            return pieces
        }
        // If the char is / reset the file, and go down one rank. 
        else if (currChar === "/") {
            rank--
            file = 0
        }
        else {
            // If none of the base cases hit, create the piece instance.
            // Calls determine piece function to return what piece we are currently itterating.
            let currPiece = determinePiece(currChar)
            let currColor = determineColor(currChar)
            let currType = determineType(currChar.toLocaleLowerCase())

            // If the piece is not an empty string, create a piece with a set position. 
            if (currPiece !== "") {
                pieces.push({ image: currPiece, horizontalPosition: rank, verticalPosition: file, type: currType, color: currColor })
                file++
            }
            // If the is an empty string, make it a number, and add to the file to properly handle FEN notation.
            else {
                let currNum = Number(currChar)
                file += currNum
            }
        }
    }
    return pieces;
}

/**
 * Determines which piece is passed as an argument.
 * 
 * @param char 
 * @returns A path for the piece's .png. If not a valid piece, return empty string.
 */
function determinePiece(char: string) {
    let returnString = ""
    switch (char) {
        // Case for King.
        case "k": returnString = "assets/images/king_b.png"; break
        case "K": returnString = "assets/images/king_w.png"; break
        // Case for Queen.
        case "q": returnString = "assets/images/queen_b.png"; break
        case "Q": returnString = "assets/images/queen_w.png"; break
        // Case for bishop
        case "b": returnString = "assets/images/bishop_b.png"; break
        case "B": returnString = "assets/images/bishop_w.png"; break
        // Case for knight
        case "n": returnString = "assets/images/knight_b.png"; break
        case "N": returnString = "assets/images/knight_w.png"; break
        // Case for rook
        case "r": returnString = "assets/images/rook_b.png"; break
        case "R": returnString = "assets/images/rook_w.png"; break
        // Case for pawn
        case "p": returnString = "assets/images/pawn_b.png"; break
        case "P": returnString = "assets/images/pawn_w.png"; break
        // Default case: empty string
        default: returnString = "";
    }
    return returnString
}

function determineType(char: string) {
    switch (char) {
        case "k": return PieceType.KING; break
        case "q": return PieceType.QUEEN; break
        case "r": return PieceType.ROOK; break
        case "b": return PieceType.BISHOP; break
        case "n": return PieceType.KNIGHT; break
        case "p": return PieceType.PAWN; break
        default: return PieceType.UNDEFINED;
    }
}

function determineColor(char: string) {
    switch (char) {
        // Case for King.
        case "k": return PieceColor.BLACK; break
        case "K": return PieceColor.WHITE; break
        // Case for Queen.
        case "q": return PieceColor.BLACK; break
        case "Q": return PieceColor.WHITE; break
        // Case for bishop
        case "b": return PieceColor.BLACK; break
        case "B": return PieceColor.WHITE; break
        // Case for knight
        case "n": return PieceColor.BLACK; break
        case "N": return PieceColor.WHITE; break
        // Case for rook
        case "r": return PieceColor.BLACK; break
        case "R": return PieceColor.WHITE; break
        // Case for pawn
        case "p": return PieceColor.BLACK; break
        case "P": return PieceColor.WHITE; break
        // Default case: empty string
        default: return PieceColor.WHITE;
    }
}

function inBoardBounds(x: number, y: number) {
    const chessboardContainerRect = document.getElementById("chessboard")?.getBoundingClientRect();
    if (chessboardContainerRect) {
        const minX = chessboardContainerRect.left
        const maxX = chessboardContainerRect.right
        const minY = chessboardContainerRect.top
        const maxY = chessboardContainerRect.bottom

        return ((x >= minX) && (x <= maxX) && (y >= minY) && (y <= maxY))
    }
}