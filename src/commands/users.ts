import { setUser } from '../config'

export function handlerLogin(cmdName: string, ...args: string[]) {
  if (args.length !== 1) {
    console.error(`Usage: ${cmdName} <username>`)
    process.exit(1)
  }

  const userName = args[0]
  setUser(userName)
  console.log(`User switched to ${userName} successfully`)
}
