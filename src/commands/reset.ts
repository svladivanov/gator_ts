import { deleteAllUsers } from 'src/lib/db/queries/users'

export async function handlerReset(_: string) {
  try {
    await deleteAllUsers()
    console.log(`All users in table "users" has been deleted`)
    process.exit(0)
  } catch (err) {
    throw new Error(
      `Error deleting all users in "users" table: ${(err as Error).message}`
    )
  }
}
