var position; //will contain the position object
var myMap; //will contain the map
var zombieOrd=[]; //will contain all ZOMBIE objects
var zombieNumber = 10; //number of zombies
var canvas; //contains the canvas

//create an istance of map getting it from Leaflet provider
var mappa = new Mappa('MapboxGL',
'pk.eyJ1Ijoia2FuZWRhbW4iLCJhIjoiY2sydDVmZm5jMTRrZzNkcWJkeGIzczdkeSJ9.sR1OjqoQxXbnNOQYdKa8rQ');
//options of the map
var options = {
  lat: 0, //starting latitude
  lng: 0, //starting longitude
  zoom: 17, //starting zoom
  //link of the tileset used to render the map
  style: "mapbox://styles/kanedamn/ck31ymwrh1mg31cm70ty68nkz"
}
function preload() {
  //get the position of the device
  position = getCurrentPosition();
  //load the images
  zombieImg = loadImage("assets/zombie.png");
  youImg = loadImage("assets/you.png");
}

function setup() {
  canvas = createCanvas(windowWidth,windowHeight)
  //set latitude and longitude of the map to the position's attributes
  options.lat = position.latitude;
  options.lng = position.longitude;
  //create zombies
  for (var i = 0; i < zombieNumber; i++) {
    //set the zombie in a random point around the user position
    var direction = [-1,1] //used to chose the direction of the random placement
    //random lat and lng
    var distanceLat = round(random(direction))*random(0.0005,0.001);
    var distanceLng = round(random(direction))*random(0.0005,0.001);
    //create the zombie object (0.0000003 is the speed)
    var tempZombie= new Zombie(position.latitude+distanceLat, position.longitude+distanceLng, 0.0000003);
    //push the zombie in the ZombieOrd array
    zombieOrd.push(tempZombie);
  }

  //the map overlay the canvas
  myMap = mappa.tileMap(options);
  myMap.overlay(canvas);
  //refresh the position each second
  intervalCurrentPosition(showPosition, 1000);

}

function draw() {
  clear();

  //transform angular coordinates to X and Y coordinates
  var you = myMap.latLngToPixel(position.latitude, position.longitude);
  //set the size of the images according to the zoom of the map
  //in a non-linear way
  var size = myMap.zoom()*sq(myMap.zoom())*0.025;
  //display the user
  image(youImg, you.x, you.y, size, size);
  //move and display the zombies
  for (var i = 0; i < zombieOrd.length; i++) {
    var z = zombieOrd[i];
    //move the zombie towards the user
    z.moving(position.latitude, position.longitude)
    //display the zombie
    z.display(size);

  }

  //ZOMBIES ARE COMING text
  fill("red")
  textAlign(CENTER)
  textSize(80)
  textStyle(BOLD)
  text("ZOMBIES\nARE COMING!",width/2+random(-2,+2),100+random(-2,+2)) //fliker the text

}


//showPosition function refresh the user positions values
function showPosition() {
}


//ZOMBIE object
function Zombie(_lat,_lng,_speed) {
  this.lat = _lat; //latitude
  this.lng = _lng; //longitude
  this.speed = _speed //speed

  this.display = function(_size) {
    //convert from map coordinates to screen coordinates
    var tempZombie = myMap.latLngToPixel(this.lat, this.lng);
    image(zombieImg, tempZombie.x, tempZombie.y, _size, _size);
  }

  //move the zombie towards a target
  //using the target map coordinates
  this.moving = function(_targetLat, _targetLng) {
    //calculate the distance from the zombie and the target LATITUDE
    var deltaLat = _targetLat - this.lat;
    //set the latitude position using the direction and the speed
    if (deltaLat > 0) {
      this.lat = this.lat + this.speed;
    }else if (deltaLat < 0) {
      this.lat = this.lat - this.speed;
    }
    //calculate the distance from the zombie and the target LONGITUDE
    var deltaLng = _targetLng - this.lng;
    //set the longitude position using the direction and the speed
    if (deltaLng > 0) {
      this.lng = this.lng + this.speed;
    }else if (deltaLng < 0) {
      this.lng = this.lng - this.speed;
    }
  }
}
