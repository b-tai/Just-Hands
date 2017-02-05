"use strict";

var Cylon = require("cylon");

function numExtendedFingers(hand) {
  var extendedFingers = 0;
    for(var f = 0; f < hand.fingers.length; f++){
        var finger = hand.fingers[f];
        if(finger.extended) extendedFingers++;
  }
  return extendedFingers;
}

var threshold = 1000;
Cylon.robot({
  connections: {
    leap: { adaptor: "leapmotion" },
    arduino: { adaptor: "firmata", port: "/dev/cu.usbmodem411" }
  },

  devices: {
    led: { driver: "led", pin: 9, connection: "arduino" },
    led_2: { driver: "led", pin: 6, connection: "arduino" },
    leapmotion: {driver: "leapmotion", connection: "leap"}
  },

  work: function(my) {
    my.leapmotion.on("hand", function(hand) {
      var vel = hand.palmVelocity;
      var arg = absolute_argmax(vel);
      if (Math.abs(vel[arg]) > threshold) {
        if (arg == 1 && vel[arg] < 0) { // y, down
          my.led.turnOn();
        } else if (arg == 1 && vel[arg] > 0) { // y, up
          my.led.turnOff();
        } else if (arg == 0 && vel[arg] > 0){ // x, right
          my.led_2.turnOn();
        } else if (arg == 0 && vel[arg] < 0 ){ // x, left
          my.led_2.turnOff();
        } else if (arg == 2 && vel[arg] < 0){ // z, in
          my.led.turnOn();
          my.led_2.turnOn();
        } else if (arg == 2 && vel[arg] > 0 ){ // z, out
          my.led.turnOff();
          my.led_2.turnOff();
        }
      }

    });
  }
}).start();

function absolute_argmax(arr) {
  var currMax = 0;
  for (var i = 1; i < arr.length; i++) {
    if (Math.abs(arr[currMax]) < Math.abs(arr[i])) {
      currMax = i;
    }
  }
  return currMax;
}
