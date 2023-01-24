<div style="width:100%; display: flex; flex-direction: row; justify-content: center;">
  <picture>
    <img align="center" src="/metrics.plugin.licenses.svg" alt="Licenças">
  </picture>
  <a target="_blank" href="https://github.com/ta-iot/swge.api">
    <img align="center" src="/metrics.plugin.repositories.svg" alt="Repositórios Vinculados">
  </a>
</div>
 
# __Front-End Sistema Web para Gestão de Eventos__
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![NPM](https://img.shields.io/badge/NPM-%23000000.svg?style=for-the-badge&logo=npm&logoColor=white)
![MUI](https://img.shields.io/badge/MUI-%230081CB.svg?style=for-the-badge&logo=mui&logoColor=white)

Front-End desenvolvido em ReactJS(v17) para o projeto SWGE. Um projeto que tem como objetivo o gerenciamento de Eventos, desde cadastro de usuário, atividades, trilhas, edições, certificados, caravanas, e etc. As interfaces foram produzidas utilizando ferrametas como:
- `MUIv5(Material-UI)`;
- `FullCalendar`;
- `date-fns`;
- `yup`;
- `mui-datatables`;
- `lodash`;
- `react-mui-dropzone`;
- `mui-rte`;
- `axios`;
- `pace-js`;
- `pdf-lib`;
- `react-joyride`;
- `@paypal/react-paypal-js`.

## __Instalação__
Para a utilização do Front-End, é necessário possuir na máquina a qual vai armazenar e executar o projeto certos serviços, que são indicados na seção de Requisitos.

A partir de *clone* (`git clone https://github.com/ta-iot/swge.web.git`), é necessário a execução da instalação dos módulos escolhidos dentro do arquivo `package.json`, neste caso utilizando o comando `npm install`. 

### __Requisitos:__

- Node;
- Ambiente de Desenvolvimento voltado a desenvolvimento Web (WebStorm, Visual Studio Code, Intellij, etc..);
- API instalada e rodando.

## __Usabilidade__
Foi disponibilizado um documento contendo os fluxos de caso de uso do sistema, dados utilizados, e descrições das funcionalidades. O arquivo se encontra [aqui](/.github/docs/document-usability.md)

## __Variáveis de Ambiente:__
Para a execução de algumas funcionalidades dentro sistema, é necessário a utilização de algumas variáveis de ambiente, que servem para repassar as credenciais ou informações dinâmicas. Elas são:
- __LGPD_LINK__: Link para a página aonde se concentra as informações sobre as diretrizes e contatos da LGPD responsáveis do projeto ou instituição;
- __PAGSEGURO_PUBLIC_KEY__: Credencial da chave pública do PagSeguro. Para ambiente *sandbox*[^1], essa chave é comum e encontrada nos tutoriais da PagSeguro. Ela serve para a criptografia do cartão de crédito inserido no pagamento;
- __PAYPAL_CLIENT_ID__: Credencial da Identificação do Cliente PayPal, ele serve para conectar ao serviço PayPal para utilizar as funcionalidades de pagamento.

### __Variáveis de Integração e Entrega Contínua(CICD)__:
Caso tenha a necessidade ou curiosidade de adicionar a metodologia DevOps de Integração e Entrega Contínua no projeto utilizando o GitLab ou softwares parecidos, o projeto possui um arquivo configurado de Pipelines (.gitlab-ci.yml) que possui integração com outros softwares de controle de código e versionamento de imagens de containers. As variáveis necessárias para utilizar o CI/CD devem ser adicionados dentro da plataforma do serviço de gerencimento de CI/CD escolhido com os seguintes nomes: 
- __$HB_USER__: Usuário do Serviço Harbor, que faz um host de um repositorio de imagens docker;
- __$HB_PASS__: Senha do usuário do Serviço Harbor;
- __$Server_HOST__: Url do host aonde o Serviço Harbor está hospedado;
- __$IMG_TEST__: URL do diretório de arquivos para armazenar as imagens do projeto quando o ciclo está em desenvolvimento;
- __$IMG_PRO__: URL do diretório de arquivos para armazenar as imagens do projeto quando o ciclo está em produção

###  Colaboradores  ###
<!-- ALL-CONTRIBUTORS-LIST:START -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center"><a href="https://www.linkedin.com/in/marcos-dellazari-7335b483/"><img src="https://media.licdn.com/dms/image/C4E03AQEGpHdT-Qg_EA/profile-displayphoto-shrink_200_200/0/1516893619771?e=1679529600&v=beta&t=T9Q-5XDHrDX4LC89aS5by0j9sn3Xc3bUIAfyXLLFASc" width="100px;" alt="marcos-dellazari-7335b483"  style="border-radius: 50%"/><br /><sub><b>Marcos Dellazari</b></sub></a><br /><span style="font-size: 14px;">PMO Itaipu</span></td>
      <td align="center"><a href="https://www.linkedin.com/in/luiz-felipe-cavalcanti-de-albuquerque-526962156/"><img src="https://media.licdn.com/dms/image/C4D03AQGndz7-V-GIAQ/profile-displayphoto-shrink_200_200/0/1611232704790?e=1680134400&v=beta&t=LUEDJsYVneQ492JaS2IO2YXPShbZr7JEkDcvIspaFgQ" width="100px;" alt="luiz-felipe-cavalcanti-de-albuquerque-526962156"  style="border-radius: 50%"/><br /><sub><b>Luiz Felipe Cavalcanti</b></sub></a><br /><span style="font-size: 14px;">PMO PTI</span></td>
      <td align="center"><a href="https://www.linkedin.com/in/luciano-louren%C3%A7o-452b34a0/"><img src="https://media.licdn.com/dms/image/C4D03AQH0N282vmw-mw/profile-displayphoto-shrink_200_200/0/1563293246742?e=1680134400&v=beta&t=v-l2tiI93iPpixgrze-oBfgJsKbVwkVQIB9iXU9U3No" width="100px;" alt="luciano-louren%C3%A7o-452b34a0"  style="border-radius: 50%"/><br /><sub><b>Luciano Lourenço</b></sub></a><br /><span style="font-size: 14px;">PMO PTI</span></td>
      <td align="center"><a href="https://github.com/RafaelSantosBraz"><img src="https://avatars.githubusercontent.com/u/20260521?v=4?s=100" width="100px;" alt="RafaelSantosBraz" style="border-radius: 50%"/><br /><sub><b>Rafael Braz</b></sub></a><br /><span style="font-size: 14px;">&#127775; Desenvolvedor</span></td>
      <td align="center"><a href="https://github.com/natarafael"><img src="https://avatars.githubusercontent.com/u/52220532?v=4?s=100" width="100px;" alt="natarafael"  style="border-radius: 50%"/><br /><sub><b>Natã Rafael</b></sub></a><br /><span style="font-size: 14px;">Desenvolvedor</span></td>
    </tr>
    <tr>
      <td align="center"><a href="https://github.com/GRSganderla"><img src="https://avatars.githubusercontent.com/u/37743155?v=4?s=100" width="100px;" alt="GRSganderla"  style="border-radius: 50%"/><br /><sub><b>Guilherme R.</b></sub></a><br /><span style="font-size: 14px;">Desenvolvedor</span></td>
      <td align="center"><a href="https://github.com/val-ery7793"><img src="https://avatars.githubusercontent.com/u/30504079?v=4?s=100" width="100px;" alt="val-ery7793"  style="border-radius: 50%"/><br /><sub><b>Valéria Nunes</b></sub></a><br /><span style="font-size: 14px;">Gestão de Projeto</span></td>
      <td align="center"><a href="https://www.linkedin.com/in/marcos-andr%C3%A9-f-dos-santos-0aa922232/"><img src="https://media.licdn.com/dms/image/C4E03AQHsoH3emyHBPw/profile-displayphoto-shrink_200_200/0/1654169027338?e=1680134400&v=beta&t=i_S4JrVGPcYHEi_RaM2_a-QYjojC6L5icjJ7h1E7ifU" width="100px;" alt="marcos-andr%C3%A9-f-dos-santos-0aa922232"  style="border-radius: 50%"/><br /><sub><b>Marcos André F</b></sub></a><br /><span style="font-size: 14px;">Gestão de Projeto</span></td>
      <td align="center"><a href="https://www.linkedin.com/in/gilson-dias-de-oliveira-550900220/"><img src="https://avatars.githubusercontent.com/u/108937049?v=4?s=100" width="100px;" alt="GilsonDiasOliveira"  style="border-radius: 50%"/><br /><sub><b>Gilson Dias</b></sub></a><br /><span style="font-size: 14px;">Testes/QA</span></td>
      <td align="center"><a href="https://www.linkedin.com/in/andr%C3%A9-domingos-vasconcelos/"><img src="https://media.licdn.com/dms/image/C5603AQFPYVvwxHuwgA/profile-displayphoto-shrink_200_200/0/1554317112258?e=1679529600&v=beta&t=bI2RHBs8sr67z1GNzA1LCej2oI_-WBJRmit-JxqNrGs" width="100px;" alt="andré-domingos-vasconcelos"  style="border-radius: 50%"/><br /><sub><b>André Domingos</b></sub></a><br /><span style="font-size: 14px;">Design</span></td>
    </tr>
    <tr>
      <td align="center"><a href="https://www.linkedin.com/in/carlos-henrique-leite-217324135/"><img src="https://media.licdn.com/dms/image/C4E03AQHFO2tjH8MwWw/profile-displayphoto-shrink_200_200/0/1540945406159?e=1679529600&v=beta&t=1tmx703CDUdkO8yRyYqbx9WowoB3p1rhjMGKCKAXa7k" width="100px;" alt="carlos-henrique-leite-217324135"  style="border-radius: 50%"/><br /><sub><b>Carlos Henrique</b></sub></a><br /><span style="font-size: 14px;">DevOps</span></td>
      <td align="center"><a href="https://github.com/TheodoroFelipe"><img src="https://avatars.githubusercontent.com/u/109289048?v=4?s=100" width="100px;" alt="TheodoroFelipe"  style="border-radius: 50%"/><br /><sub><b>Felipe Theodoro</b></sub></a><br /><span style="font-size: 14px;">LGPD/Documentação</span></td>
      <td align="center"><a href="https://github.com/SGSNT"><img src="https://avatars.githubusercontent.com/u/122492375?v=4?s=100" width="100px;" alt="SGSNT"  style="border-radius: 50%"/><br /><sub><b>Samuel Dos Santos</b></sub></a><br /><span style="font-size: 14px;">Apoio Documentação</span></td>
      <td align="center"><a href="https://www.linkedin.com/in/mateusschindler"><img src="https://media.licdn.com/dms/image/C4D03AQHuTy6xiXHpag/profile-displayphoto-shrink_200_200/0/1578070070592?e=1679529600&v=beta&t=j6gje_Nj1PcepHD09B6SRVKQtzYUX1CPmIz6-YazwaY" width="100px;" alt="mateusschindler"  style="border-radius: 50%"/><br /><sub><b>Mateus Schindler</b></sub></a><br /><span style="font-size: 14px;">Apoio Documentação</span></td>
    </tr>
    
  </tbody>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

## Parceria ##
<img src="/.github/logos/PTI-Logo.png" alt="PTI" width="400">

<img src="/.github/logos/IB-Logo.png" alt="IB"  width="400">

[^1]: Ambiente de teste a qual não reconhece a cobrança como uma cobrança real, não sendo feito a dedução do valor na conta. Para esses ambientes, ambas as APIs fornecem contas ou cartões de teste para simulação. O PayPal disponibiliza contas de teste que possuem cartões atrelado a conta, é possível saber essas contas atráves deste [link](https://developer.paypal.com/dashboard/accounts), onde é apresentado duas contas de teste, sendo uma o comerciante e outra o cliente(a que deve ser utilizada). Já para o PagSeguro neste [link](https://dev.pagseguro.uol.com.br/reference/testing-cards) possui cartões de teste para a realização de cobranças de teste.
[^2]: Ambiente de uso real, onde todas os valores das cobranças vão ser deduzidas da conta e colocadas na conta de recebimento.

