import React from 'react';
import logo from './logo.svg';
import './App.css';
import PredictContainer from './containers/PredictContainer';
import Pixel from './components/Pixel'

const App: React.FC<{}> = () => {
  return (
    <>
      <PredictContainer />
    </>
  );
}

export default App;
