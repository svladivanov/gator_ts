import { fetchFeed } from 'src/lib/rss'

export async function handlerAgg(_: string) {
  const feedURL = 'https://www.wagslane.dev/index.xml'

  const rssFeedData = await fetchFeed(feedURL)
  const rssFeed = JSON.stringify(rssFeedData, null, 2)
  console.log(rssFeed)
}
