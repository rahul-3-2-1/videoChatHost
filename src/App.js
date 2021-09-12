import Navbar from './Components/Navbar';
import './App.css';
import React from 'react';
import { Route,Switch } from 'react-router-dom';
import Room from './Components/Room';


function App() {
  
  return(
    <div>

    <Route path='/' >
    <Navbar/>

    </Route>
    <Route path='/room/:id'>
      <Room/>

    </Route>
    </div>

  )
}

export default App;
