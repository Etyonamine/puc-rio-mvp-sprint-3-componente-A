import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import LogoEmpresa from '../assets/LogoEmpresa2.png';
import {Link} from 'react-router-dom';

const pages = [
                  {nome :'Registro', rota : 'Registro'},
                  {nome :'Veículo', rota : 'Veiculo'},
                  /* {nome :'Tipo Operação', rota: 'TipoOperacao'}, */
                  {nome :'Marca',rota:'Marca'},
                  {nome :'Modelo',rota:'Modelo'}
               ];
const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

function NavBar() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };


  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
       
          {/* <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} /> */}
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >            
            <Box 
              component = "img"
              height={50}
              width={80}
              src={LogoEmpresa}
            />            
          </Typography>          
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page.rota} onClick={handleCloseNavMenu}>
                  <Typography textAlign="center">
                    <Link style = {{textDecoration: "none", color: "black"}} to={`/${page.rota}`}>{page.nome}</Link>                    
                  </Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          {/* <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} /> */}
          {/* ********************************************* titulo do sistema *****************************************************************/} 
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
             <Box 
              component = "img"
              height={120}
              width={120}
              src={LogoEmpresa}
            />Sistema de gerenciamento de estacionamento
          </Typography>
          
          {/* ********************************************* menu principal do sistema *****************************************************************/} 
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }} justifyContent = "right">
            {pages.map((page) => (
              <Button
                key={page.rota}
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                <Link style = {{textDecoration: "none", color : "white"}} to={`/${page.rota}`}>{page.nome}</Link>                    
              </Button>
            ))}
          </Box>       
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default NavBar;
