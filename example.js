var Nightmare = require('nightmare');
var vo = require('vo');
var xray = require('x-ray')();

vo(run)(function(err, result) {
    if (err) throw err;
    console.log(result);
});

function* run() {
    var nightmare = Nightmare(
      {
        show: true,
        openDevTools: true
      }),
        MAX_PAGE = 2,
        currentPage = 0,
        nextExists = true,
        links = [];

    yield nightmare
        .goto('http://ceramicindia.com/search')
        .wait(2000)
        .click('.ms-parent.ml-select .ms-drop li:nth-child(2) input[value="1"]')
        .wait(2000)
        .click('.ms-parent.chosen-select .ms-drop li:nth-child(3) input[value="46"]')
        .click('#btn_search')
        .wait(2000)

    nextExists = yield nightmare.visible('.next:nth-child(8) .light_blue_btn');

    while (nextExists && currentPage < MAX_PAGE) {
        links.push(yield nightmare
            .evaluate(function() {
                var linkArray = [];
                var links = document.querySelectorAll('#data_container .PR0');
                links = Array.prototype.map.call(links, function(query){
                  var data = {}
                  data =  {
                    name: query.querySelector('.cmp-list-ul li h4 a').innerHTML,
                    address: query.querySelector('.cmp-list-ul li:nth-child(2)').innerHTML.trim()
                  }
                  console.log(data);
                  if(query.querySelector('.cmp-list-ul li:nth-child(4)')){
                    query.querySelector('.cmp-list-ul li:nth-child(3)').removeChild('.cmp-list-ul i');
                    data["landline"] = query.querySelector('.cmp-list-ul li:nth-child(3)').innerHTML.trim()
                    query.querySelector('.cmp-list-ul li:nth-child(4)').removeChild('.cmp-list-ul i');
                    data["mobile"] = query.querySelector('.cmp-list-ul li:nth-child(4)').innerHTML.trim()
                  }
                  else {
                    query.querySelector('.cmp-list-ul li:nth-child(3)').removeChild('.cmp-list-ul i');
                    data["mobile"] = query.querySelector('.cmp-list-ul li:nth-child(3)').innerHTML.trim()
                  }
                  console.log(data);
                  return data;
                });
                return links;
            }));

        yield nightmare
            .click('.next:nth-child(8) .light_blue_btn')
            .wait(2000)

        currentPage++;
        nextExists = yield nightmare.visible('.next:nth-child(8) .light_blue_btn');
    }

    console.dir(links);
    yield nightmare.end();
    return links;
}
