import React from 'react';
import {chunk} from 'lodash';
import Pixel from './Pixel';
import './Canvas.css';

type CanvasProps = {
    pixels: number[],
    onMouseDown: Function
}

const Canvas:React.FunctionComponent<CanvasProps> = ({ pixels, onMouseDown }) => {
    
    return (
        <div className='Canvas'>
            {chunk(pixels, 28).map((row:number[], rowIndex:number) => {
                return (
                    <div key={rowIndex} className='display-row'>
                        {row.map((pixel:number, columnIndex:number)=>(
                            <Pixel key={columnIndex}
                                colorFlag={pixel} 
                                onMouseDown={() => {onMouseDown(rowIndex, columnIndex)}} />
                        ))}
                    </div>
                );
            })}
        </div>
    );

};

export default Canvas;