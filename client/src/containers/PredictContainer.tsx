import React, {useCallback, useState, useEffect} from 'react';
import './PredictContainer.css';
import {chunk} from 'lodash';
import Canvas from '../components/Canvas';
import axios, { AxiosResponse } from 'axios';

type PredictContainerProps = {};
type FetchedResult = { result: string; proba: number; };

const PredictContainer: React.FC<PredictContainerProps> = () => {
    const [pixels, setPixels] = useState(Array(28*28).fill(0));
    const [results, setResults] = useState({result:'none', proba: 0});

    const handleMouseDown:Function = (rowIndex:number, columnIndex:number) => {
        const index = rowIndex*28+columnIndex;
        setPixels((oldPixelValue:number[])=>{
            const copyOfOldPixels = oldPixelValue.slice();
            console.log(copyOfOldPixels);
            copyOfOldPixels[index] = copyOfOldPixels[index]===1? 0:1;
            return copyOfOldPixels;
        });
    };

    const handleClear = () => {
        setPixels(Array(28*28).fill(0));
    };

    useEffect(() => {
        const fetchPrediction = async (data: number[]) => {
            const res:AxiosResponse<FetchedResult> = await axios({
                url: '/array',
                method: 'POST',
                data: {
                    array: chunk(data, 28)
                }
            });
            const pred = res.data;
            console.log(pred);
            setResults(pred);
        }
        fetchPrediction(pixels);
    }, [pixels]);


    return (
        <>
            <Canvas pixels={pixels} onMouseDown={handleMouseDown} />
            <div className="clear-button-wrapper">
                <button onClick={()=>handleClear()}>Clear</button>
            </div>
            {JSON.stringify(results)}
        </>
    );
};


export default PredictContainer;