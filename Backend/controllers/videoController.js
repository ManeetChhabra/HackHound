import axios from "axios";

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const domains = [
  "Web Development",
  "Digital Marketing",
  "Data Science",
  "Cybersecurity",
  "UI UX Design"
];

export const fetchVideos = async (req, res) => {
  try {
    const videoPromises = domains.map(async (domain) => {
      const response = await axios.get(
        `https://www.googleapis.com/youtube/v3/search`,
        {
          params: {
            part: "snippet",
            q: `${domain} tutorial for beginners`,
            type: "video",
            maxResults: 1,
            order: "viewCount",
            videoDuration: "medium",
            key: YOUTUBE_API_KEY,
          },
        }
      );

      if (response.data.items.length > 0) {
        const video = response.data.items[0];
        return {
          domain,
          title: video.snippet.title,
          videoId: video.id.videoId,
          thumbnail: video.snippet.thumbnails.high.url,
        };
      }
      return null;
    });

    const videos = await Promise.all(videoPromises);
    res.status(200).json(videos.filter(video => video !== null));
  } catch (error) {
    console.error("Error fetching videos:", error);
    res.status(500).json({ error: "Failed to fetch videos" });
  }
};
