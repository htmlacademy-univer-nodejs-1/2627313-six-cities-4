import chalk from 'chalk';
import {Command} from './command.interface.js';

export class HelpCommand implements Command {
  public readonly name = '--help';

  public async execute(): Promise<void> {
    console.log(`
        Утилита для подготовки данных для REST API сервера.
        Пример: cli.js --<command> [--arguments]\n`,
    chalk.white('\tКоманды:\n'),
    chalk.green('\t--help:                      '), chalk.bgMagenta('# Выводит справочную информацию\n'),
    chalk.yellow('\t--version:                   '), chalk.bgMagenta('# Выводит номер версии\n'),
    chalk.red('\t--import <path>:             '), chalk.bgMagenta('# Импортирует данные из TSV файла\n'),
    chalk.blue('\t--generate <n> <path> <url>  '), chalk.bgMagenta('# Генерирует указанное количество тестовых данных'));
  }
}
