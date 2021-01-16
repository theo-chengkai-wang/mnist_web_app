import React from 'react'
import './Results.css'

export type ResultsProps = { prediction: number; probability: number; }

const Results:React.FC<ResultsProps> = ({prediction, probability}) => {
    return (
    <div className="results">
        prediction: {prediction} <br/>
        probability: {probability}
    </div>
    )
}

export default Results
