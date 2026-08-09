import { gotScraping } from 'got-scraping';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const targetUrl = "https://draw.ar-lottery01.com/WinGo/WinGo_1M/GetHistoryIssuePage.json?pageNo=1&pageSize=15&ts=" + Date.now();

  try {
    const response = await gotScraping({
      url: targetUrl,
      headerGeneratorOptions: {
        browsers: [{ name: 'chrome', minVersion: 110 }],
        devices: ['mobile'],
        operatingSystems: ['android']
      },
      headers: {
        'referer': 'https://draw.ar-lottery01.com/',
        'origin': 'https://draw.ar-lottery01.com',
        'accept-language': 'en-US,en;q=0.9'
      },
      retry: {
        limit: 3
      }
    });

    if (response.statusCode === 200) {
      const data = JSON.parse(response.body);
      return res.status(200).json(data);
    } else {
      return res.status(response.statusCode).json({ error: "Failed with status code " + response.statusCode });
    }

  } catch (error) {
    return res.status(500).json({ 
      error: "Scraper Error", 
      details: error.message 
    });
  }
}
