import {
	PieceType,
	PieceColor,
	Piece,
} from "../components/Chessboard/Chessboard";

import * as ref from "./RefereeUtils";

export default class Referee {
	isValidMove(
		px: number,
		py: number,
		x: number,
		y: number,
		type: PieceType,
		color: PieceColor,
		boardState: Piece[]
	) {
		// console.log(`Previous location: ${previousX}, ${previousY}`)
		// console.log(`Current location: ${currentX}, ${currentY}`)
		// console.log(`Piece type: ${type}`)
		// console.log(`Piece color: ${color}`)
		// console.log("-=-=-=-=-=-")

		if (type === PieceType.PAWN) {
			if (ref.isValidPawnMove(px, py, x, y, color, boardState)) {
				return true;
			}
		}
		return false;
	}
}
