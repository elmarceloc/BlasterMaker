/*const xElement = document.querySelector("#x");
const yElement = document.querySelector("#y");*/
//const wElement = document.querySelector("#width");
//const hElement = document.querySelector("#height");
const sElement = document.querySelector("#scale");
const sizeElement = document.querySelector("#size");

var canvas2 = document.createElement("canvas");
var canvas3 = document.createElement("canvas");

canvas3.id = 'previewCrop'

var oldCtx = canvas2.getContext("2d");
var newCtx = canvas3.getContext("2d");

document.getElementById("previewContainer").appendChild(canvas3);

var app = new Vue({
  el: '#app',
  data: {
    colors: []
  },
  methods: {
    toggleColorState: function(event, index){
      console.log('color '+index+' toggled')
      this.colors[index].enabled = !colors[index].enabled

      event.target.classList.toggle('colordisabled')

      //TODO: cambiar el color de la imagen a la paleta nueva
    }
  }
})

app.colors.forEach(color => {
  color.enabled = false
});

//colors = []

//palettes.five.map(v => colors.push(totalColors[v]))
palettes.five.map(v => app.colors.push(totalColors[v]))

var panX = 0; // scaled image pan
var panY = 0;

var imageData;

var image;

 
function  (img, wd, hd){
  oldCtx.canvas.width = wd;
  oldCtx.canvas.height = hd;

  oldCtx.drawImage(img, 0, 0);

  imageData = oldCtx.getImageData(0, 0, wd, hd);

  image = img

  imageWidth = wd
  imageHeight = hd
  
  console.log(app.colors)

  for (var i = 0; i < imageData.data.length; i+=4) {
    // get color of pixel
    var r = imageData.data[i]; // Red
    var g = imageData.data[i+1]; // Green
    var b = imageData.data[i+2]; // Blue
    var a = imageData.data[i+3]; // Alpha
          
    var min = 9999999;
    var idMin = 0;

    for(let j in app.colors){
      let rgb = app.colors[j].rgb;
      let dis = distanceRGB(rgb[0], rgb[1], rgb[2], r, g, b, 2)

      if(dis < min){
        min = dis
        idMin = j
        app.colors[j].enabled = true;
      }
    }
    
    if (a != 0){

      imageData.data[i] = app.colors[parseInt(idMin)].rgb[0]
      imageData.data[i+1] = app.colors[parseInt(idMin)].rgb[1]
      imageData.data[i+2] = app.colors[parseInt(idMin)].rgb[2]
    }

  }

  oldCtx.putImageData(imageData, 0, 0);

}
// updates 
function updatePreview(img, width, angle = 0) {
    var height = (oldCtx.canvas.height * width) / oldCtx.canvas.width;

    var ang = angle;

    newCtx.canvas.width  = width;
    newCtx.canvas.height = height;
    
    var src = oldCtx.getImageData(0, 0, oldCtx.canvas.width, oldCtx.canvas.height);
  
   // console.log(imageData.data)

    var data = new Uint32Array(src.data.buffer); // source
    var dest = newCtx.createImageData(width, height);
    var zoomData = new Uint32Array(dest.data.buffer); // destination
    var xdx = Math.cos(ang) * oldCtx.canvas.width / width; // xAxis vector x
    var xdy = Math.sin(ang) * oldCtx.canvas.height / width; // xAxis vector y
    var ind = 0;
    var xx, yy;

    for(var y = 0; y < height; y ++){
        for(var x = 0; x < width; x ++){
            // transform point
            xx = x * xdx - y * xdy + panX + xdy;
            yy = x * xdy + y * xdx + panY + xdx;

            // is the lookup pixel in bounds
            if(xx >= 0 && xx < oldCtx.canvas.width && yy >= 0 && yy < oldCtx.canvas.height){                
                // use the nearest pixel to set the new pixel
                zoomData[ind++] = data[(xx | 0) + (yy | 0) * oldCtx.canvas.width]; // set the pixel
            }else{
                zoomData[ind++] = 0; // pixels outside bound are transparent
            }
        }
    }
   // console.log(dest)
    newCtx.putImageData(dest, 0, 0);

    //document.getElementById("previewContainer").appendChild(canvas2);

    document.querySelector("#loading-container").style.visibility = 'hidden';


/*    var $image = $('#previewCrop');

    $image.cropper({
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
    })

    var cropper = $image.data('cropper');
;*/


  };


/*xElement.addEventListener("change", (event) => {
  const x = document.querySelector("#x").value;

    panX = x*1

});

yElement.addEventListener("change", (event) => {
  const y = document.querySelector("#y").value;

  panX = y*1

});*/
/*wElement.addEventListener("change", (event) => {
  const w = document.querySelector("#width").value;

});

hElement.addEventListener("change", (event) => {
  const h = document.querySelector("#height").value;

});*/

sElement.addEventListener("change", (event) => {
  document.querySelector("#loading-container").style.visibility = 'visible';

  const s = document.querySelector("#scale").value;
  
  document.querySelector("#showrange").value = s;
  
  updatePreview(img, s)

});


var oldSize;

for (let el of document.querySelectorAll('#palete'))
el.addEventListener('change', () => {

   document.querySelector("#loading-container").style.visibility = 'visible';

   var size = document.querySelector('input[name=sizeBeads]:checked', '#myform').value

   var kit = $('input[name=kit]:checked', '#myform').val()

   var newSize = document.querySelector("#scale").value;

    console.log(app.colors, colors)



   setColorPalete(size, kit)

   app.colors = colors

   changePalette(image, imageWidth, imageHeight);
   
   updatePreview(img, newSize)


});


document.getElementById("closecropper").onclick = function () {
  ipc.send("closecropper");
};

document.getElementById("closecropper").style.top = 20 + "px";


function updateTextInput(val) {
  document.getElementById("showrange").innerHTML = val ;
}