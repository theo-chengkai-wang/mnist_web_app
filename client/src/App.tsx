import React from 'react';
import { Router, Link } from '@reach/router';
//import logo from './logo.svg';
import './App.css';
import PredictContainer from './routes/test/PredictContainer';
import TrainContainer from './routes/train/TrainContainer';

const App: React.FC<{}> = () => {
  return (
    <>
    <nav>
      <Link to="/">Predict</Link> |{" "}
      <Link to="train">Training</Link>
    </nav>
      <Router>
        <PredictContainer path='/'/>
        <TrainContainer path='train' />
      </Router>
    </>
  );
}

export default App;
