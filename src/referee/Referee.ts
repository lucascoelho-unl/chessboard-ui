import {
	PieceType,
	PieceColor,
	Piece,
} from "../components/Chessboard/Chessboard";

export default class Referee {
	isValidMove(
		prevX: number,
		prevY: number,
		currX: number,
		currY: number,
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
			const specialRow = color === PieceColor.WHITE ? 1 : 6;
			const pawnDirection = color === PieceColor.WHITE ? 1 : -1;

			const enPassant = isEnPassant(currX, currY, boardState, color);

			// MOVEMENT LOGIC
			if (
				prevX === currX &&
				prevY === specialRow &&
				currY - prevY === 2 * pawnDirection
			) {
				if (
					!tileOcupied(currX, currY, boardState) &&
					!tileOcupied(currX, currY - pawnDirection, boardState)
				) {
					return true;
				}
			} else if (prevX === currX && currY - prevY === pawnDirection) {
				if (!tileOcupied(currX, currY, boardState)) {
					return true;
				}
			}

			// ATACK LOGIC
			else if (prevX - currX === 1 && currY - prevY === pawnDirection) {
				// ATACK LEFT
				console.log("atack left");
				if (tileOcupiedByOponent(currX, currY, boardState, color)) {
					return true;
				}
			} else if (
				prevX - currX === -1 &&
				currY - prevY === pawnDirection
			) {
				// ATACK RIGHT
				console.log("atack right");
				if (tileOcupiedByOponent(currX, currY, boardState, color)) {
					return true;
				}
			}
		}
		return false;
	}
}

function isEnPassant(
	x: number,
	y: number,
	boardState: Piece[],
	color: PieceColor
) {
	
}

function tileOcupied(x: number, y: number, boardState: Piece[]): boolean {
	const piece = boardState.find(
		(p) => p.verticalPosition === x && p.horizontalPosition === y
	);
	if (piece) {
		return true;
	}
	return false;
}

function tileOcupiedByOponent(
	x: number,
	y: number,
	boardState: Piece[],
	color: PieceColor
): boolean {
	const piece = boardState.find(
		(p) =>
			p.verticalPosition === x &&
			p.horizontalPosition === y &&
			p.color != color
	);

	if (piece) {
		return true;
	}
	return false;
}
