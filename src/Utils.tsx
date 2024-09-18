import {
    PieceType,
    PieceColor,
    Piece,
} from "./Types";


/**
 * Function to read board based on FEN notation. 
 * 
 * @param position 
 * @returns a list of the pieces with correct positions
 */
export function readBoard(position: string) {
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


export function tileOcupied(x: number, y: number, boardState: Piece[]): boolean {
    const piece = boardState.find(
        (p) => p.verticalPosition === x && p.horizontalPosition === y
    );
    if (piece) {
        return true;
    }
    return false;
}


export function tileOcupiedByOponent(
    x: number,
    y: number,
    boardState: Piece[],
    color: PieceColor
): boolean {
    const piece = boardState.find(
        (p) =>
            p.verticalPosition === x &&
            p.horizontalPosition === y &&
            p.color !== color
    );

    if (piece) {
        return true;
    }
    return false;
}


export function inBoardBounds(x: number, y: number) {
    const chessboardContainerRect = document.getElementById("chessboard")?.getBoundingClientRect();
    if (chessboardContainerRect) {
        const minX = chessboardContainerRect.left
        const maxX = chessboardContainerRect.right
        const minY = chessboardContainerRect.top
        const maxY = chessboardContainerRect.bottom

        return ((x >= minX) && (x <= maxX) && (y >= minY) && (y <= maxY))
    }
}


export function tileOcupiedByTeammate(
    x: number,
    y: number,
    boardState: Piece[],
    color: PieceColor
): boolean {
    return (tileOcupied(x, y, boardState) && !tileOcupiedByOponent(x, y, boardState, color))
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