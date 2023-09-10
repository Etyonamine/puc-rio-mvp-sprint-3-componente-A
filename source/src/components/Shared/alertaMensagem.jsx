export default function AlertaMensagem(tipo_mensagem_parametro, texto_parametro) {
    const renderSwitch = ((param, texto) => {
        
        switch (tipo_mensagem_parametro) {
            case "sucesso":
                return '<Alert severity={"success"}>{texto}</Alert>';               

            case "erro":
                return '<Alert severity="error" > {texto}</Alert>';
                
            case "alerta":
                return '<Alert severity="warning">{mensageTexto}</Alert>';
                 
            default:
                return '<Alert severity="info">{mensageTexto}</Alert>';                
        }
    });    
    return (
        <>       
            {renderSwitch(tipo_mensagem_parametro, texto_parametro)}
        </>
    );
}