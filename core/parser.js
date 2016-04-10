var xray = require('x-ray')();
var regex = require('../utils/regex');

var parser = {
  singlePage: function(document, selectors){
    console.log("selectors", selectors);
    console.log(regex.url.test(document));
    var result = new Promise(function(resolve, reject){
        xray(document, selectors)(function(err, result){
            if(err) reject(err);
            resolve(result);
        })
    });
    return result;
  },
  list: function(document, selector){
    var result = new Promise(function(resolve, reject){
      xray(document, selector.list_selector, selector.list_items)(function(err, result){
        if(err) reject(err);
        resolve(result);
      })
    });

    return result;
  }
}

module.exports = parser;
