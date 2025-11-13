import { readConfig } from 'src/config'
import { createFeedFollow } from 'src/lib/db/queries/feedFollows'
import { createFeed, getFeeds } from 'src/lib/db/queries/feeds'
import { getUserByID, getUserByName } from 'src/lib/db/queries/users'
import { Feed, User } from 'src/lib/db/schema'

export async function handlerAddFeed(
  cmdName: string,
  ...args: string[]
): Promise<void> {
  if (args.length !== 2) {
    throw new Error(`Usage: ${cmdName} <feed_name> <feed_url>`)
  }

  try {
    const user = await getUserByName(readConfig().currentUserName)
    if (!user) {
      throw new Error(`User ${user} not found`)
    }

    const feedName = args[0]
    const feedURL = args[1]
    const feed = await createFeed(feedName, feedURL, user.id)
    if (!feed) {
      throw new Error('Failed to create feed')
    }

    console.log(`Feed ${feed.name} created successfully for ${user.name}`)

    const feedFollow = await createFeedFollow(user.id, feed.id)
    if (!feedFollow) {
      throw new Error('Failed to follow feed')
    }

    console.log(`Feed ${feed.name} followed successfully for ${user.name}`)
  } catch (err) {
    throw new Error(`Error getting current user: ${(err as Error).message}`)
  }
}

export async function handlerListFeeds(_: string): Promise<void> {
  try {
    const feeds = await getFeeds()
    for (const feed of feeds) {
      const user = await getUserByID(feed.userId)
      if (!user) {
        throw new Error('User not found')
      }
      printFeed(feed, user)
      console.log('=====================================')
    }
  } catch (err) {
    throw new Error(`Error: failed to list feeds: ${(err as Error).message}`)
  }
}

function printFeed(feed: Feed, user: User) {
  console.log(`* ID:            ${feed.id}`)
  console.log(`* Created:       ${feed.createdAt}`)
  console.log(`* Updated:       ${feed.updatedAt}`)
  console.log(`* name:          ${feed.name}`)
  console.log(`* URL:           ${feed.url}`)
  console.log(`* User:          ${user.name}`)
}
