// for clickable images showing on gallery page
const images = [
  "../img/untitled-7-2.jpeg",
  "../img/20160808-P8080080-2.jpeg",

  "../img/WinterSigDrink-179.jpeg",
  "../img/Winter2016SigDrinks-73.jpeg",

  "../img/Winter2016SigDrinks-49.jpeg",
  "../img/untitled-7-2.jpeg"
];

var i = 0;

// places an image where we want it to be placed
function placeImage(x, y) {
  const nextImage = images[i];

  // adds an image element to page
  // makes a tag in javascript and adds to page
  var image = document.querySelector(".clickable");
  // add image to document
  image.appendChild(document.createElement("img"));

  image.setAttribute("src", nextImage);
  image.style.left = x + "px";
  image.style.top = y + "px";


  i = i + 1;

  if (i >= images.length) {
    i = 0;
  }
}

// places image on page in specified place
placeImage(500, 400);
placeImage(600, 300);
placeImage(400, 500);

// works only in browsers 
document.addEventListener("click", function(event) {
  // stops default thing from happening
  event.preventDefault();
//   puts the image wherever the user clicks using pageX and pageY 
  placeImage(event.pageX, event.pageY);

})

// for mobile 
document.addEventListener("touchend", function(event) {
    event.preventDefault();
    placeImage(event.pageX, event.pageY)
})
