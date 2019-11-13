// code for javaScript button on index.html page
function revealMessage() {
  var x = document.getElementById("hiddenMessage");
  if (x.style.display === "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
}

// function clockBattery() {
//   // calculating time using JS built-in Date object
//   var current = new Date();

//   // modulo makes a 12-hour clock for face
//   var hr = current.getHours() % 12
//   var min = current.getMinutes()
//   var sec = current.getSeconds()
//   var milli = current.getMilliseconds()

//   var clock = document.querySelector(".clock")
//   var hourHand = clock.querySelector(".hand.hour")
//   var minHand = clock.querySelector(".hand.minute")
//   var secHand = clock.querySelector(".hand.second")

//   // each hour is separated by 30 degrees
//   var hourRotation = 30 * hr + (0.5 * min);
//   // each minute is 
//   var minuteRotation = 6 * min + (0.1 * sec);
//   // six degrees in second, ms on top if we want smooth transition of secondhand
//   var secRotation = 6 * sec + 0.006 * milli;

//   hourHand.style.transform = 'rotate(' + hourRotation + 'deg)'
//   minHand.style.transform = "rotate(" + minuteRotation + "deg)"
//   secHand.style.transform = "rotate(" + secRotation + "deg)"

//   // runs every single frame
//   requestAnimationFrame(clockBattery);
// }

// // run the clock on load and during page, basically always
// clockBattery();
