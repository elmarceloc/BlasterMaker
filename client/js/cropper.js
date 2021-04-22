const xElement = document.querySelector("#x");
const yElement = document.querySelector("#y");
const wElement = document.querySelector("#width");
const hElement = document.querySelector("#height");
const sElement = document.querySelector("#scale");

var canvas2 = document.createElement("canvas");
var canvas3 = document.createElement("canvas");

canvas3.id = 'previewCrop'

var ctx = canvas2.getContext("2d");
var ctx1 = canvas3.getContext("2d");





colors = [
    { "rgb": [0, 0, 0], "id": "C-02", "name": "Black" },
    { "rgb": [155, 155, 155], "id": "C-33", "name": "Gray 2" },
    { "rgb": [92, 71, 56], "id": "C-32", "name": "Brown" },
    { "rgb": [123, 77, 53], "id": "C-31", "name": "Light Brown" },
    { "rgb": [255, 255, 255], "id": "C-01", "name": "White" },
    { "rgb": [0, 124, 88], "id": "C-15", "name": "Green Tea" },
    { "rgb": [135, 216, 57], "id": "C-13", "name": "Pastel Green" },
    { "rgb": [20, 123, 209], "id": "C-37", "name": "True Blue" },
    { "rgb": [65, 182, 230], "id": "C-19", "name": "Baby Blue" },
    { "rgb": [74, 31, 135], "id": "C-52", "name": "Royal Purple" },
    { "rgb": [252, 191, 169], "id": "C-22", "name": "Bubble Gum" },
    { "rgb": [250, 224, 83], "id": "C-42", "name": "Sandstone" },
    { "rgb": [219, 33, 82], "id": "C-09", "name": "Magneta" },
    { "rgb": [255, 103, 31], "id": "C-17", "name": "Orange" },
    { "rgb": [186, 12, 47], "id": "C-06", "name": "Red" }
  ]
  

var panX = 0; // scaled image pan
var panY = 0;

function updateScale(img, width) {

    
    var w = img.width

    var h = img.height
    
    
    ctx.canvas.width = w;
    ctx.canvas.height = h;
    
    ctx.drawImage(img, 0, 0);

    height = (ctx.canvas.height * width) / ctx.canvas.width;
    


    var ang = 0;
    var wd = ctx.canvas.width; // destination image
    var hd = ctx.canvas.height;
    
    ctx1.canvas.width  = width;
    ctx1.canvas.height = height;
    
    var src = ctx.getImageData(0, 0, w, h);


    var data = new Uint32Array(src.data.buffer); // source
    var dest = ctx1.createImageData(wd, hd);
    var zoomData = new Uint32Array(dest.data.buffer); // destination
    var xdx = Math.cos(ang) * wd / width; // xAxis vector x
    var xdy = Math.sin(ang) * hd / width; // xAxis vector y
    var ind = 0;
    var xx, yy;

    for(var y = 0; y < hd; y ++){
        for(var x = 0; x < wd; x ++){
            // transform point
            xx = x * xdx - y * xdy + panX + xdy;
            yy = x * xdy + y * xdx + panY + xdx;


            // is the lookup pixel in bounds
            if(xx >= 0 && xx < w && yy >= 0 && yy < h){                
                // use the nearest pixel to set the new pixel
                zoomData[ind++] = data[(xx | 0) + (yy | 0) * w]; // set the pixel
            }else{
                zoomData[ind++] = 0; // pixels outside bound are transparent
            }
        }
    }



    for (var i = 0; i < dest.data.length; i+=4) {
        // get color of pixel
        var r = dest.data[i]; // Red
        var g = dest.data[i+1]; // Green
        var b = dest.data[i+2]; // Blue
        var a = dest.data[i+3]; // Alpha
              
        min = 9999999;
        idMin = 0;
        
        for(let j in colors){
          rgb = colors[j].rgb;
          dis = distanceRGB(rgb[0], rgb[1], rgb[2], r, g, b, 2)

          if(dis < min){
            min = dis
            idMin = j
          }
        }
        
        if (a != 0){
            dest.data[i] = colors[parseInt(idMin)].rgb[0]
            dest.data[i+1] = colors[parseInt(idMin)].rgb[1]
            dest.data[i+2] = colors[parseInt(idMin)].rgb[2]
        }


       /* setBeadColor(
          (i / 4) % wd,
          Math.floor(i / 4 / wd),
          parseInt(idMin) + 1
        );*/
      }


    ctx1.putImageData(dest, 0, 0);


   // document.getElementById("previewContainer").appendChild(canvas2); // Append <li> to <ul> with id="myList"
    document.getElementById("previewContainer").appendChild(canvas3); // Append <li> to <ul> with id="myList"

    var $image = $('#previewCrop');

 /*   $image.cropper({
    //  aspectRatio: 16 / 9,
      crop: function(event) {
        console.log(event.detail.width);
        console.log(event.detail.height);
        console.log(event.detail.rotate);
        console.log(event.detail.scaleX);
        console.log(event.detail.scaleY);

        document.querySelector("#x").value = Math.floor(event.detail.x)
        document.querySelector("#y").value = Math.floor(event.detail.y)

        document.querySelector("#width").value = Math.floor(event.detail.width)
        document.querySelector("#height").value = Math.floor(event.detail.height)


      }
    });*/

    // Get the Cropper.js instance after initialized
    var cropper = $image.data('cropper');



  };


xElement.addEventListener("change", (event) => {
  const x = document.querySelector("#x").value;

    panX = x*1

});

yElement.addEventListener("change", (event) => {
  const y = document.querySelector("#y").value;

  panX = y*1

});

wElement.addEventListener("change", (event) => {
  const w = document.querySelector("#width").value;
});

hElement.addEventListener("change", (event) => {
  const h = document.querySelector("#height").value;
});

sElement.addEventListener("change", (event) => {
  const s = document.querySelector("#scale").value;

  updateScale(img, s)

});

document.getElementById("closecropper").onclick = function () {
  ipc.send("closecropper");
};

document.getElementById("closecropper").style.top = 20 + "px";


function updateTextInput(val) {
  document.getElementById("showrange").innerHTML = val;
}