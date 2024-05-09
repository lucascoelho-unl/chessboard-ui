import "./Tile.css"

interface Props {
    isWhite: Boolean;
    image: string;
}

export default function Tile({ isWhite, image }: Props) {
    if (isWhite) {
        return <div className="tile white-tile">
            {image !== "" && <div className="chess-piece" style={{ backgroundImage: `url(${image})` }}></div>}
        </div>
    }
    return <div className="tile black-tile">
        {image !== "" && <div className="chess-piece" style={{ backgroundImage: `url(${image})` }}></div>}
    </div>
}