// lib/youtube.js
const YOUTUBE_API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
const YOUTUBE_CHANNEL_ID = process.env.NEXT_PUBLIC_YOUTUBE_CHANNEL_ID;

export async function getYouTubeChannelStats() {
  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=statistics,snippet&id=${YOUTUBE_CHANNEL_ID}&key=${YOUTUBE_API_KEY}`
    );
    
    const data = await response.json();
    
    if (data.items && data.items.length > 0) {
      const channel = data.items[0];
      return {
        subscribers: channel.statistics.subscriberCount,
        totalVideos: channel.statistics.videoCount,
        channelName: channel.snippet.title,
        thumbnail: channel.snippet.thumbnails.medium.url
      };
    }
    
    return null;
  } catch (error) {
    console.error('YouTube API Error:', error);
    return null;
  }
}

export async function getYouTubeLiveStreams() {
  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${YOUTUBE_CHANNEL_ID}&eventType=live&type=video&key=${YOUTUBE_API_KEY}`
    );
    
    const data = await response.json();
    
    if (data.items && data.items.length > 0) {
      return data.items.map(item => ({
        id: item.id.videoId,
        title: item.snippet.title,
        thumbnail: item.snippet.thumbnails.medium.url,
        streamer: item.snippet.channelTitle,
        url: `https://youtube.com/watch?v=${item.id.videoId}`,
        isLive: true
      }));
    }
    
    return [];
  } catch (error) {
    console.error('YouTube Live Streams Error:', error);
    return [];
  }
}