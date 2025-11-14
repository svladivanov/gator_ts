import { eq, sql } from 'drizzle-orm'
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

export async function getFeeds() {
  return await db.select().from(feeds)
}

export async function getFeedByURL(feedURL: string) {
  const result = await db.select().from(feeds).where(eq(feeds.url, feedURL))

  return firstOrUndefined(result)
}

export async function markFeedFetched(feedID: string) {
  const result = await db
    .update(feeds)
    .set({ lastFetchedAt: new Date() })
    .where(eq(feeds.id, feedID))
    .returning()

  return firstOrUndefined(result)
}

export async function getNextFeedToFetch() {
  const result = await db
    .select()
    .from(feeds)
    .orderBy(sql`${feeds.lastFetchedAt} desc nulls first`)
    .limit(1)

  return firstOrUndefined(result)
}
