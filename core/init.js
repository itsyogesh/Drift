var Nightmare = require('nightmare');
var parser = require('./parser');
var vo = require('vo');

var nightmare;

function init(options, cb) {
  nightmare = Nightmare(options.nightmare);
  var type = options.page_type;
  if(type === 'single'){
    //console.log(run.single.next())

    var results = run.single(options.page_options)
    var a = results.next();
    a.value.then(function(data){

      var details = parser.singlePage(data, options.page_options.selectors);
      details.then(function(results){
        console.log(results);
      })
    })
  }
}

var run = {
  single: function* (options) {
    console.log('yield nightmare goto')
    console.log(options.url);
    var results = yield nightmare
      .goto(options.url)
      .wait(options.wait_selector)
      .evaluate(function(){
        return document.querySelector('body').innerHTML
      })
      .end()
      .then(function(results){

        //var data = parser.singlePage(results, options.selectors);

        return results;
      })

      return results;
  },

  list: function* (options) {

  }

}
module.exports = init;
