const targetId = 'footer-widget';
const itemsClassName = 'footer-widget-item';
const maxItemsLen = 64;
const template = require('./footer-widget.tpl.pug');
const timeBetweenElements = 500;

function updateWidget() {
    let rndNum = Math.random();
    let rndBitsArray = rndNum.toString(2).split('');
    let rndBitsArrayResult = [];
    let viewModel = {};
    for (let ind = rndBitsArray.length - 1; ind >= 0; ind--) {
        if (rndBitsArray[ind] === '1' || rndBitsArray[ind] === '0') {
            rndBitsArrayResult.push(rndBitsArray[ind]);
        }
        if (rndBitsArrayResult.length > maxItemsLen - 1) {
            break;
        }
    }

    viewModel.digs = rndBitsArrayResult.map(function (b) {
        return {
            code: 'dig-' + b
        };
    });

    let elm = document.getElementById(targetId);
    let items = document.querySelectorAll(`#${targetId} .${itemsClassName}`);

    if (items.length) {
        for (let ind = 0, itemsLen = items.length, digsLen = viewModel.digs.length; ind < itemsLen && ind < digsLen; ind++) {
            setTimeout(function () {
                items[ind].className = `${itemsClassName} ${viewModel.digs[ind].code}`;
            }, ind * timeBetweenElements);
        }
        return items.length;
    } else {
        let html = template(viewModel);
        elm.innerHTML = html;
        return viewModel.digs.length;
    }

}

let lenOfElements = updateWidget();
setInterval(updateWidget, (lenOfElements + 2) * timeBetweenElements);