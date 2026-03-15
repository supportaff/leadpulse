import { env } from '@/lib/env';

interface Tweet {
  id: string;
  text: string;
  author_id: string;
  created_at: string;
}

class TwitterClient {
  async searchTweets(keywords: string[]): Promise<Tweet[]> {
    const query = keywords.map(k => `"${k}"`).join(' OR ');
    const fullQuery = `(${query}) lang:en -is:retweet -is:reply`;

    const url = new URL('https://api.twitter.com/2/tweets/search/recent');
    url.searchParams.set('query', fullQuery);
    url.searchParams.set('max_results', '50');
    url.searchParams.set('tweet.fields', 'created_at,author_id,text');

    const res = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${env.twitter.bearerToken}` },
    });

    if (!res.ok) {
      console.error('Twitter API error:', await res.text());
      return [];
    }

    const data = await res.json();
    return data.data ?? [];
  }
}

export const twitterClient = new TwitterClient();
