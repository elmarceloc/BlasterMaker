const xElement = document.querySelector("#x");
const yElement = document.querySelector("#y");
const wElement = document.querySelector("#width");
const hElement = document.querySelector("#height");
const sElement = document.querySelector("#scale");
const sizeElement = document.querySelector("#size");

var canvas2 = document.createElement("canvas");
var canvas3 = document.createElement("canvas");

canvas3.id = 'previewCrop'

var ctx = canvas2.getContext("2d");
var ctx1 = canvas3.getContext("2d");

document.getElementById("previewContainer").appendChild(canvas3);


var app = new Vue({
  el: '#app',
  data: {
    colors: []
  }
})

palettes.five.map(v => app.colors.push(totalColors[v]))

app.colors.map(color => {
  color.enabled = false
});

var panX = 0; // scaled image pan
var panY = 0;

function updatePreview(img, width, angle = 0) {

    
    var w = img.width

    var h = img.height
    
    
    ctx.canvas.width = w;
    ctx.canvas.height = h;
    
    ctx.drawImage(img, 0, 0);

    height = (ctx.canvas.height * width) / ctx.canvas.width;
    


    var ang = angle;
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
        
        for(let j in app.colors){
          rgb = app.colors[j].rgb;
          dis = distanceRGB(rgb[0], rgb[1], rgb[2], r, g, b, 2)

          if(dis < min){
            min = dis
            idMin = j
          }
        }
        
        if (a != 0){
            dest.data[i] = app.colors[parseInt(idMin)].rgb[0]
            dest.data[i+1] = app.colors[parseInt(idMin)].rgb[1]
            dest.data[i+2] = app.colors[parseInt(idMin)].rgb[2]
        }

      }


    ctx1.putImageData(dest, 0, 0);


   // document.getElementById("previewContainer").appendChild(canvas2);

    document.querySelector("#loading-container").style.visibility = 'hidden';
  //  document.querySelector("previewCrop").style.visibility = 'visible';


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
  document.querySelector("#loading-container").style.visibility = 'visible';

  const s = document.querySelector("#scale").value;
  
  document.querySelector("#showrange").value = s;
  
  updatePreview(img, s)

});




for (let el of document.querySelectorAll('#myform input'))
el.addEventListener('change', () => {

   document.querySelector("#loading-container").style.visibility = 'visible';

   var size = document.querySelector('input[name=sizeBeads]:checked', '#myform').value

   var kit = $('input[name=kit]:checked', '#myform').val()

   const s = document.querySelector("#scale").value;

   setColorPalete(size, kit)


   updatePreview(img, s)

});


document.getElementById("closecropper").onclick = function () {
  ipc.send("closecropper");
};

document.getElementById("closecropper").style.top = 20 + "px";


function updateTextInput(val) {
  document.getElementById("showrange").innerHTML = val ;
}