import Navbar from './Components/Navbar';
import './App.css';
import React from 'react';
import { Route,Switch } from 'react-router-dom';
import Room from './Components/Room';


function App() {
  
  return(
    <div>

    <Route exact path='/' >
    <Navbar/>

    </Route>
    <Route exact  path='/room/:id'>
      <Room/>

    </Route>
    </div>

  )
}

export default App;
