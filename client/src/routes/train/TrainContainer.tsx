import React, {useState, useEffect, useCallback} from 'react'
import './TrainContainer.css'
import { RouteComponentProps } from '@reach/router'
import {chunk, toInteger} from 'lodash';
//import Canvas from '../components/Canvas';
import axios, { AxiosResponse } from 'axios';
import {ResultsProps} from '../../components/Results'
import CanvasWithResults from '../../components/CanvasWithResults'
import Training from '../../components/Training';

// TODO: ADD CSS
// TODO: Clean up code

export type TrainContainerProps = RouteComponentProps

const TrainContainer: React.FC<TrainContainerProps> = () => {
    const [pixels, setPixels] = useState(Array(28*28).fill(0));
    const [results, setResults] = useState({prediction:-1, probability: 0});
    const [givenLabel, setGivenLabel] = useState(0);

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
            const res:AxiosResponse<ResultsProps> = await axios({
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

    const handleSubmit = useCallback(
        async (e: React.FormEvent) => {
            console.log('submitted')
            e.preventDefault()
            const res = await axios({
                url: '/arraytrainlabel',
                method: 'POST',
                data: {
                    array: chunk(pixels, 28),
                    label: givenLabel
                }
            })
            const results = res.data;
            console.log(results)
        },
        [pixels, givenLabel],
    )

    const handleChoiceChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        setGivenLabel(toInteger(e.target.value))
    }
    return (
        <>
            <CanvasWithResults canvas={{pixels: pixels, onMouseDown: handleMouseDown}} results={results} onClear={()=>handleClear()} />
            <Training onSubmit={handleSubmit} onChange={handleChoiceChange} value={givenLabel}/>
        </>
    )
}

export default TrainContainer