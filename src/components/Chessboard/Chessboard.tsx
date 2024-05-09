import Tile from '../Tile/Tile'
import './Chessboard.css'

/**
 * Interface that models a Piece. 
 * Image refers to public repository of assets.
 */
interface Piece {
    image: string;
    horizontalPosition: number;
    verticalPosition: number;
}

let activePiece: HTMLElement | null = null;

// FEN notation for building positions
const initialPosition = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR";
// const dificultPosition = "8/5k2/3p4/1p1Pp2p/pP2Pp1P/P4P1K/8/8 b"

// Setting up the board
const verticalAxis = ["1", "2", "3", "4", "5", "6", "7", "8"]
const horizontalAxis = ["a", "b", "c", "d", "e", "f", "g", "h"]
const pieces: Piece[] = readBoard(initialPosition)

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
    let board = [];
    let rowLabels = [];
    let columnLabels = [];

    // Generating chessboard tiles
    for (let rank = verticalAxis.length - 1; rank >= 0; rank--) {
        for (let file = 0; file < horizontalAxis.length; file++) {
            let isWhite = (rank + file + 2) % 2 === 0;
            let image = "";

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
}

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

        // Calculate the size of each grid cell
        const gridCellWidth = chessboardContainerRect.width / 8;
        const gridCellHeight = chessboardContainerRect.height / 8;

        // Calculate the position of the clicked grid cell
        const gridCellX = Math.floor((e.clientX - chessboardContainerRect.left) / gridCellWidth);
        const gridCellY = Math.floor((e.clientY - chessboardContainerRect.top) / gridCellHeight);

        // Calculate the position of the piece within the grid cell (centered)
        const offsetX = element.offsetWidth / 2;
        const offsetY = element.offsetHeight / 2;
        const x = (gridCellX * gridCellWidth) + (gridCellWidth / 2) - offsetX;
        const y = (gridCellY * gridCellHeight) + (gridCellHeight / 2) - offsetY;

        // Set the initial position of the piece
        element.style.position = "absolute";
        element.style.left = `${x}px`;
        element.style.top = `${y}px`;

        // Store the active piece
        activePiece = element;
    }
}

/**
 * Function to drop the piece when click is released.
 * 
 * @param e 
 */
function dropPiece(e: React.MouseEvent) {
    if (activePiece) {
        activePiece = null
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

            // If the piece is not an empty string, create a piece with a set position. 
            if (currPiece !== "") {
                pieces.push({ image: currPiece, horizontalPosition: rank, verticalPosition: file })
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
    if (char === "k") {
        return "assets/images/king_b.png"
    }
    else if (char === "K") {
        return "assets/images/king_w.png"
    }
    else if (char === "q") {
        return "assets/images/queen_b.png"
    }
    else if (char === "Q") {
        return "assets/images/queen_w.png"
    }
    else if (char === "b") {
        return "assets/images/bishop_b.png"
    }
    else if (char === "B") {
        return "assets/images/bishop_w.png"
    }
    else if (char === "n") {
        return "assets/images/knight_b.png"
    }
    else if (char === "N") {
        return "assets/images/knight_w.png"
    }
    else if (char === "r") {
        return "assets/images/rook_b.png"
    }
    else if (char === "R") {
        return "assets/images/rook_w.png"
    }
    else if (char === "p") {
        return "assets/images/pawn_b.png"
    }
    else if (char === "P") {
        return "assets/images/pawn_w.png"
    }
    else {
        return ""
    }
}
