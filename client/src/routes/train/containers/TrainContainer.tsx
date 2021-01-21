import React, {useState, useEffect, useCallback} from 'react'
import './TrainContainer.css'
import { RouteComponentProps } from '@reach/router'
import {chunk, toInteger} from 'lodash';
//import Canvas from '../components/Canvas';
import axios, { AxiosResponse } from 'axios';
import {ResultsProps} from '../../../shared_components/Results'
import CanvasTrain from '../components/CanvasTrain'

// TODO: ADD CSS
// TODO: Clean up code

export type TrainContainerProps = RouteComponentProps

const TrainContainer: React.FC<TrainContainerProps> = () => {
    const [pixels, setPixels] = useState(Array(28*28).fill(0));
    const [results, setResults] = useState({prediction:-1, probability: 0});
    const [givenLabel, setGivenLabel] = useState(0);
    const [isUploaded, setIsUploaded] = useState(false);

    const handleMouseDown:Function = (rowIndex:number, columnIndex:number) => {
        setIsUploaded(false);
        const index = rowIndex*28+columnIndex;
        setPixels((oldPixelValue:number[])=>{
            const copyOfOldPixels = oldPixelValue.slice();
            console.log(copyOfOldPixels);
            copyOfOldPixels[index] = copyOfOldPixels[index]===1? 0:1;
            return copyOfOldPixels;
        });
    };

    const handleClear = () => {
        setIsUploaded(false);
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
            setIsUploaded(results['success'])
        },
        [pixels, givenLabel],
    )

    const handleChoiceChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        setIsUploaded(false)
        setGivenLabel(toInteger(e.target.value))
    }
    return (
        <>
            <CanvasTrain canvas={{pixels: pixels, onMouseDown: handleMouseDown}} 
                results={results} 
                train={{onSubmit:handleSubmit, onChange:handleChoiceChange, isUploaded: isUploaded, value:givenLabel}}
                onClear={()=>handleClear()}
            />
            {/* <Training onSubmit={handleSubmit} onChange={handleChoiceChange} value={givenLabel}/> */}
        </>
    )
}

export default TrainContainer