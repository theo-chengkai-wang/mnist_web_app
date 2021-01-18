import React from 'react'
import './CanvasWithResults.css'
import Canvas, {CanvasProps} from './Canvas'
import Results, {ResultsProps} from './Results'

export type CanvasWithResultsProps = {
    canvas: CanvasProps,
    results: ResultsProps,
    onClear: () => void
}

const CanvasWithResults: React.FC<CanvasWithResultsProps> = ({canvas, results, onClear}) => {
    return (
        <>
            <Canvas pixels={canvas.pixels} onMouseDown={canvas.onMouseDown} />
            <div className="clear-button-wrapper">
                <button onClick={()=>onClear()}>Clear</button>
            </div>
            <Results {...results}/>
        </>
    )
}

export default CanvasWithResults