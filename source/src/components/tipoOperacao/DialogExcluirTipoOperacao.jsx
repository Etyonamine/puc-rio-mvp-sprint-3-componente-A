import * as React from 'react';
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

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function DialogExcluirTipoOperacao({ tipoOperacaoParam },) {
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const [mostrar_mensagem_sucesso, setMensagemComSucesso] = React.useState(false);
  const [mostrar_mensagem_com_erro, setMensagemComErro] = React.useState(false);

  const [tipoOperacao, setTipoOperacao] = React.useState({});
  
  
  
  const handleClickOpen = () => {
    setTipoOperacao(tipoOperacaoParam);
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
    setMensagemComErro(true);
    console.log(erro);
  }
  const handleMensagemComSucesso = () => {
    setMensagemComSucesso(true);
    setTimeout(() => {      
      redirect();
    }, 5000);

  };

  const redirect = () => {
    navigate('/ListaTipoOperacao');
  };

  const excluirRegistro = (() => {
    const data = new FormData();
    data.append("codigo", tipoOperacao.codigo);    
    let url = `${import.meta.env.VITE_URL_API_OPERACAO}/tipo_operacao`;
     

    try {

      fetch(url,
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
            Tem certeza que deseja excluir a Siga <b> [ {tipoOperacao.sigla} ]</b>  com a descrição <b> [ {tipoOperacao.descricao} ] </b>?
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
        <Alert onClose={handleCloseMensagemComErro} severity="error" sx={{ width: '100%' }}>Ocorreu um erro ao salvar o registro!</Alert>
      </Snackbar>
    </>
  );
}