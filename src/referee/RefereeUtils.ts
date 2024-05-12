import {
	Piece,
	PieceColor,
	PieceType,
} from "../components/Chessboard/Chessboard";

function tileIsOcupied(x: number, y: number, boardState: Piece[]) {
	const piece = boardState.find(
		(p) => p.verticalPosition === x && p.horizontalPosition === y
	);
	if (piece) {
		return true;
	}
	return false;
}

export function isValidPawnMove(
	previousX: number,
	previousY: number,
	currentX: number,
	currentY: number,
	color: PieceColor,
	boardState: Piece[]
) {
	const specialRow = color === PieceColor.WHITE ? 1 : 6;
	const pawnDirection = color === PieceColor.WHITE ? 1 : -1;

	if (
        previousX === currentX && 
		previousY === specialRow &&
		currentY - previousY === 2 * pawnDirection
	) {
		if (
			!tileIsOcupied(currentX, currentY, boardState) &&
			!tileIsOcupied(currentX, currentY - pawnDirection, boardState)
		) {
			return true;
		}
	} else if (previousX === currentX && currentY - previousY === pawnDirection){
		if (!tileIsOcupied(currentX, currentY, boardState)) {
			return true;
		}
	}
}
