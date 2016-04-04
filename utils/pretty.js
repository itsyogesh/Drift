var _ = require('lodash');

function pretty(object, options){
  if(!object instanceof Array){
    _.forIn(object, function(value, key){
      if(value instanceof Array || typeof value === 'object'){
        pretty(value, options);
      }
      else{
        object[key] = _.trim(value)
      }
    })
  }
}
