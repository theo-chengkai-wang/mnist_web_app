import React from 'react'
import './Training.css'

// TODO: separate Train from Test
export type TrainingProps = {
    onSubmit: React.FormEventHandler<HTMLElement>,
    onChange: React.ChangeEventHandler<HTMLElement>,
    isUploaded: boolean,
    value: number
}

const Training:React.FC<TrainingProps> = ({onSubmit, onChange, isUploaded, value}) => {
    return (
        <div id='train-form-wrapper'>
            <h3>Train</h3>
            <form onSubmit={onSubmit}>
                <select value={value} onChange={onChange}>
                    {[0,1,2,3,4,5,6,7,8,9].map((v) => <option key={v} value={v}>{v}</option>)}
                </select>
                <input type='submit' value='Submit' />
            </form>
            {isUploaded && 
            <div className="success">Success</div>
            }
        </div>
    )
}

export default Training