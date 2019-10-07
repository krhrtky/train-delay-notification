'use strict'
const { get } = require('axios')
const { JSDOM } = require('jsdom')

const getDocument = async url => {
  const { data } = await get(url);
  const {
    window: { document },
  } = new JSDOM(data);
  return document
};

module.exports = async () => {
  const document = await getDocument(
    'https://transit.yahoo.co.jp/traininfo/area/4/'
  )
  const delays = document.querySelectorAll('.elmTblLstLine.trouble table a');

  return delays.length === 0
    ? []
    : await Promise.all(
          Array.from(delays).map(async delayAnchor => {
              const document = await getDocument(delayAnchor.href);
              const line = document.querySelectorAll('.title')[0].innerHTML;
              const description = document
                  .querySelectorAll('#main .trouble p')[0]
                  .innerHTML.replace(/<\/?span>/g, '');
              return {
                  line,
                  description,
              };
          })
      );
};

