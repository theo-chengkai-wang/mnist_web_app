import React, {useCallback, useState, useEffect} from 'react';
import './Canvas.css';
import Pixel from '../components/Pixel'
import {chunk} from 'lodash';
import axios, { AxiosResponse } from 'axios';

type CanvasProps = {};

const Canvas: React.FC<CanvasProps> = () => {
    const [pixels, setPixels] = useState(Array(28*28).fill(0));
    const [isDrawing, setIsDrawing] = useState(false);

    const handleMouseDown:Function = (rowIndex:number, columnIndex:number) => {
        const index = rowIndex*28+columnIndex;
        setPixels((oldPixelValue:number[])=>{
            const copyOfOldPixels = oldPixelValue.slice();
            console.log(copyOfOldPixels);
            copyOfOldPixels[index] = copyOfOldPixels[index]===1? 0:1;
            return copyOfOldPixels;
        });
        setIsDrawing(true);
    };

    const handleMouseUp = () => {
        setIsDrawing(false);
    };

    const handleMouseMove = useCallback(
        (rowIndex:number, columnIndex:number) => {
            const index = rowIndex*28+columnIndex;
            if (isDrawing) {
                handleMouseDown(rowIndex, columnIndex);
            }
        },
        [isDrawing],
    );

    const handleClear = () => {
        setPixels(Array(28*28).fill(0));
    };

    useEffect(() => {
        const fetchPrediction = async (data: number[]) => {
            const res:AxiosResponse<number> = await axios({
                url: '/array',
                method: 'POST',
                data: {
                    array: chunk(data, 28)
                }
            });
            const pred:number = res.data;
            console.log(pred);
        }
        if (!isDrawing) {
            fetchPrediction(pixels);
        }
    }, [pixels, isDrawing]);


    return (
        <>
        <div className='Canvas'>
            {chunk(pixels, 28).map((row:number[], rowIndex:number) => {
                return (
                    <div key={rowIndex} className='display-row'>
                        {row.map((pixel:number, columnIndex:number)=>(
                            <Pixel key={columnIndex}
                                colorFlag={pixel} 
                                onMouseDown={() => {handleMouseDown(rowIndex, columnIndex)}} 
                                onMouseMove={() => {handleMouseMove(rowIndex, columnIndex)}}
                                onMouseUp={() => {handleMouseUp()}}/>
                        ))}
                    </div>
                );
            })}
        </div>
        <div className="clear-button-wrapper">
            <button onClick={()=>handleClear()}>Clear</button>
        </div>
        </>
    );
};


export default Canvas;