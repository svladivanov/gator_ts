import { getNextFeedToFetch, markFeedFetched } from 'src/lib/db/queries/feeds'
import { Feed } from 'src/lib/db/schema'
import { fetchFeed } from 'src/lib/rss'
import { parseDuration } from 'src/lib/time'

export async function handlerAgg(cmdName: string, ...args: string[]) {
  if (args.length !== 1) {
    throw new Error(`Usage: ${cmdName} <time_between_requests`)
  }

  const timeArg = args[0]
  const timeBetweenRequests = parseDuration(timeArg)
  if (!timeBetweenRequests) {
    throw new Error(
      `Invalid duration: ${timeArg} - user format 1h / 30m / 15s / 3500ms`
    )
  }

  console.log(`Collecting feeds every ${timeArg}...`)

  scrapeFeeds().catch(handleError)

  const interval = setInterval(() => {
    scrapeFeeds().catch(handleError)
  }, timeBetweenRequests)

  await new Promise<void>((resolve) => {
    process.on('SIGINT', () => {
      console.log('Shutting down feed aggregator...')
      clearInterval(interval)
      resolve()
    })
  })
}

async function scrapeFeeds() {
  const feed = await getNextFeedToFetch()
  if (!feed) {
    console.log('No feeds to fetch')
    return
  }

  console.log('Fount a feed to fetch!')
  scrapeFeed(feed)
}

async function scrapeFeed(feed: Feed) {
  await markFeedFetched(feed.id)

  const feedData = await fetchFeed(feed.url)

  console.log(
    `Feed ${feed.name} collected, ${feedData.channel.item.length} post found`
  )
}

function handleError(err: unknown) {
  console.error(
    `Error scraping feeds: ${err instanceof Error ? err.message : err}`
  )
}
