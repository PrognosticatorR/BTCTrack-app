const electron = require('electron');
const path = require('path');
const axios = require('axios');
const ipc = electron.ipcRenderer;
const BrowserWindow = electron.remote.BrowserWindow;

const notifyBtn = document.getElementById('notifyBtn');
var price = document.querySelector('#price');
var targetPrice = document.getElementById('targetPrice');
let targetPriceVal;

const notification = {
    title: 'BTC Alert',
    body: 'BTC just beat your target price!',
    icon: path.join(__dirname, '../assets/images/BTC.png')
};

function getBTC() {
    axios.get('https://min-api.cryptocompare.com/data/pricemulti?fsyms=BTC&tsyms=INR')
        .then(res => {
            const cryptos = res.data.BTC.INR;
            price.innerHTML = `&#8377 ` + cryptos.toLocaleString('en');
            if (targetPrice.innerHTML != '' && targetPriceVal < cryptos) {
                let myNotification = new window.Notification(notification.title, notification);
            }
        });
}
getBTC();
setInterval(getBTC, 3000);


notifyBtn.addEventListener('click', function(event) {
    const modelPath = path.join('file://', __dirname, 'add.html');
    let win = new BrowserWindow({ frame: false, transparent: true, alwaysOnTop: true, width: 400, height: 200 });
    win.on('close', function() { win = null; });
    win.loadURL(modelPath);
    win.show();
});

ipc.on('targetPriceVal', function(event, arg) {
    targetPriceVal = Number(arg);
    targetPrice.innerHTML = `&#8377 ` + targetPriceVal.toLocaleString('en');
});