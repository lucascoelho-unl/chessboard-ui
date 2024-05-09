import Tile from '../Tile/Tile';
import './Chessboard.css'

interface Piece {
    image: string;
    horizontalPosition: number;
    verticalPosition: number;
}

let activePiece: HTMLElement | null = null;

const initialPosition = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR";
const dificultPosition = "8/5k2/3p4/1p1Pp2p/pP2Pp1P/P4P1K/8/8 b"

const verticalAxis = ["1", "2", "3", "4", "5", "6", "7", "8"]
const horizontalAxis = ["a", "b", "c", "d", "e", "f", "g", "h"]
const pieces: Piece[] = readBoard(initialPosition)

export default function Chessboard() {
    let board = [];

    for (let rank = verticalAxis.length - 1; rank >= 0; rank--) {
        for (let file = 0; file < horizontalAxis.length; file++) {
            let isWhite = (rank + file + 2) % 2 == 0;
            let image = "";

            pieces.forEach((piece) => {
                if (
                    piece.verticalPosition === file &&
                    piece.horizontalPosition === rank
                ) {
                    image = piece.image;
                }
            });
            board.push(
                <Tile key={`${rank},${file}`} isWhite={isWhite} image={image} />
            );
        }
    }
    return (
        <div
            onMouseMove={(e) => movePiece(e)}
            onMouseDown={(e) => grabPiece(e)}
            onMouseUp={(e) => dropPiece(e)}
            id="chessboard"
        >
            {board}
        </div>
    );
}

function movePiece(e: React.MouseEvent) {
    if (activePiece) {
        const x = e.clientX - 50
        const y = e.clientY - 50
        activePiece.style.position = "absolute"
        activePiece.style.left = `${x}px`
        activePiece.style.top = `${y}px`
    }
}

function grabPiece(e: React.MouseEvent) {
    const element = e.target as HTMLElement
    if (element.classList.contains("chess-piece")) {
        const x = e.clientX - 50
        const y = e.clientY - 50
        element.style.position = "absolute"
        element.style.left = `${x}px`
        element.style.top = `${y}px`

        activePiece = element
    }
}

function dropPiece(e: React.MouseEvent) {
    if (activePiece) {
        activePiece = null
    }
}

function readBoard(position: string) {
    let pieces: Piece[] = []
    let rank = 7;
    let file = 0;
    for (let i = 0; i < position.length; i++) {

        let currChar = position[i]

        if (currChar == " ") {
            return pieces
        }
        else if (currChar == "/") {
            rank--
            file = 0
        }
        else {
            let currPiece = determinePiece(currChar);

            if (currPiece !== "") {
                pieces.push({ image: currPiece, horizontalPosition: rank, verticalPosition: file })
                file++
            }
            else {
                let currNum = Number(currChar)
                file += currNum
            }
        }
    }
    return pieces;
}


function determinePiece(char: string) {
    if (char == "k") {
        return "assets/images/king_b.png"
    }
    else if (char == "K") {
        return "assets/images/king_w.png"
    }
    else if (char == "q") {
        return "assets/images/queen_b.png"
    }
    else if (char == "Q") {
        return "assets/images/queen_w.png"
    }
    else if (char == "b") {
        return "assets/images/bishop_b.png"
    }
    else if (char == "B") {
        return "assets/images/bishop_w.png"
    }
    else if (char == "n") {
        return "assets/images/knight_b.png"
    }
    else if (char == "N") {
        return "assets/images/knight_w.png"
    }
    else if (char == "r") {
        return "assets/images/rook_b.png"
    }
    else if (char == "R") {
        return "assets/images/rook_w.png"
    }
    else if (char == "p") {
        return "assets/images/pawn_b.png"
    }
    else if (char == "P") {
        return "assets/images/pawn_w.png"
    }
    else {
        return ""
    }
}

