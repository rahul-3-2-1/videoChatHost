import Navbar from './Components/Navbar';
import './App.css';
import React from 'react';
import { Route } from 'react-router-dom';
import ReactTooltip from 'react-tooltip';
import Room from './Components/Room';
import Home from './Components/Home';
import { AuthProvider } from './contexts/AuthContext';


function App() {
  
  return(
    <>
    <AuthProvider>
    <div>

<Route exact path='/' >
<Navbar/>
<Home/>

</Route>
<Route exact  path='/room/:id'>
  <Room/>

</Route>
</div>
<ReactTooltip/>
    </AuthProvider>
    
    </>

  )
}

export default App;
