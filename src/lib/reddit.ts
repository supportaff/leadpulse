import { env } from '@/lib/env'

interface RedditPost {
  id: string
  title: string
  selftext: string
  author: string
  subreddit: string
  url: string
  permalink: string
  created_utc: number
  score: number
  num_comments: number
}

class RedditClient {
  private accessToken: string | null = null
  private tokenExpiry = 0

  async getAccessToken(): Promise<string> {
    if (this.accessToken && Date.now() < this.tokenExpiry) {
      return this.accessToken
    }
    const credentials = Buffer.from(
      `${env.reddit.clientId}:${env.reddit.clientSecret}`
    ).toString('base64')

    const res = await fetch('https://www.reddit.com/api/v1/access_token', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': env.reddit.userAgent,
      },
      body: 'grant_type=client_credentials',
    })

    if (!res.ok) throw new Error(`Reddit auth failed: ${res.status}`)
    const data = await res.json()
    this.accessToken = data.access_token
    this.tokenExpiry = Date.now() + (data.expires_in - 60) * 1000
    return this.accessToken!
  }

  async searchPosts(
    keywords: string[],
    subreddits: string[] = []
  ): Promise<RedditPost[]> {
    const token = await this.getAccessToken()
    const query = keywords.map((k) => `"${k}"`).join(' OR ')
    const sub = subreddits.length > 0 ? subreddits.join('+') : 'all'

    const url = new URL(`https://oauth.reddit.com/r/${sub}/search`)
    url.searchParams.set('q', query)
    url.searchParams.set('sort', 'new')
    url.searchParams.set('t', 'day')
    url.searchParams.set('limit', '50')
    url.searchParams.set('restrict_sr', subreddits.length > 0 ? 'true' : 'false')

    const res = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${token}`,
        'User-Agent': env.reddit.userAgent,
      },
    })

    if (!res.ok) throw new Error(`Reddit search failed: ${res.status}`)
    const data = await res.json()
    return (data.data?.children ?? []).map((c: { data: RedditPost }) => c.data)
  }
}

export const redditClient = new RedditClient()
