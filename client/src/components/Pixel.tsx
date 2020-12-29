import React from 'react'
import './Pixel.css'

type PixelProps = {
    colorFlag:number,
    onMouseDown: Function, 
};

const Pixel: React.FC<PixelProps> = ({ colorFlag, onMouseDown }) => {
    const backgroundColor = colorFlag===1? 'white':'black';
    const textColor = colorFlag===0? 'white':'black';
    const handleMouseDown: React.MouseEventHandler<HTMLElement> = (e: React.MouseEvent<HTMLElement>) => {
        onMouseDown();
    };
    return (
        // Set color and backgroundColor to be the same, so never sees the content of a cell
        <button className="pixel-button" 
            style={{backgroundColor: backgroundColor, color: textColor}} 
            onMouseDown={handleMouseDown} >
            {colorFlag}
        </button>
    );
};


export default Pixel;