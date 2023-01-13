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

## Colaboradores ##
<picture>
  <img src="/metrics.plugin.people.repository.svg" alt="Colaboradores">
</picture>

## Parceria
<img src="/.github/logos/PTI-Logo.png" alt="PTI" width="200">
<img src="/.github/logos/IB-Logo.png" alt="IB"  width="200">

[^1]: Ambiente de teste a qual não reconhece a cobrança como uma cobrança real, não sendo feito a dedução do valor na conta. Para esses ambientes, ambas as APIs fornecem contas ou cartões de teste para simulação. O PayPal disponibiliza contas de teste que possuem cartões atrelado a conta, é possível saber essas contas atráves deste [link](https://developer.paypal.com/dashboard/accounts), onde é apresentado duas contas de teste, sendo uma o comerciante e outra o cliente(a que deve ser utilizada). Já para o PagSeguro neste [link](https://dev.pagseguro.uol.com.br/reference/testing-cards) possui cartões de teste para a realização de cobranças de teste.
[^2]: Ambiente de uso real, onde todas os valores das cobranças vão ser deduzidas da conta e colocadas na conta de recebimento.
