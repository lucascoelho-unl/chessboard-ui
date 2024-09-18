import { PieceType, PieceColor, Piece } from "../Types";
import {
	tileOcupied,
	tileOcupiedByOponent,
	tileOcupiedByTeammate,
} from "../Utils";

export default class Referee {
	isValidMove(
		prevX: number,
		prevY: number,
		newX: number,
		newY: number,
		type: PieceType,
		color: PieceColor,
		boardState: Piece[],
		turn: number
	) {
		if (
			(turn === -1 && color === PieceColor.WHITE) ||
			(turn === 1 && color === PieceColor.BLACK)
		) {
			return false;
		}

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

		if (type === PieceType.BISHOP) {
			const numColsMoved = newX - prevX;
			const numRowsMoved = newY - prevY;

			if (Math.abs(numRowsMoved) !== Math.abs(numColsMoved)) {
				return false;
			}

			var Xshift = numColsMoved > 0 ? 1 : -1;
			var Yshift = numRowsMoved > 0 ? 1 : -1;
			var Xpointer = Xshift;
			var Ypointer = Yshift;

			while (Xpointer !== numColsMoved && Ypointer !== numRowsMoved) {
				if (
					tileOcupied(prevX + Xpointer, prevY + Ypointer, boardState)
				) {
					return false;
				}
				Xpointer += Xshift;
				Ypointer += Yshift;
			}

			if (tileOcupiedByTeammate(newX, newY, boardState, color)) {
				return false;
			}
			return true;
		}

		if (type === PieceType.KNIGHT) {
			var validMoves = [
				[1, 2],
				[1, -2],
				[-1, 2],
				[-1, -2],
				[2, 1],
				[2, -1],
				[-2, 1],
				[-2, -1],
			];

			const knightMove = [newX - prevX, newY - prevY];

			if (tileOcupiedByTeammate(newX, newY, boardState, color)) {
				return false;
			}

			for (var move of validMoves) {
				console.log(knightMove, move, knightMove === move);
				if (knightMove[0] === move[0] && knightMove[1] === move[1]) {
					return true;
				}
			}
			return false;
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
				if (tileOcupiedByTeammate(newX, newY, boardState, color)) {
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
				if (tileOcupiedByTeammate(newX, newY, boardState, color)) {
					return false;
				}
				return true;
			}
		}

		if (type === PieceType.QUEEN) {
			const numColsMoved = newX - prevX;
			const numRowsMoved = newY - prevY;
			var Xshift = numColsMoved > 0 ? 1 : -1;
			var Yshift = numRowsMoved > 0 ? 1 : -1;
			var Xpointer = Xshift;
			var Ypointer = Yshift;

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
				if (tileOcupiedByTeammate(newX, newY, boardState, color)) {
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
				if (tileOcupiedByTeammate(newX, newY, boardState, color)) {
					return false;
				}
				return true;
			}

			if (Math.abs(numRowsMoved) === Math.abs(numColsMoved)) {
				while (Xpointer !== numColsMoved && Ypointer !== numRowsMoved) {
					if (
						tileOcupied(
							prevX + Xpointer,
							prevY + Ypointer,
							boardState
						)
					) {
						return false;
					}
					Xpointer += Xshift;
					Ypointer += Yshift;
				}

				if (tileOcupiedByTeammate(newX, newY, boardState, color)) {
					return false;
				}
				return true;
			}
		}

		if (type === PieceType.KING) {
			const numColsMoved = newX - prevX;
			const numRowsMoved = newY - prevY;

			if (
				numColsMoved >= -1 &&
				numColsMoved <= 1 &&
				numRowsMoved >= -1 &&
				numRowsMoved <= 1 &&
				!tileOcupiedByTeammate(newX, newY, boardState, color)
			) {
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
