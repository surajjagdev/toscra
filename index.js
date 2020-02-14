const rp = require('request-promise');
const cheerio = require('cheerio');
const fs = require("fs");
//update these
const pageLimit = 10;
let currentCount = 1;
//
const baseURL = 'https://www.yellowpages.ca';
const searchURL = `/search/si/${currentCount}/plumber/Toronto+ON`;

const outputFile = 'data.json';
let parsedResults = [];
//function 
const getCompanies = async () => {
  const html = await rp(baseURL + searchURL);
  const businessMap = cheerio('a.listing__name--link', html).map(async (i, e) => {
  const name = e.children[0].data;
  /*const addresses = cheerio('span.listing__address--full', html).map((ind,eve)=>{
    if(eve.type == 'tag' && eve.name == 'span'){
    
    }
  });*/
  return{
    name
  };
    /*return {
      emailAddress,
      link,
      name,
      phone,
    }*/
  }).get();
  return Promise.all(businessMap);
};
getCompanies()
  .then(result => {
    //result is array of objects, just spread into array
    parsedResults = [...result];
    exportResults(parsedResults);
  })
  .then(() => console.log('scrapped done.'));

  const exportResults = (res) => {
  fs.writeFile(outputFile, JSON.stringify(res, null, 4), (err) => {
    if (err) {
      console.log(err)
    }
  })
}