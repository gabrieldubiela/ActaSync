const { exec } = require('child_process');

function start() {
  console.log('Iniciando o servidor de desenvolvimento...');
  exec('react-scripts start', (error, stdout, stderr) => {
    if (error) {
      console.error(`Erro ao iniciar: ${error}`);
      return;
    }
    console.log(stdout);
    console.error(stderr);
  });
}

function build() {
  console.log('Gerando a build de produção...');
  exec('react-scripts build', (error, stdout, stderr) => {
    if (error) {
      console.error(`Erro ao gerar a build: ${error}`);
      return;
    }
    console.log(stdout);
    console.error(stderr);
  });
}

function deploy() {
  console.log('Fazendo o deploy para o Firebase Hosting...');
  exec('firebase deploy --only hosting', (error, stdout, stderr) => {
    if (error) {
      console.error(`Erro ao fazer o deploy: ${error}`);
      return;
    }
    console.log(stdout);
    console.error(stderr);
  });
}

const args = process.argv.slice(2);
const command = args[0];

switch (command) {
  case 'start':
    start();
    break;
  case 'build':
    build();
    break;
  case 'deploy':
    deploy();
    break;
  default:
    console.log('Comandos disponíveis: start, build, deploy');
}