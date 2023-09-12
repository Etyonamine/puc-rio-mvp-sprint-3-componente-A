import { useNavigate } from 'react-router-dom';
import ReturnIcon from '@mui/icons-material/Replay';
import Button from '@mui/material/Button';

export default function BotaoRetornar(props) {
    const navigate = useNavigate();
    const goBack = () => {
		navigate(-1);
	}
    return <>
        <Button onClick={goBack} 
                variant="contained" 
                endIcon={<ReturnIcon />} 
                disabled = {props.disabled === null?false: props.disabled} >
            Voltar
        </Button>
    </>;
}