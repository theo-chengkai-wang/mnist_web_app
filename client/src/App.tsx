import React from 'react';
import { Router, Link } from '@reach/router';
import './App.css';
import PredictContainer from './routes/test/containers/PredictContainer';
import TrainContainer from './routes/train/containers/TrainContainer';

interface NavLinkProps {
  to: string,
  className: string,
}

const NavLink:React.FC<NavLinkProps> = props => (
  <Link
    {...props}
    getProps={({ isCurrent }) => {
      // the object returned here is passed to the
      // anchor element's props
      return isCurrent? {
        style: {
          color: "#ffffff",
          backgroundColor: "darkblue",
        }
      }:{};
    }}
  />
);


const App: React.FC<{}> = () => {
  return (
    <>
    <nav className="nav">
      <NavLink to="/" className="link">Predict</NavLink> 
      <NavLink to="train" className="link">Training</NavLink>
    </nav>
      <Router>
        <PredictContainer path='/'/>
        <TrainContainer path='train' />
      </Router>
    </>
  );
}

export default App;
