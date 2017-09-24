const config = require('./../config.json');
const player = require('play-sound')();
const say = require('say');

module.exports = {
  soundAlarm,
  sayTicker
}

let canSoundAlarm = true;
const canSoundAlarmTimeout = config.defaults.alarmInterval || 60000;

let canSayTicker = true;
const canSayTickerTimeout = parseFloat(process.env.SAY_INTERVAL) || config.defaults.sayInterval;
if(!canSayTickerTimeout) {
  canSayTicker = false;
}

function sayTicker(ticker) {
  if(canSayTicker) {
    say.speak(parseFloat(ticker.price).toFixed(2), 'Victoria', 1.25);
    canSayTicker = false;
    setTimeout( () => {
      canSayTicker = true;
    }, canSayTickerTimeout);
  }
}

function soundAlarm() {
  if(canSoundAlarm) {
    player.play('./audio/meep.mp3', (err) => {
      if (err) throw err
    })
    canSoundAlarm = false;
    setTimeout( () => {
      canSoundAlarm = true;
    }, canSoundAlarmTimeout);
  }
}
