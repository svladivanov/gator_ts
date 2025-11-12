import {
  createUser,
  deleteAllUsers,
  getUserByName,
} from 'src/lib/db/queries/users'
import { setUser } from '../config'

export async function handlerLogin(cmdName: string, ...args: string[]) {
  if (args.length !== 1) {
    throw new Error(`Usage: ${cmdName} <username>`)
  }

  const userName = args[0]
  const existingUser = await getUserByName(userName)
  if (!existingUser) {
    throw new Error(`Error: user ${userName} not found`)
  }

  setUser(existingUser.name)
  console.log(`User switched to ${existingUser.name} successfully`)
}

export async function handlerRegister(cmdName: string, ...args: string[]) {
  if (args.length !== 1) {
    throw new Error(`Usage: ${cmdName} <username>`)
  }

  try {
    const userName = args[0]
    const user = await createUser(userName)

    setUser(userName)
    console.log(`User ${userName} was created:`)
    console.log(`${JSON.stringify(user, null, 2)}`)
  } catch (e) {
    throw new Error(`Error creating user: ${(e as Error).message}`)
  }
}

export async function handlerReset(cmdName: string) {
  try {
    console.log(`Running ${cmdName} on "users" table`)
    await deleteAllUsers()
    console.log(`All users in table "users" has been deleted`)
    process.exit(0)
  } catch (err) {
    throw new Error(
      `Error deleting all users in "users" table: ${(err as Error).message}`
    )
  }
}
