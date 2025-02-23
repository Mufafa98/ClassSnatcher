import * as cheerio from 'cheerio';
import axios from 'axios';
import https from 'node:https';

const httpsAgent = new https.Agent({ rejectUnauthorized: false });

export async function scrapeWebPage(url) {
    try {
        const { data } = await axios.get(url, { httpsAgent });
        const webPage = cheerio.load(data);
        return webPage;
    } catch (error) {
        console.error('Error fetching the webpage:', error);
    }
}
