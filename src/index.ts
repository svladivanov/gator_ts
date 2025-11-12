import {
  type CommandsRegistry,
  registerCommand,
  runCommand,
} from './commands/commands'
import { handlerLogin } from './commands/users'

function main() {
  const registry: CommandsRegistry = {}

  registerCommand(registry, 'login', handlerLogin)
  const args = process.argv.slice(2)

  if (args.length < 1) {
    console.error('You must provide at least one command')
    process.exit(1)
  }

  const cmdName = args[0]
  const cmdArgs = args.slice(1)

  runCommand(registry, cmdName, ...cmdArgs)
}

main()
