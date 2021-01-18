import React from 'react'
import './Training.css'

// TODO: separate Train from Test
export type TraningProps = {
    onSubmit: React.FormEventHandler<HTMLElement>,
    onChange: React.ChangeEventHandler<HTMLElement>,
    value: number
}

const Training:React.FC<TraningProps> = ({onSubmit, onChange, value}) => {
    return (
        <div id='train-form-wrapper'>
            <div>TRAIN</div>
            <form onSubmit={onSubmit}>
            <select value={value} onChange={onChange}>
                {[0,1,2,3,4,5,6,7,8,9].map((v) => <option key={v} value={v}>{v}</option>)}
            </select>
            <input type='submit' value='submit' />
            </form>
        </div>
    )
}

export default Training