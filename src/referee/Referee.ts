import { PieceType, PieceColor, Piece } from "../Types";
import { tileOcupied, tileOcupiedByOponent } from "../Utils";

export default class Referee {
	isValidMove(
		prevX: number,
		prevY: number,
		newX: number,
		newY: number,
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
				prevX === newX &&
				prevY === specialRow &&
				newY - prevY === 2 * pawnDirection
			) {
				if (
					!tileOcupied(newX, newY, boardState) &&
					!tileOcupied(newX, newY - pawnDirection, boardState)
				) {
					return true;
				}
			} else if (prevX === newX && newY - prevY === pawnDirection) {
				if (!tileOcupied(newX, newY, boardState)) {
					return true;
				}
			}

			// ATACK LOGIC
			else if (prevX - newX === 1 && newY - prevY === pawnDirection) {
				// ATACK LEFT
				if (tileOcupiedByOponent(newX, newY, boardState, color)) {
					return true;
				}
			} else if (prevX - newX === -1 && newY - prevY === pawnDirection) {
				// ATACK RIGHT
				if (tileOcupiedByOponent(newX, newY, boardState, color)) {
					return true;
				}
			}
		}

		if (type === PieceType.ROOK) {
			if (prevX === newX) {
				const numRowsMoved = newY - prevY;
				if (numRowsMoved > 0) {
					for (var i = 1; i < numRowsMoved; i++) {
						if (tileOcupied(newX, prevY + i, boardState)) {
							return false;
						}
					}
				} else if (numRowsMoved < 0) {
					for (var i = -1; i > numRowsMoved; i--) {
						if (tileOcupied(newX, prevY + i, boardState)) {
							return false;
						}
					}
				}
				if (
					tileOcupied(newX, newY, boardState) &&
					!tileOcupiedByOponent(newX, newY, boardState, color)
				) {
					return false;
				}
				return true;
			}
			if (prevY === newY) {
				const numColsMoved = newX - prevX;
				if (numColsMoved > 0) {
					for (var i = 1; i < numColsMoved; i++) {
						if (tileOcupied(prevX + i, newY, boardState)) {
							return false;
						}
					}
				} else if (numColsMoved < 0) {
					for (var i = -1; i > numColsMoved; i--) {
						if (tileOcupied(prevX + i, newY, boardState)) {
							return false;
						}
					}
				}
				if (
					tileOcupied(newX, newY, boardState) &&
					!tileOcupiedByOponent(newX, newY, boardState, color)
				) {
					return false;
				}
				return true;
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
