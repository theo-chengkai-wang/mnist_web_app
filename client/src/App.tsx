import React from 'react';
import logo from './logo.svg';
import './App.css';
import Canvas from './containers/Canvas';
import Pixel from './components/Pixel'

const App: React.FC<{}> = () => {
  return (
    <>
      <Canvas />
    </>
  );
}

export default App;
