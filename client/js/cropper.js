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




colors = [
  { rgb: [255, 255, 255], id: "S-1", name: "White" },
  { rgb: [255, 163, 139], id: "S-2", name: "Burning Sand" },
  { rgb: [246, 176, 76], id: "S-3", name: "Tangerine" },
  { rgb: [255, 103, 31], id: "S-4", name: "Orange" },
  { rgb: [225, 6, 0], id: "S-5", name: "Tall Poppy" },
  { rgb: [236, 134, 208], id: "S-6", name: "Raspberry Pink" },
  { rgb: [155, 155, 155], id: "S-7", name: "Gray 2" },
  { rgb: [36, 222, 91], id: "S-8", name: "Emerald" },
  { rgb: [0, 104, 94], id: "S-9", name: "Dark Green" },
  { rgb: [65, 182, 230], id: "S-1O", name: "Baby Blue" },
  { rgb: [0, 51, 153], id: "S-11", name: "Dark Blue" },
  { rgb: [160, 94, 191], id: "S-12", name: "Pastel Lavender" },
  { rgb: [0, 0, 0], id: "S-13", name: "Black" },
  { rgb: [250, 224, 83], id: "S-14", name: "Sandstone" },
  { rgb: [122, 62, 44], id: "S-15", name: "Redwood" },
  { rgb: [92, 71, 56], id: "S-16", name: "Brown" },
  { rgb: [123, 77, 53], id: "S-17", name: "Light Brown" },
  { rgb: [252, 191, 169], id: "S-19", name: "Bubble Gum" },
  { rgb: [36, 158, 107], id: "S-20", name: "Green" },
  { rgb: [135, 216, 57], id: "S-21", name: "Pastel Green" },
  { rgb: [51, 0, 114], id: "S-22", name: "Purple" },
  { rgb: [100, 53, 155], id: "S-23", name: "Royal Purple" },
  { rgb: [20, 123, 209], id: "S-24", name: "True Blue" },
  { rgb: [255, 52, 179], id: "S-25", name: "Hot Pink" },
  { rgb: [219, 33, 82], id: "S-26", name: "Magenta" },
  { rgb: [255, 209, 0], id: "S-27", name: "Yellow" },
  { rgb: [234, 184, 228], id: "S-28", name: "Lily Pink" },
  { rgb: [255, 231, 128], id: "S-32", name: "Beeswax" },
  { rgb: [197, 180, 227], id: "S-33", name: "Maverick" },
  { rgb: [186, 12, 47], id: "S-34", name: "Red" },
  { rgb: [201, 128, 158], id: "S-36", name: "Old Pink" },
  { rgb: [113, 216, 191], id: "S-37", name: "Blue Green" },
  { rgb: [171, 37, 86], id: "S-38", name: "Burgundy" },
  { rgb: [247, 139, 0], id: "S-39", name: "Yellow Orange" },
  { rgb: [241, 167, 220], id: "S-40", name: "Carnation Pink" },
  { rgb: [154, 85, 22], id: "S-41", name: "Copper" },
  { rgb: [160, 159, 157], id: "S-42", name: "Silver" },
  { rgb: [118, 119, 119], id: "S-43", name: "Gray 3" },
  { rgb: [170, 220, 235], id: "S-44", name: "Sky Blue" },
  { rgb: [0, 178, 169], id: "S-45", name: "Medium Turquoise" },
  { rgb: [115, 211, 60], id: "S-46", name: "Bright Green" },
  { rgb: [180, 126, 0], id: "S-47", name: "Marigold" },
  { rgb: [255, 199, 44], id: "S-48", name: "Corn" },
  { rgb: [114, 25, 95], id: "S-49", name: "Mulberry Wood" },
  { rgb: [252, 251, 205], id: "S-51", name: "Spring Sun" },
  { rgb: [242, 240, 161], id: "S-52", name: "Picasso" },
  { rgb: [105, 179, 231], id: "S-53", name: "Blue Enchantress" },
  { rgb: [0, 144, 218], id: "S-54", name: "Light Blue" },
  { rgb: [173, 220, 145], id: "S-55", name: "Pistachio" },
  { rgb: [255, 106, 19], id: "S-56", name: "Outrageous Orange" },
  { rgb: [164, 73, 61], id: "S-57", name: "Buccaneer" },
  { rgb: [165, 0, 52], id: "S-58", name: "Paprika" },
  { rgb: [74, 31, 135], id: "S-59", name: "Butterfly Bush" },
  { rgb: [167, 123, 202], id: "S-60", name: "Lavander" },
  { rgb: [206, 220, 0], id: "S-61", name: "Key Lemon Pie" },
  { rgb: [88, 87, 53], id: "S-63", name: "Metallic Gold" },
  { rgb: [5, 8, 73], id: "S-64", name: "Black Rock" },
  { rgb: [243, 207, 179], id: "S-67", name: "Vainilla" },
  { rgb: [225, 192, 120], id: "S-68", name: "Tan" },
  { rgb: [35, 40, 43], id: "S-69", name: "Mine Shaft" },
  { rgb: [155, 188, 17], id: "S-70", name: "Drark Algae" },
  { rgb: [0, 133, 43], id: "S-71", name: "Jade Green" },
  { rgb: [89, 213, 216], id: "S-72", name: "Light Sea Blue" },
  { rgb: [239, 239, 239], id: "S-77", name: "Ghost White" },
  { rgb: [209, 209, 209], id: "S-78", name: "Ash Gray" },
  { rgb: [187, 188, 188], id: "S-79", name: "Gray 1" },
  { rgb: [153, 155, 48], id: "S-80", name: "Dark Olive" },
  { rgb: [205, 178, 119], id: "S-81", name: "Deer" },
  { rgb: [184, 97, 37], id: "S-83", name: "Siena" },
  { rgb: [170, 87, 97], id: "S-84", name: "Deep Chestnut" },
  { rgb: [92, 19, 27], id: "S-85", name: "Red Wine" },
  { rgb: [234, 170, 0], id: "S-86", name: "Goldenrod" },
  { rgb: [255, 109, 106], id: "S-87", name: "Goldenrod" },
];
  

var panX = 0; // scaled image pan
var panY = 0;

function updatePreview(img, width) {

    
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

  updatePreview(img, s)

});




for (let el of document.querySelectorAll('#myform input'))
el.addEventListener('change', () => {
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
  document.getElementById("showrange").innerHTML = val;
}