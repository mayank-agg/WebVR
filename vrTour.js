// Get the URLs of the images.
// The resolution of the image must be the power of 2 (1024x512/2048x1024/4096x2048...), otherwise causes lag.
// add more images if you wish: img4 = "http://";
var img1 = "content/location1.jpg";
var img2 = "content/location2.jpg"
var img3 = "content/location3.jpg";

// Import the images into a list called imgs,
// imgs = [img1, img2, img3, img4, img5...];
var imgs = [img1, img2, img3];

// import marker image
var markURL_OFF = 'http://i.imgur.com/6Pae8y7.png';
var mark1 = VR.image(markURL_OFF);

// Import Hatch logo, which follows the camera
var logo = VR.camera.image('http://i.imgur.com/0coNQ7l.png');

// Create a aim point, which follows the camera. 
var focus = VR.camera.torus({radius:0.02,
               tube:0.01,
               color:"white",
               }).moveTo(0,0,-4);

// Create Visualization text, which follows the camera.
var visualization = VR.camera.text({font: '20pt sans-serif', text:"Visualization Group"});

// Create Next text.
var next = VR.text({font: '45pt sans-serif', text:"Next"});

// Other variables
var markHoverSize = 0.6;
var markDefaultSize = 0.5;

// variable that keeps track of the current image index 
var imageIndex = 0;

// variable that keeps the track of the marker animation.  
// curTime: current time. 
// endTime: the length of animation, curTime resets to 1 after 60; 
var curTime = 1; 
var endTime = 60;

// function to go to the panoramic image. 
var changeScene = function() {
  VR.vibrate(250);
  imageIndex = (imageIndex+1)%imgs.length;
  VR.panorama(imgs[imageIndex]);
}

// function to play aniamtion if the player look at the target
var lookAtTarget = function(target) {
  if (target === mark1)
    //console.log("start focusing!");
    Vr.animate( function(delta){ target.rotateY(Math.PI * delta / 2);});

}

// scale marker1, change the translation, and apply alpha channels to the texture;
mark1.setScale(markDefaultSize).moveTo(0,-1,0);
mark1.material.transparent=true;
mark1.material.alphaTest=0.5;

// move logo, and apply alpha channels to the textures;
logo.moveTo(3.5,-2,-4);
logo.material.transparent=true;
logo.material.alphaTest=0.5;

// move "next" under the logo, and apply alpha channels to the texture;
next.moveTo(0,-1.5,0);
next.material.transparent=true;
next.material.alphaTest=0.5;

// move "visualization", and apply alpha channels to the texture;
visualization.moveTo(-3.5,-2,-4);
visualization.material.transparent=true;
visualization.material.alphaTest=0.5;

// create the panoramic space and load the first 360 image. 
VR.panorama(imgs[0]);

// Tracking what the player looks at, if the target is mark1 play animation. 
VR.on('lookat', function(target){
    if (target === mark1)
      
      //console.log("focusing!");
      //mark1.material.color.setHSV(1,1,1);
      VR.animate(function(){
        curTime = (curTime+1)%endTime;
        target.setScale(markDefaultSize + curTime*(markHoverSize-markDefaultSize)/endTime);
        if (curTime == endTime-1) {changeScene();}
        });      
    });

// Tracking what the player looks away from, if the target is mark1 stop animation, reset timer.
VR.on('lookaway', function(target){
      if (target == mark1){
        //console.log("look away!");
        VR.end();
        curTime = 1;
        target.setScale(markDefaultSize);
      }
});
