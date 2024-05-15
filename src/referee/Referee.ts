import {
	PieceType,
	PieceColor,
	Piece,
} from "../components/Chessboard/Chessboard";

export default class Referee {
	isValidMove(
		prevX: number,
		prevY: number,
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
			const specialRow = color === PieceColor.WHITE ? 1 : 6;
			const pawnDirection = color === PieceColor.WHITE ? 1 : -1;

			// MOVEMENT LOGIC
			if (
				prevX === x &&
				prevY === specialRow &&
				y - prevY === 2 * pawnDirection
			) {
				if (
					!tileOcupied(x, y, boardState) &&
					!tileOcupied(x, y - pawnDirection, boardState)
				) {
					return true;
				}
			} else if (prevX === x && y - prevY === pawnDirection) {
				if (!tileOcupied(x, y, boardState)) {
					return true;
				}
			}

			// ATACK LOGIC
			else if (prevX - x === 1 && y - prevY === pawnDirection) {
				// ATACK LEFT
				if (tileOcupiedByOponent(x, y, boardState, color)) {
					return true;
				}
			} else if (prevX - x === -1 && y - prevY === pawnDirection) {
				// ATACK RIGHT
				if (tileOcupiedByOponent(x, y, boardState, color)) {
					return true;
				}
			}
		}
		return false;
	}

	isEnPassant(
		prevX: number,
		prevY: number,
		x: number,
		y: number,
		atackingType: PieceType,
		color: PieceColor,
		boardState: Piece[]
	) {
		const pawnDirection = color === PieceColor.WHITE ? 1 : -1;

		if (atackingType === PieceType.PAWN) {
			// ATACK LOGIC
			if (
				(prevX - x === 1 || prevX - x === -1) &&
				y - prevY === pawnDirection
			) {
				// ATACK LEFT
				const piece = boardState.find(
					(p) =>
						p.enPassant &&
						p.verticalPosition === x &&
						p.horizontalPosition === y - pawnDirection
				);
				if (piece) {
					return true;
				}
			}
		}

		return false;
	}
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
			p.color !== color
	);

	if (piece) {
		return true;
	}
	return false;
}
