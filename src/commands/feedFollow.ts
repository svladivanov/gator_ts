import { readConfig } from 'src/config'
import {
  createFeedFollow,
  getFeedFollowsForUser,
} from 'src/lib/db/queries/feedFollows'
import { getFeedByURL } from 'src/lib/db/queries/feeds'
import { getUserByName } from 'src/lib/db/queries/users'

export async function handlerFollow(cmdName: string, ...args: string[]) {
  if (args.length !== 1) {
    throw new Error(`Usage: ${cmdName} <feed_url>`)
  }

  const feedURL = args[0]
  try {
    const config = readConfig()
    const user = await getUserByName(config.currentUserName)
    if (!user) {
      throw new Error('User not found')
    }

    const feed = await getFeedByURL(feedURL)
    if (!feed) {
      throw new Error('Feed not found')
    }

    const ffRow = await createFeedFollow(user.id, feed.id)
    if (!ffRow) {
      throw new Error('could not create feed follow')
    }

    console.log(
      `Feed "${ffRow.feedName}" successfully followed by ${ffRow.userName}`
    )
  } catch (err) {
    throw new Error(`error creating feed follow: ${(err as Error).message}`)
  }
}

export async function handlerFollowing(_: string) {
  try {
    const config = readConfig()

    const user = await getUserByName(config.currentUserName)
    if (!user) {
      throw new Error('User not found')
    }

    const followedFeeds = await getFeedFollowsForUser(user.id)
    console.log(`${user.name} follows these feeds:`)
    for (const feedFollow of followedFeeds) {
      console.log(`  - ${feedFollow.feedName}`)
    }
  } catch (err) {
    throw new Error(`error getting feed follows: ${(err as Error).message}`)
  }
}
