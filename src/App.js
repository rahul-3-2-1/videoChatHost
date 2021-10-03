import Navbar from './Components/Navbar';
import './App.css';
import React from 'react';
import { Route } from 'react-router-dom';
import ReactTooltip from 'react-tooltip';
import Room from './Components/Room';


function App() {
  
  return(
    <>
    <div>

    <Route exact path='/' >
    <Navbar/>

    </Route>
    <Route exact  path='/room/:id'>
      <Room/>

    </Route>
    </div>
    <ReactTooltip/>
    </>

  )
}

export default App;
