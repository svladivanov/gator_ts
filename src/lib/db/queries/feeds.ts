import { db } from '..'
import { feeds } from '../schema'
import { firstOrUndefined } from './utils'

export async function createFeed(
  feedName: string,
  feedURL: string,
  userID: string
) {
  const result = await db
    .insert(feeds)
    .values({ name: feedName, url: feedURL, userId: userID })
    .returning()

  return firstOrUndefined(result)
}
