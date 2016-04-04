var Nightmare = require('nightmare');

var nightmare = Nightmare({show: true})
nightmare.goto('https://google.com')
  .wait('input[title="Search"]')
  .evaluate(function(){
    console.log(document);
    return document.querySelector('body').innerHTML
  })
  .end()
  .then(function(result){
    console.log(result);
  })
