import { Piece, PieceColor, PieceType } from "../../Types";

export class Rook implements Piece {
    horizontalPosition: number;
    verticalPosition: number;
    image: string;
    type: PieceType;
    color: PieceColor;

    constructor(x: number, y: number, image: string, color: PieceColor) {
        this.horizontalPosition = x;
        this.verticalPosition = y;
        this.image = image;
        this.type = PieceType.ROOK;
        this.color = color;
    }

    getPossibleMoves(boardState: Piece[]): number[][] {
        var possibleMoves: number[][];
        possibleMoves = [[1, 2]]
        return possibleMoves
    }
}