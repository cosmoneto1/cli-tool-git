#!/usr/bin/env node
import enquirer from 'enquirer';
import jetpack from 'fs-jetpack';
import chalk from 'chalk';
const { MultiSelect, Input } = enquirer;
const log = console.log;
let projectName;

const promptInput = new Input({
  message: 'Digite o nome do projeto?',
  initial: 'Projeto',
});

promptInput
  .run()
  .then((answer) => {
    projectName = answer;
    nexts();
  })
  .catch(console.error);

const promptMultiSelect = new MultiSelect({
  name: 'value',
  message: 'Deseja criar os arquivos?',
  hint: '(Use <space> to select, <return> to submit)',
  limit: 7,
  initial: [0, 1],
  choices: [
    { name: '.gitignore', value: '.gitignore' },
    { name: 'README.md', value: 'README.md' },
  ],
});

const nexts = () => {
  promptMultiSelect
    .run()
    .then((answer) => files(answer))
    .catch(console.error);
};

const files = (options) => {
  jetpack.remove('dist');

  if (options.length === 0) {
    log(chalk.red('Selecione pelo menos um arquivo!'));
    return;
  }

  log('');

  options.map((it) => {
    log(chalk.green('Criando o arquivo na pasta dist/' + it));
    let txt = jetpack.read(`templates/${it}`);
    txt = txt.replace(/\[\[projeto\]\]/g, projectName);
    jetpack.write(`dist/${it}`, txt);
  });

  log('');

  log(chalk.yellow('Para acessar os arquivos:') + chalk.white(' cd dist/ '));
};
