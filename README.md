# Puc-rio-mvp-sprint-3-componente-A
Trabalho de MVP do sprint 3 - Arquitetura de software
Esta é uma aplicação front-end que irá consumir as APIs abaixo:

## Documentos importantes
    Arquivo com o diagrama de componentes com o nome de "Diagrama-componentes-MVP-Sprint-03.pdf".
    Encontra-se na raiz do repositório.


## API - Climática 
    Disponibiliza api para a previsão do tempo 
    site = https://openweathermap.org/
    ApiKey => A chave será fornecida ao professor e deverá ser copiada e substituida no arquivo 
        env no "VITE_TEMPO_API_KEY"
## API - Veiculos
    Disponibiliza os registros armazenados de veiculos, marca e modelo.
    Possui os metodos inclusão, edição, exclusão, 
    consulta de uma lista ou um único registro através da chave do registro.

## API - Operação do estacionamento
    Disponibiliza os registros armazenados de entrada e saída dos veiculos.
    Possui os metodos inclusão, edição, exclusão, 
    consulta de uma lista ou um único registro.

### Requisitos
1)Instalar o NODE versão 18.17.1


### Execução
1)Iniciar os serviços do componente C e D, seja via projeto ou via imagem no docker

2)Ambiente de desenvolvimento: 
    2.1)Acessar o diretório source 

    2.2) Nos arquivos env e env.production deve ser informado depois da constante VITE_TEMPO_API_KEY após o sinal de igual a 
         APIKey do clima que será passado para o professor Daniel Marreco
        
        A constante chama-se VITE_TEMPO_API_KEY= dentro do arquivo env e env.production
        Observação: Os arquivos se encontram na raiz da pasta source

    2.3)Executar o comando = npm run dev


## Construção da IMAGEM para o Docker
1)Fazer o download do arquivo api_key_tempo.txt que contém a chave para ser aplicado nos arquivos ENV e ENV.Production (ambiente)
2)Aplicar a chave APIKey disponibilizado no anexo na entrega do MVP.
3)docker build -t componente-a .

### executar o comando 
 docker run -p 5173:5173 componente-a 