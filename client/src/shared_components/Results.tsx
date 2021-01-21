import React from 'react'
import './Results.css'

export type ResultsProps = { prediction: number; probability: number;}

const Results:React.FC<ResultsProps> = ({prediction, probability}) => {
    return (
    <div className="results">
        <div className="prediction">
            <h3>Prediction</h3>
            <p>{prediction}</p>
        </div>
        <div className="probability">
            <h5>Probability</h5>
            <p>{probability}</p>
        </div>
    </div>
    )
}

export default Results
