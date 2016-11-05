const cardTemplate = require('./github-card.tpl.html');

fetch('https://api.github.com/users/maxnetish', {
    method: 'GET',
    body: null,
    headers: {},
    credentials: 'omit' // or same-origin or include
})
    .then(function (response) {
        console.info('response: ', response);
        return response.json();
    })
    .then(function (response) {
        console.info('response.json(): ', response);

        let cardHtml = cardTemplate(response);
        let elm = document.getElementById('github-card');
        elm.innerHTML = cardHtml;

        return response;
    })
    .catch(function (err) {
        console.warn(err);
    });