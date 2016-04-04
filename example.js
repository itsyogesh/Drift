var Nightmare = require('nightmare');
var vo = require('vo');

vo(run)(function(err, result) {
    if (err) throw err;
});

function* run() {
    var nightmare = Nightmare({ show: true }),
        MAX_PAGE = 2,
        currentPage = 0,
        nextExists = true,
        links = [];

    yield nightmare
        .goto('http://www.google.com')
        .wait('input[title="Search"]')
        .click('input[title="Search"]')
        .type('input[title="Search"]', 'Anequim Project')
        .click('input[name="btnK"]')
        .wait(2000)

    nextExists = yield nightmare.visible('#pnnext');

    while (nextExists && currentPage < MAX_PAGE) {
        links.push(yield nightmare
            .evaluate(function() {
                var linkArray = [];
                var links = document.querySelectorAll('h3.r a');
                return links[0].href;
            }));

        yield nightmare
            .click('#pnnext')
            .wait(2000)

        currentPage++;
        nextExists = yield nightmare.visible('#pnnext');
    }

    console.dir(links);
    yield nightmare.end();
}
