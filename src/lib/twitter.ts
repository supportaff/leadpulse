import { env } from '@/lib/env'

interface Tweet {
  id: string
  text: string
  author_id: string
  created_at: string
  author?: {
    username: string
    name: string
  }
}

class TwitterClient {
  async searchTweets(keywords: string[]): Promise<Tweet[]> {
    const query = keywords.map((k) => `"${k}"`).join(' OR ')
    // Exclude retweets and replies to get original posts only
    const fullQuery = `(${query}) -is:retweet -is:reply lang:en`

    const url = new URL('https://api.twitter.com/2/tweets/search/recent')
    url.searchParams.set('query', fullQuery)
    url.searchParams.set('max_results', '50')
    url.searchParams.set('tweet.fields', 'created_at,author_id,text')
    url.searchParams.set('expansions', 'author_id')
    url.searchParams.set('user.fields', 'username,name')

    const res = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${env.twitter.bearerToken}`,
      },
    })

    if (!res.ok) throw new Error(`Twitter search failed: ${res.status}`)
    const data = await res.json()

    const users: Record<string, { username: string; name: string }> = {}
    for (const u of data.includes?.users ?? []) {
      users[u.id] = { username: u.username, name: u.name }
    }

    return (data.data ?? []).map((t: Tweet) => ({
      ...t,
      author: users[t.author_id],
    }))
  }
}

export const twitterClient = new TwitterClient()
