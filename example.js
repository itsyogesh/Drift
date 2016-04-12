var Nightmare = require('nightmare');
var vo = require('vo');
var xray = require('x-ray')();
var csv = require('fast-csv');
var fs = require('fs');

var dataStream = csv.createWriteStream({headers: true}),
    writeableStream = fs.createWriteStream("data.csv");

writeableStream.on("finish", function(){
  console.log("done");
});

dataStream.pipe(writeableStream);

vo(run)(function(err, result) {
    if (err) throw err;
    console.log(result);
    result = result[0].map(function(data){
      console.log("data", data);
      console.log(data.phone);
      data.phone = data.phone.replace(/<i.*i>/, "").trim();
      if(data.mobile){
        data.mobile = data.mobile.replace(/<i.*i>/, "").trim()
      }
      dataStream.write({
        "Name": data.name,
        "Address": data.address,
        "Phone": data.phone,
        "Phone2": data.mobile ? data.mobile: '-'
      })
      return data;
    })
    console.log(result);
    dataStream.end();
});

function* run() {
    var nightmare = Nightmare(
      {
        show: true
      }),
        MAX_PAGE = 100,
        currentPage = 0,
        nextExists = true,
        links = [],
        consoleObj = console;

    yield nightmare
        .goto('http://ceramicindia.com/search')
        .wait(2000)
        .click('.ms-parent.ml-select .ms-drop li:nth-child(2) input[value="1"]')
        .wait(2000)
        .click('.ms-parent.chosen-select .ms-drop li:nth-child(3) input[value="46"]')
        .click('#btn_search')
        .wait(4000)

        if(currentPage < 1){
          nextExists = yield nightmare.visible('.next:nth-child(8) .light_blue_btn');
        }
        else {
          nextExists = yield nightmare.visible('.next:nth-child(10) .light_blue_btn');
        }

    while (nextExists && currentPage < MAX_PAGE) {
        links.push(yield nightmare
            .evaluate(function() {
                var linkArray = [];
                var links = [];
                links = document.querySelectorAll('#data_container .PR0');
                links = Array.prototype.map.call(links, function(query){
                  //query.querySelector('.cmp-list-ul li:nth-child(3)').removeChild('.cmp-list-ul i');
                  var data =  {
                    name: query.querySelector('.cmp-list-ul li h4 a').innerHTML,
                    address: query.querySelector('.cmp-list-ul li:nth-child(2)').innerHTML.trim(),
                    phone: query.querySelector('.cmp-list-ul li:nth-child(3)').innerHTML.trim()

                  }
                  if(query.querySelector('.cmp-list-ul li:nth-child(4)')){
                    data.mobile = query.querySelector('.cmp-list-ul li:nth-child(4)').innerHTML.trim()
                  }
                  return data;
                });
                return links;
            }));
            console.log(links);

        console.log("next page");
        if(currentPage < 1){
          yield nightmare
              .click('.next:nth-child(8) .light_blue_btn')
              .wait(2000)
        }
        else {
          yield nightmare
              .click('.next:nth-child(10) .light_blue_btn')
              .wait(2000)
        }

        currentPage++;
        console.log(currentPage);
        if(currentPage < 1){
          nextExists = yield nightmare.visible('.next:nth-child(8) .light_blue_btn');
        }
        else {
          nextExists = yield nightmare.visible('.next:nth-child(10) .light_blue_btn');
        }
    }

    yield nightmare.end();
    return links;
}
