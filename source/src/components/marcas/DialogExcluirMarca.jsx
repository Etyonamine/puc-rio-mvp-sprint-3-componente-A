
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import DeleteIcon from '@mui/icons-material/Delete';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { useNavigate } from 'react-router-dom';
import React, {useEffect, useState} from 'react';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function DialogExcluirMarca({ marcaParam },) {
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const [mostrar_mensagem_sucesso, setMensagemComSucesso] = useState(false);
  const [mostrar_mensagem_com_erro, setMensagemComErro] = useState(false);
  const [lista, setLista] = useState([]); 
  const [textoComErro, setTextoComErro] = useState('');

  useEffect(()=>{     
    fetch(`${import.meta.env.VITE_URL_API_VEICULO}/marca_modelo_id?codigo_marca=${marcaParam.codigo}`)
    .then(response => response.json())
    .then(responseData => setLista(responseData))
    .catch(error => console.error(error));
  },[]); 
  
  const handleClickOpen = () => {    
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    handleCloseMensagemComErro();
    handleCloseMensagemSucesso();
  };

  const handleCloseMensagemSucesso = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setMensagemComSucesso(false);

  };

  const handleCloseMensagemComErro = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setMensagemComErro(false);

  };

  const handleMensagemComErro = (erro) => {
    setTextoComErro(erro);
    setMensagemComErro(true);
    
  }

  const handleMensagemComSucesso = () => {
    setMensagemComSucesso(true);
    setTimeout(() => {      
      handleClose();
      redirect();
    }, 4000);

  };

  const redirect = () => {
    navigate('/Marca/1');
  };

  const excluirRegistro = (() => {
    let quantidadeModelos = lista.lista.length;

    if (quantidadeModelos >0)
    {
      handleMensagemComErro(`Não é possível excluir! Existe [ ${quantidadeModelos} ] modelo(s) com esta marca!`);
      return false;
    }
    const data = new FormData();
    data.append("codigo", marcaParam.codigo);    
    
    try {

      fetch(`${import.meta.env.VITE_URL_API_VEICULO}/marca`,
        {
          method: 'DELETE',
          body: data
        })
        .then((response) => {          
          if (response.status === 204) {             
            handleMensagemComSucesso();
          }else{
            handleMensagemComErro(error);      
          }
        })
    } catch (error) {
      handleMensagemComErro(error);
    }
  });

  return (
    <>
      <Button variant="contained" size="small" endIcon={<DeleteIcon />} color='error' onClick={handleClickOpen}>
        Excluir
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"

      >
        <DialogTitle id="alert-dialog-title"
          sx={{
            bgcolor: 'red',
            color: 'white',
            /* boxShadow: 1,
            borderRadius: 2, */
            p: 2,
            minWidth: 568,
            height: 5,
            width: 568,
            fontSize: 14,

          }}
        >
          Tipo de Operação - Excluir
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description"
            sx={{
              bgcolor: '#white',
              color: 'black',
              fontSize: 14,
              textAlign: 'left'
            }}
          >
            Tem certeza que deseja excluir a Marca <b> [ {marcaParam.nome} ]</b>?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button id="contained" onClick={excluirRegistro}>SIM</Button>
          <Button id="contained" onClick={handleClose} autoFocus>NÃO</Button>
        </DialogActions>
      </Dialog>
      <Snackbar open={mostrar_mensagem_sucesso} autoHideDuration={3000} onClose={handleCloseMensagemSucesso}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center"
        }}
      >
        <Alert onClose={handleCloseMensagemSucesso} severity="success" sx={{ width: '100%' }}>Registro excluido com sucesso!</Alert>
      </Snackbar>
      <Snackbar open={mostrar_mensagem_com_erro} autoHideDuration={3000} onClose={handleCloseMensagemComErro}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center"
        }}
      >
        <Alert onClose={handleCloseMensagemComErro} severity="error" sx={{ width: '100%' }}>Não é possível excluir o registro! <b>{textoComErro}</b></Alert>
      </Snackbar>
    </>
  );
}