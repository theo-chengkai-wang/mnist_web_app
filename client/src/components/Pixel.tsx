import React from 'react'
import './Pixel.css'

type PixelProps = {
    colorFlag:number,
    onMouseDown: Function, 
    onMouseMove: Function,
    onMouseUp: Function
};

const Pixel: React.FC<PixelProps> = ({ colorFlag, onMouseDown, onMouseMove, onMouseUp }) => {
    const backgroundColor = colorFlag===1? 'white':'black';
    const textColor = colorFlag===0? 'white':'black';
    const handleMouseDown: React.MouseEventHandler<HTMLElement> = (e: React.MouseEvent<HTMLElement>) => {
        onMouseDown();
    };
    const handleMouseMove: React.MouseEventHandler<HTMLElement> = (e: React.MouseEvent<HTMLElement>) => {
        onMouseMove();
    };
    const handleMouseUp: React.MouseEventHandler<HTMLElement> = (e: React.MouseEvent<HTMLElement>) => {
        onMouseUp();
    }
    return (
        // Set color and backgroundColor to be the same, so never sees the content of a cell
        <button className="pixel-button" 
            style={{backgroundColor: backgroundColor, color: textColor}} 
            onMouseDown={handleMouseDown} 
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}>
            {colorFlag}
        </button>
    );
};


export default Pixel;