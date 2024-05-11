import { PieceType, PieceColor } from "../components/Chessboard/Chessboard";

export default class Referee {
    isValidMove(previousX: number, previousY:number, currentX:number, currentY:number, type:PieceType, color: PieceColor) {
        console.log(`Previous location: ${previousX}, ${previousY}`)
        console.log(`Current location: ${currentX}, ${currentY}`)
        console.log(`Piece type: ${type}`)
        console.log(`Piece color: ${color}`)
        console.log("-=-=-=-=-=-")

        if (type === PieceType.PAWN) {
            if (color === PieceColor.WHITE) {
                if (previousY === 1) {
                    if (previousX === currentX && (currentY - previousY === 1 || currentY - previousY === 2)) {
                        console.log("Valid Move")
                        return true;
                    }
                }   else {
                        if (previousX === currentX && (currentY - previousY) === 1) {
                            console.log("Valid Move")
                            return true;
                        }
                }
            }
        }
        console.log('INVALID!!!')
        return false;
    }
}