import fetch from "node-fetch";
import * as cheerio from "cheerio";
import * as fs from "fs";

let count = 0;

const crawl = async ({ url }) => {
  const response = await fetch(url);
  const html = await response.text();
  let $ = cheerio.load(html);

  $('article').each((_i, article) => {
    let title = $(article).find('.article-title a').attr('title');
    let link = 'http://ppgedam.propesp.ufpa.br' + $(article).find('.article-title a').attr('href');
    let date = $(article).find('time').text().trim();
    let intro = $(article).find('.article-intro p').text().trim();

    let markdown = `${title}\n###Data: ${date}\n###Link: [${link}](${link})\n\n${intro}\n\n\n`;
    let csv = `"${title}","${date}","${link}","${intro}"\n`;

    fs.appendFile('output.md', markdown, (err) => {
      if (err) console.log(err);
    });

    fs.appendFile('output.csv', csv, (err) => {
      if (err) console.log(err);
    });

    count++;
  });
}

const init = async () => {
  for (let i = 18; i <= 138; i = i + 6) {
    await crawl({
      url: `http://ppgedam.propesp.ufpa.br/index.php?start=${i}`
    });
    console.log(count);
  }
}

init();