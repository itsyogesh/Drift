var Nightmare = require('nightmare');
var parser = require('./core/parser');

var justdial = require('./platforms/justdial.json')
var nightmare = Nightmare(
  {
    show: true,
    alwaysOnTop: false
  });

function* test(){
  var data = yield nightmare.goto('http://www.justdial.com/Delhi-NCR/dance-schools')
    .wait('.rsl cntanr')
    .evaluate(function(){
      return document.querySelector('body').innerHTML
    })
    .end()
    .then(function(document){
        console.log(document);
        var result = parser.list(document,
          {
            list_selector: justdial.list_selector,
            list_items: justdial.list_items
          });
          return result;
    })
    data.then(function(data){
      console.log(data);
    })
}

test().next()
