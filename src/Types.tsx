export { }

/**
 * Interface that models a Piece. 
 * Image refers to public repository of assets.
 */
export interface Piece {
    image: string;
    horizontalPosition: number;
    verticalPosition: number;
    type: PieceType;
    color: PieceColor;
    enPassant?: boolean;
}

export enum PieceColor {
    BLACK,
    WHITE
}

export enum PieceType {
    PAWN,
    BISHOP,
    KNIGHT,
    ROOK,
    QUEEN,
    KING,
    UNDEFINED
}