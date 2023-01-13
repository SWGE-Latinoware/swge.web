<div style="width:100%; display: flex; flex-direction: row; justify-content: center;">
  <picture>
    <img align="center" src="/metrics.plugin.licenses.svg" alt="Licenças">
  </picture>
  <a target="_blank" href="https://github.com/ta-iot/swge.api">
    <img align="center" src="/metrics.plugin.repositories.svg" alt="Repositórios Vinculados">
  </a>
</div>


## __Front-End Sistema Web Gerenciador de Eventos__

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

## __Variáveis de Ambiente:__
Para a execução de algumas funcionalidades dentro sistema, é necessário a utilização de algumas variáveis de ambiente, que servem para repassar as credenciais ou informações dinâmicas. Elas são:
- __LGPD_LINK__: Link para a página aonde se concentra as informações sobre as diretrizes e contatos da LGPD responsável do projeto ou instituição;
- __PAGSEGURO_PUBLIC_KEY__: Credencial da chave pública do PagSeguro. Para ambiente *sandbox*[^1], essa chave é comum e encontrada nos tutoriais da PagSeguro. Ela serve para a criptografia do cartão de crédito inserido no pagamento;
- __PAYPAL_CLIENT_ID__: Credencial da Identificação do Cliente PayPal, ele serve para conectar ao serviço PayPal para utilizar as funcionalidades de pagamento.

## Colaboradores
<picture>
  <img src="/metrics.plugin.people.repository.svg" alt="Colaboradores">
</picture>

[^1]: Ambiente de teste a qual não reconhece a cobrança como uma cobrança real, não sendo feito a dedução do valor na conta. Para esses ambientes, ambas as APIs fornecem contas ou cartões de teste para a simulação. O PayPal disponibiliza contas de teste que possuem cartões atrelado a conta, é possível saber essas contas atráves deste [link](https://developer.paypal.com/dashboard/accounts), onde é apresentado duas contas de teste, sendo uma o comerciante e outra o cliente(a que deve ser utilizada). Já para o PagSeguro neste [link](https://dev.pagseguro.uol.com.br/reference/testing-cards) possui cartões de teste para a realização de cobranças de teste.
[^2]: Ambiente de uso real, onde todas os valores das cobranças vão ser deduzidas da conta e colocadas na conta de recebimento.
