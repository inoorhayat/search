require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();
const port = 5000;
const cors = require('cors');

app.use(cors());


app.use(express.json());

async function fetchYouTubeVideos(query) {
  const apiKey = process.env.YOUTUBE_API_KEY;
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q=${query}&type=video&key=${apiKey}`;

  try {
    const response = await axios.get(url);
    return response.data.items.map(video => {
      const videoId = video.id.videoId;
      return {
        title: video.snippet.title,
        description: video.snippet.description,
        url: `https://www.youtube.com/watch?v=${videoId}`,
        platform: 'YouTube',
        type: 'video',
      };
    });
  } catch (error) {
    console.error('YouTube API Error:', error);
    return [];
  }
}

async function fetchArticlesAndBlogs(query) {
  const apiKey = process.env.BING_API_KEY;
  const url = `https://api.bing.microsoft.com/v7.0/search?q=${query}&count=10`;

  try {
    const response = await axios.get(url, {
      headers: { 'Ocp-Apim-Subscription-Key': apiKey },
    });
    return response.data.webPages.value.map(page => ({
      title: page.name,
      description: page.snippet,
      url: page.url,
      platform: 'Bing',
      type: 'article',
    }));
  } catch (error) {
    console.error('Bing API Error:', error);
    return [];
  }
}

async function fetchAcademicPapers(query) {
  return [
    {
      title: 'A study on AI in education',
      description: 'An academic paper discussing the use of AI in educational platforms.',
      url: 'https://scholar.google.com/ai-paper-example',
      platform: 'Google Scholar',
      type: 'academic',
    }
  ];
}

async function searchAndRank(query) {
  const [videos, articles, papers] = await Promise.all([
    fetchYouTubeVideos(query),
    fetchArticlesAndBlogs(query),
    fetchAcademicPapers(query),
  ]);

  const combinedResults = [...videos, ...articles, ...papers];

  return combinedResults.sort((a, b) => {
    return a.type === 'video' ? -1 : 1;
  });
}

app.get('/search', async (req, res) => {
  const query = req.query.q;
  const results = await searchAndRank(query);
  res.json(results);
});

app.listen(port, () => {
  console.log(`Backend server running at http://localhost:${port}`);
});
