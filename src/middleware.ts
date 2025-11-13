import { CommandHandler, UserCommandHandler } from 'src/commands/commands'
import { readConfig } from 'src/config'
import { getUserByName } from './lib/db/queries/users'

export function middlewareLoggedIn(
  handler: UserCommandHandler
): CommandHandler {
  return async (cmdName: string, ...args: string[]): Promise<void> => {
    const config = readConfig()
    const userName = config.currentUserName
    if (!userName) {
      throw new Error('User not logged in')
    }

    const user = await getUserByName(userName)
    if (!user) {
      throw new Error('User not found')
    }

    await handler(cmdName, user, ...args)
  }
}
