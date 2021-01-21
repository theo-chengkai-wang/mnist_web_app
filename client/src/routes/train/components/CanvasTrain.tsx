import React from 'react'
import './CanvasTrain.css'
import Canvas, {CanvasProps} from '../../../shared_components/Canvas'
import Results, {ResultsProps} from '../../../shared_components/Results'
import Training, {TrainingProps} from './Training'

export type CanvasTrainProps = {
    canvas: CanvasProps,
    results: ResultsProps,
    train: TrainingProps,
    onClear: () => void
}

const CanvasTrain: React.FC<CanvasTrainProps> = ({canvas, results, train, onClear}) => {
    return (
        <div className="canvas-with-res">
            <div className="canvas-wrapper">
                <Canvas pixels={canvas.pixels} onMouseDown={canvas.onMouseDown} />
                <div className="clear-button-wrapper">
                    <button onClick={()=>onClear()}>Clear</button>
                </div>
            </div>
            <div className="side-bar">
                <Results {...results}/>
                <Training {...train} />
            </div>
        </div>
    )
}

export default CanvasTrain