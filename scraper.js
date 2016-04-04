var init = require('./core/init');
var justdial = require('./platforms/justdial.json')

var options = {
  nightmare: {
    show: true
  },
  page_type: 'single',
  page_options:{
    url: process.argv[2],
    selectors: justdial.page_item_selectors,
    wait_selector: justdial.wait_selector,
  }
}

init(options);
