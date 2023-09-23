import { Outlet } from "react-router-dom";
import Navbar from './components/Navbar';
import TempoApp from '../src/components/externo/Tempo';
import TituloPrincipal from './components/TituloPrincipal';
import DateCalendarValue from './components/Shared/Calendario';

import Grid from '@mui/material/Grid';

function App() {  

  return (
    <div className="App">      
        <Grid container spacing={2}>                    
          <Grid item xs={12}>            
            <TituloPrincipal />
            <Navbar />
          </Grid>
          <Grid item xs={2}> 
            <TempoApp />
            <DateCalendarValue />
          </Grid>
          <Grid item xs={10}>
            <Outlet />
          </Grid>
        </Grid>
    </div>
  )
}

export default App
