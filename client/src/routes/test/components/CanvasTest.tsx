import React from 'react'
import './CanvasTest.css'
import Canvas, {CanvasProps} from '../../../shared_components/Canvas'
import Results, {ResultsProps} from '../../../shared_components/Results'

export type CanvasTestProps = {
    canvas: CanvasProps,
    results: ResultsProps,
    onClear: () => void
}

const CanvasTest: React.FC<CanvasTestProps> = ({canvas, results, onClear}) => {
    return (
        <div className="canvas-with-res">
            <div className="canvas-wrapper">
                <Canvas pixels={canvas.pixels} onMouseDown={canvas.onMouseDown} />
                <div className="clear-button-wrapper">
                    <button onClick={()=>onClear()}>Clear</button>
                </div>
            </div>
            <Results {...results}/>
        </div>
    )
}

export default CanvasTest