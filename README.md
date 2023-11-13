# bet-technical-challenge-API
<h1>Descrição</h1>

  <p>A Quer Apostar Quanto? API é uma aplicação que possibilita aos usuários participar de um bolão, permitindo que eles apostem entre si em jogos de futebol.</p>

  <h3>Comandos</h3>
  Para inicializar corretamente a aplicação, execute os seguintes comandos:

```bash
npm install
npm run dev:migration:generate
npm run test:migration:generate
npx prisma migrate dev
npm run dev
```

<h1>Deploy</h1>
A API está atualmente disponível no seguinte endereço:

•     https://bet-api-b6ei.onrender.com

<h1>Rotas</h1>
<h2>Participantes</h2>
• <strong>Criar Participante:</strong> Registra um novo participante.


    POST /participants

• <strong>Retornar Participante:</strong> Retorna uma lista com todos os participantes.

    GET /participants

<h2>Jogos</h2>
• <strong>Criar Jogo:</strong> Registra um novo jogo.


    POST /games

• <strong>Retornar jogos:</strong> Retorna uma lista com todos os jogos.

    GET /games

• <strong>Retornar Jogo específico:</strong> Retorna o jogo que contém o id especificado.

    GET /games/:id

• <strong>Finalizar Jogo:</strong> Finaliza um jogo e atualiza o saldo dos ganhadores.

    POST /games/:id/finish

<h2>Apostas</h2>

• <strong>Criar Aposta:</strong> Registra uma nova aposta.

    POST /bets
