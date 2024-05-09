import "./Tile.css"

/**
 * Instantiate a Proprieties interface to storage necessairy data
 */
interface Proprieties {
    isWhite: Boolean;
    image: string;
}

/**
 * Function to return proper divs for tiles.
 * 
 * @param isWhite, image -> Proprieties 
 * @returns If isWhite = True, return a white div, else, return a black div
 */
export default function Tile({ isWhite, image }: Proprieties) {
    if (isWhite) {
        return <div className="tile white-tile">
            {image !== "" && <div className="chess-piece" style={{ backgroundImage: `url(${image})` }}></div>}
        </div>
    }
    return <div className="tile black-tile">
        {image !== "" && <div className="chess-piece" style={{ backgroundImage: `url(${image})` }}></div>}
    </div>
}