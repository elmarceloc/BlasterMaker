s = (x, y) => [x[0] + y[0], x[1] + y[1]];

/**
 * Checks if position if is rect
 *
 * @return {boolean} if is inside of the rect

*/

function isInRect(i, j, x, y, w, h) {
  //rect(x,y,w,h)
  return i > x && i < x + w && j > y && j < y + h;
}

function rectCol(x1, y1, w1, h1, x2, y2, w2, h2) {
  return x1 + w1 > x2 && x1 < x2 + w2 && y1 + h1 > y2 && y1 < y2 + h2;
}

function isBead(x, y) {
  return grid2.data[getBeadPos(x, y) + 3] != 0;
}

function getBeadPos(x, y) {
  return 4 * (x + y * width);
}

function getBeadColor(x, y) {
  if (isInside(x, y) && isBead(x, y)) {
    return getColorId(
      grid2.data.slice(getBeadPos(x, y), getBeadPos(x, y) + 3),
      colors
    );
  } else {
    return 0;
  }
}

function getColorId(Color, Colors) {
  return Colors.findIndex((obj) => sameColor(obj.rgb, Color)) + 1;
}

function setBeadColor(x, y, color) {
  if (isInside(x, y)) {
    pos = getBeadPos(x, y, width);
    if (color != 0) {
      col = colors[color - 1].rgb;
      grid2.data[pos + 0] = col[0];
      grid2.data[pos + 1] = col[1];
      grid2.data[pos + 2] = col[2];
      grid2.data[pos + 3] = 255;

      //agrega el color si no está
      if (getColorId(col, colorPalette) == 0) {
        colorPalette.push(colors[getBeadColor(x, y) - 1]);
      }
    } else {
      grid2.data[pos + 0] = 0;
      grid2.data[pos + 1] = 0;
      grid2.data[pos + 2] = 0;
      grid2.data[pos + 3] = 0;
    }
  }
}

function toGrid(x) {
  return x.map((k) => Math.floor(k));
}

/**
 * Gets the position of canvas bead
 *
 *
 * @param {number} `x` - the x position of the mouse
 * @param {number} `y` - the y position of the mouse
 * @return {Array } the `x` and y position of the bead
 *

*/

function getPosTableToScreen(x, y) {
  return [
    (x - width / 2 + xOffset) * scale + uiCanvas.width / 2,
    (y - height / 2 + yOffset) * scale + uiCanvas.height / 2,
  ];
}

function getPosGridToScreen(x, y) {
  return getPosTableToScreen(...toGrid([x, y]));
}

function getPosScreenToTable(x, y) {
  return [
    (x - uiCanvas.width / 2) / scale + width / 2 - xOffset,
    (y - uiCanvas.height / 2) / scale + height / 2 - yOffset,
  ];
}

function getPosScreenToGrid(x, y) {
  return toGrid(getPosScreenToTable(x, y));
}


/**
 * Gets the total amount of beads
 *
 * @return {number} amount of beads

*/

function getColorsAmount() {
  let count = 0;

  for (let i = 0; i < width; i++) {
    for (let j = 0; j < height; j++) {
      if (isBead(i, j)) {
        count++;
      }
    }
  }
  return count;
}

/**
   * Checks if bead is inside the screen
   *
   *
   * @param {number} `x` - the x position of the bead
   * @param {number} `y` - the y position of the bead
   * @return {boolean} if it inside
   *
  
  */

function inScreen(x, y) {
  return x >= -scale && x < uiCanvas.width && y >= -scale && y < uiCanvas.height;
}

/**
   * Checks if bead is inside the working space
   *
   *
   * @param {number} `x` - the x position of the bead
   * @param {number} `y` - the y position of the bead
   * @return {boolean} if it it inside
   *
  
  */

function isInside(x, y) {
  return y >= 0 && y < height && x >= 0 && x < width;
}

/**
   * Checks if mouse is over any panel
   *
   *
   * @return {boolean} if is it
   *
  
  */

 function isOverPanel() {
  for (let i in panels) {
    if (panels[i].mouseOver()) return true;
  }
  return false
}



function replaceBead(index, toreplace) {
  for (x = 0; x < 4 * width * height; x+=4) {
    if (sameColor(grid2.data.slice(x, x + 3), colors[index-1].rgb)) {
      
      if (toreplace != 0) {
        grid2.data[x + 0] = colors[toreplace-1].rgb[0];
        grid2.data[x + 1] = colors[toreplace-1].rgb[1];
        grid2.data[x + 2] = colors[toreplace-1].rgb[2];
        grid2.data[x + 3] = 255;
      } else {
        grid2.data[x + 0] = 0;
        grid2.data[x + 1] = 0;
        grid2.data[x + 2] = 0;
        grid2.data[x + 3] = 0;
      }
    }
  }
}

function distanceRGB(r, g, b, r2, g2, b2, norm) {
  return (
    (Math.abs(r - r2) ** norm +
      Math.abs(g - g2) ** norm +
      Math.abs(b - b2) ** norm) **
      1 /
    norm
  );
}

function sameColor(c1, c2) {
  return distanceRGB(...c1, ...c2, 1) == 0;
}

function offset(el) {
  var rect = el.getBoundingClientRect(),
    scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
    scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  return { top: rect.top + scrollTop, left: rect.left + scrollLeft };
}

function isInInfo(x, y) {
  var div = document.querySelector("#openinfo");
  var divOffset = offset(div);

  var margin = 10;

  return (
    x > divOffset.left - margin &&
    x < divOffset.left + 42 + margin &&
    y > divOffset.top - margin &&
    y < divOffset.top + 42 + margin
  );
}

function setTool(t) {
  if (t == 0) {
    document.getElementsByTagName("BODY")[0].style.cursor = "grab";
  } else {
    document.getElementsByTagName("BODY")[0].style.cursor = "default";
  }

  tool = t;
}

function isEmpty() {
   for(var i=0;i<grid2.data.length;i++)
    if(grid2.data[i]!==0)return false;
  return true;

}
// FIXME: 
function rotateLeft() {
  save();
  newGrid2 = new ImageData(height, width);
  for (j = 0; j < height; j++) {
    for (i = 0; i < width * 4; i += 4) {
      for (rgb = 0; rgb < 4; rgb++) {
        newGrid2.data[(height - 1) * 4 + height * i - j * 4 + rgb] =
          grid2.data[i + 4 * width * j + rgb];
      }
    }
  }
  resize(height, width);
  grid2 = newGrid2;
}
// FIXME: 

function rotateRight() {
  save();
  newGrid2 = new ImageData(height, width);
  for (j = 0; j < width; j++) {
    for (i = 0; i < height * 4; i += 4) {
      for (rgb = 0; rgb < 4; rgb++) {
        newGrid2.data[i + 4 * height * j + rgb] =
          grid2.data[(width - 1) * 4 + width * i - j * 4 + rgb];
      }
    }
  }
  resize(height, width);
  grid2 = newGrid2;
}

function flipHorizontal() {
  save();
  newGrid2 = new ImageData(width, height);
  for (j = 0; j < height; j++) {
    for (i = 0; i < width * 4; i += 4) {
      for (rgb = 0; rgb < 4; rgb++) {
        newGrid2.data[i + 4 * width * j + rgb] =
          grid2.data[4 * (width - 1) - i + 4 * width * j + rgb];
      }
    }
  }
  grid2 = newGrid2;
}

function flipVertical() {
  save();
  newGrid2 = new ImageData(width, height);
  for (j = 0; j < height; j++) {
    for (i = 0; i < width * 4; i += 4) {
      for (rgb = 0; rgb < 4; rgb++) {
        newGrid2.data[i + j * width * 4 + rgb] =
          grid2.data[i + (height - 1 - j) * width * 4 + rgb];
      }
    }
  }
  grid2 = newGrid2;
}

function crop() {
  // crops the thing

  if (isEmpty()) return
  
  save();


  var x1 = Infinity;
  var y1 = Infinity;
  var x2 = 0;
  var y2 = 0;


  for (j = 0; j < height; j++) {
    for (i = 0; i < width * 4; i += 4) {
      if (grid2.data[i + j * width * 4 + 3] != 0) {
        x1 = Math.min(x1, i / 4);
        y1 = Math.min(y1, j);
        x2 = Math.max(x2, i / 4);
        y2 = Math.max(y2, j);
      }
    }
  }

  
  width2=Math.ceil((x2 - x1)/ gridSize) * gridSize
  height2=Math.ceil((y2 - y1)/ gridSize) * gridSize
  
  var newGrid2 = new ImageData(width2, height2);

  for (j = 0; j <= height2; j++) {
    for (i = 0; i <= width2; i ++) {
      for (rgb = 0; rgb < 4; rgb++) {
        newGrid2.data[i * 4 + j * width2 * 4 + rgb] =
          grid2.data[(i+x1)*4 + (j+y1) * width2 * 4 + rgb];
      }
    }
  }  
  

  resize(x2 - x1, y2 - y1)
  grid2 = newGrid2;
}


function roundRect(ctx, x, y, width, height, radius, fill, stroke) {
  if (typeof stroke === 'undefined') {
    stroke = true;
  }
  if (typeof radius === 'undefined') {
    radius = 5;
  }
  if (typeof radius === 'number') {
    radius = {tl: radius, tr: radius, br: radius, bl: radius};
  } else {
    var defaultRadius = {tl: 0, tr: 0, br: 0, bl: 0};
    for (var side in defaultRadius) {
      radius[side] = radius[side] || defaultRadius[side];
    }
  }
  ctx.beginPath();
  ctx.moveTo(x + radius.tl, y);
  ctx.lineTo(x + width - radius.tr, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
  ctx.lineTo(x + width, y + height - radius.br);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
  ctx.lineTo(x + radius.bl, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
  ctx.lineTo(x, y + radius.tl);
  ctx.quadraticCurveTo(x, y, x + radius.tl, y);
  ctx.closePath();
  if (fill) {
    ctx.fill();
  }
  if (stroke) {
    ctx.stroke();
  }

}


function drawTooltip(ctx, x, y, text, width) {
  ctx.beginPath();

  ctx.fillStyle = "#1a1a1a";
  roundRect(ctx, x, y - 20, width, 20, 6, true, false);
  ctx.fill();

  ctx.textAlign = "start";
  ctx.fillStyle = "#ffffff";
  ctx.font = "12px Arial";
  ctx.textBaseline = "alphabetic";
  
  ctx.fillText(text, x + 10, y - 6);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

}



function setColorPalete(size,kit) {
  colors = []

  palette = kit

  switch (size) {
    case '5':
      gridSize = 29

      switch (kit) {
        case 'all':
          palettes.five.map(v => colors.push(totalColors[v]))
          break;
      
        case 'basic':
          palettes.fiveBasic.map(v => colors.push(totalColors[v]))
          break;
      }
      break;
    case '2.6':
      gridSize = 50

      switch (kit) {
        case 'all':
          palettes.two.map(v => colors.push(totalColors[v]))
          break;
      
        case 'basic':
          palettes.twoBasic.map(v => colors.push(totalColors[v]))
          break;
      }
      break;
  }

}


function makeid(length) {
  var result           = [];
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
    result.push(characters.charAt(Math.floor(Math.random() *  charactersLength)));
  }
 return result.join('');
}