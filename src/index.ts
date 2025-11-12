import {
  type CommandsRegistry,
  registerCommand,
  runCommand,
} from './commands/commands'
import {
  handlerReset,
  handlerLogin,
  handlerRegister,
  handlerListUsers,
} from './commands/users'

async function main() {
  const args = process.argv.slice(2)

  if (args.length < 1) {
    throw new Error('You must provide at least one command')
  }

  const cmdName = args[0]
  const cmdArgs = args.slice(1)
  const registry: CommandsRegistry = {}

  registerCommand(registry, 'login', handlerLogin)
  registerCommand(registry, 'register', handlerRegister)
  registerCommand(registry, 'reset', handlerReset)
  registerCommand(registry, 'users', handlerListUsers)

  try {
    await runCommand(registry, cmdName, ...cmdArgs)
  } catch (err) {
    if (err instanceof Error) {
      console.error(`Error running command ${cmdName}: ${err.message}`)
    } else {
      console.error(`Error running command ${cmdName}: ${err}`)
    }
    process.exit(1)
  }
  process.exit(0)
}

main()
