import fetch from "node-fetch";
import * as cheerio from "cheerio";
import * as fs from "fs";

let count = 0;

const crawl = async ({ url }) => {
  const response = await fetch(url);
  const html = await response.text();

  let $ = cheerio.load(html);

  // cria o arquivo markdown
  fs.writeFile('output.md', '', (err) => {
    if (err) console.log(err);
  });

  // cria e escreve a primeira linha do arquivo csv
  fs.writeFile('output.csv', 'Título,Data,Link,Texto introdução\n', (err) => {
    if (err) console.log(err);
  });

  // coleta os artigos da página
  $('article').each((_i, article) => {
    let title = $(article).find('.article-title a').attr('title');
    let link = 'http://ppgedam.propesp.ufpa.br' + $(article).find('.article-title a').attr('href');
    let date = $(article).find('time').text().trim();
    let intro = $(article).find('.article-intro p').text().trim();

    let markdown = `### ${title}\n\n**Data:** ${date}\n\n**Link:** [${link}](${link})\n\n${intro}\n\n\n\n`;
    let csv = `'${title}',${date},${link},'${intro}'\n`;

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

  // // busca em uma única página
  // await crawl({
  //   url: `http://ppgedam.propesp.ufpa.br/index.php?start=6`
  // });
  // console.log(count);

  // busca em um intervalo de páginas
  for (let i = 0; i <= 18; i += 6) {
    await crawl({
      url: `http://ppgedam.propesp.ufpa.br/index.php?start=${i}`
    });
    console.log(count);
  }
}

init();