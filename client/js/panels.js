
/**
 * Generates the data for save in file,temp,etc
 *
 *
 * @param {object} `parent` - the parent, can be null
 * @param {number} `x` - the x position of the panel, relative to parent 
 * @param {number} `y` - the y 
 * @param {number} `width` - the width of the panel
 * @param {number} `height` - the height of the panel
 * @param {number} `marginL` - the margin left of the panel
 * @param {number} `marginR` - the margin right of the panel 
 * @param {number} `marginU` - the margin up of the panel 
 * @param {number} `marginD` - the margin down of the panel 
 * @param {number} `res1` -  
 * @param {number} `res2` -  
 * @param {number} `res3` -  
 * @param {number} `res4` -  
 * @param {number} `minWidth` - the minimun width of the panel
 * @param {number} `minHeight` - the minimun height of the panel 
 * @param {boolean} `isDraggeable` - if it is draggeable 
 * @param {number} `callback` - the callback
 * @param {number} `content` -  

*/

Panel = function (
    parent,
    x,
    y,
    width,
    height,
    marginL,
    marginR,
    marginU,
    marginD,
    res1,
    res2,
    res3,
    res4,
    minWidth,
    minHeight,
    isDraggeable,
    callback,
    content
  ) {
    this.parent =
      parent instanceof Panel
        ? parent
        : { x: 0, y: 0, rWidth: uiCanvas.width, rHeight: uiCanvas.height };
    this.callback = callback;
    this.isInactive = true;
    this.content = content;
    this.parentX = parent.rX ? parent.rX : 0;
    this.parentY = parent.rY ? parent.rY : 0;
  
    this.x = x;
    this.y = y;
  
    this.getX = () =>
      this.x +
      (this.parent instanceof Panel
        ? this.parent.getX() + this.parent.marginL
        : 0);
  
    this.getY = () =>
      this.y +
      (this.parent instanceof Panel
        ? this.parent.getY() + this.parent.marginU
        : 0);
  
    this.width = width;
    this.height = height;
  
    this.marginL = marginL;
    this.marginR = marginR;
    this.marginU = marginU;
    this.marginD = marginD;
  
    this.minWidth = minWidth;
    this.minHeight = minHeight;
  
    this.isDraggeable = isDraggeable;
  
    this.res1 = res1;
    this.res2 = res2;
    this.res3 = res3;
    this.res4 = res4;
  
    this.dragging = false;
    this.resizing1 = false;
    this.resizing2 = false;
    this.resizing3 = false;
    this.resizing4 = false;
  
    this.prevX = this.x;
    this.prevY = this.y;
    this.prevWidth = this.width;
    this.prevHeight = this.height;
  
    this.panZoomFrom = [-1, -1];
    this.panZoomTo = [-1, -1];
  
    this.mouseOver = function () {
      /*console.log(
       mouse[0] < this.width + this.getX() &&
         mouse[1] < this.height + this.getY() &&
         mouse[1] > this.getY() &&
         mouse[0] > this.getX()
     );*/
  
      return (
        (mouse[0] < this.width + this.getX() &&
          mouse[1] < this.height + this.getY() &&
          mouse[1] > this.getY() &&
          mouse[0] > this.getX()) ||
        this.dragging ||
        this.resizing1 ||
        this.resizing2 ||
        this.resizing3 ||
        this.resizing4
      );
    };
  
    this.controller = function () {
      if (!(this.parent instanceof Panel)) {
        this.parent = {
          x: 0,
          y: 0,
          rWidth: uiCanvas.width,
          rHeight: uiCanvas.height,
        };
      }
  
      //this.width=Math.round(this.width/beadMenuScale)*beadMenuScale
      //this.height=Math.round(this.height/beadMenuScale)*beadMenuScale
  
      this.parentX = this.parent.rX ? this.parent.rX : 0;
      this.parentY = this.parent.rY ? this.parent.rY : 0;
  
      this.rX = this.x + this.parentX + this.marginL;
      this.rY = this.y + this.parentY + this.marginU;
      this.rWidth = this.width - this.marginL - this.marginR;
      this.rHeight = this.height - this.marginU - this.marginD;
  
      // checks if mouse is over in the resize area
  
      this.mouseInResizeZone1 = isInRect(
        ...mouse,
        this.getX(),
        this.getY(),
        this.res1,
        this.res1
      );
  
      this.mouseInResizeZone2 = isInRect(
        ...mouse,
        this.getX() + this.width - this.res2,
        this.getY(),
        this.res2,
        this.res2
      );
  
      this.mouseInResizeZone3 = isInRect(
        ...mouse,
        this.getX(),
        this.getY() + this.height - this.res3,
        this.res3,
        this.res3
      );
  
      this.mouseInResizeZone4 = isInRect(
        ...mouse,
        this.getX() + this.width - this.res4,
        this.getY() + this.height - this.res4,
        this.res4,
        this.res4
      );
  
      this.mouseInResizeZone =
        this.mouseInResizeZone1 ||
        this.mouseInResizeZone2 ||
        this.mouseInResizeZone3 ||
        this.mouseInResizeZone4;
  
      // checks if mouse is in drag zone
  
      this.mouseInDragZone =
        isInRect(...mouse, this.getX(), this.getY(), this.width, this.height) &&
        !isInRect(
          ...mouse,
          this.getX() + this.marginL,
          this.getY() + this.marginU,
          this.rWidth,
          this.rHeight
        ) &&
        !this.mouseInResizeZone;
  
      // move the panel when is cliecked over it
      if (clickDown) {
        this.prevX = this.x + this.parentX;
        this.prevY = this.y + this.parentY;
  
        this.prevWidth = this.width;
        this.prevHeight = this.height;
  
        if (isInRect(...mouse, this.getX(), this.getY(), this.width, this.height)) {
          for (i in panels) {
            panels[i].isInactive = true;
          }
          this.isInactive = false;
        } // desactiva las otras ventanas
  
        this.panZoomFrom = mouse;
  
        if (this.mouseInDragZone && this.isDraggeable) {
          this.isDragging = true;
        }
  
        if (this.mouseInResizeZone1) {
          this.resizing1 = true;
        }
  
        if (this.mouseInResizeZone2) {
          this.resizing2 = true;
        }
  
        if (this.mouseInResizeZone3) {
          this.resizing3 = true;
        }
  
        if (this.mouseInResizeZone4) {
          this.resizing4 = true;
        }
      }
  
      if (click) {
        if (!this.isInactive) {
          if (this.isDragging) {
            this.panZoomTo = mouse;
            this.x =
              this.prevX -
              this.parentX +
              (this.panZoomTo[0] - this.panZoomFrom[0]);
            this.y =
              this.prevY -
              this.parentY +
              (this.panZoomTo[1] - this.panZoomFrom[1]);
          }
  
          if (this.resizing1) {
            this.panZoomTo = mouse;
            this.x =
              this.prevX -
              this.parentX +
              (this.panZoomTo[0] - this.panZoomFrom[0]);
            this.width =
              this.prevWidth - (this.panZoomTo[0] - this.panZoomFrom[0]);
            this.y =
              this.prevY -
              this.parentY +
              (this.panZoomTo[1] - this.panZoomFrom[1]);
            this.height =
              this.prevHeight - (this.panZoomTo[1] - this.panZoomFrom[1]);
          }
  
          if (this.resizing2) {
            this.panZoomTo = mouse;
            this.width =
              this.prevWidth + (this.panZoomTo[0] - this.panZoomFrom[0]);
            this.y =
              this.prevY -
              this.parentY +
              (this.panZoomTo[1] - this.panZoomFrom[1]);
            this.height =
              this.prevHeight - (this.panZoomTo[1] - this.panZoomFrom[1]);
          }
  
          if (this.resizing3) {
            this.panZoomTo = mouse;
            this.width =
              this.prevWidth - (this.panZoomTo[0] - this.panZoomFrom[0]);
            this.x =
              this.prevX -
              this.parentX +
              (this.panZoomTo[0] - this.panZoomFrom[0]);
            this.height =
              this.prevHeight + (this.panZoomTo[1] - this.panZoomFrom[1]);
          }
  
          if (this.resizing4) {
            this.panZoomTo = mouse;
            this.width =
              this.prevWidth + (this.panZoomTo[0] - this.panZoomFrom[0]);
            this.height =
              this.prevHeight + (this.panZoomTo[1] - this.panZoomFrom[1]);
          }
        }
      }
  
      if (clickUp) {
        if (
          !this.isInactive &&
          isInRect(...mouse, this.getX(), this.getY(), this.width, this.height) &&
          !(
            this.isDragging ||
            this.resizing1 ||
            this.resizing2 ||
            this.resizing3 ||
            this.resizing4
          )
        ) {
          if (typeof callback == "function" && !this.actionCancel) {
            this.callback(
              this.getX(),
              this.getY(),
              this.marginL,
              this.marginR,
              this.marginU,
              this.marginD,
              this.width,
              this.height
            );
          }
        }
  
        this.isDragging = false;
        this.resizing1 = false;
        this.resizing2 = false;
        this.resizing3 = false;
        this.resizing4 = false;
      }
  
      //Resize with screen collision + ! TODO with -|- collisions
      if (this.width > this.parent.rWidth) {
        this.width = this.parent.rWidth;
      }
  
      if (this.height > this.parent.rHeight) {
        this.height = this.parent.rHeight;
      }
  
      //Fixed size -|- collitions
      for (let i = 0; i < panels.length; i++) {
        let e = panels[i];
        if (
          rectCol(
            this.x,
            this.y,
            this.width,
            this.height,
            e.x,
            e.y,
            e.width,
            e.height
          )
        ) {
          if (
            this.getX() >= e.getX() + e.margin &&
            this.getX() + this.width <= e.getX() + e.width &&
            this.getY() >= e.getY() + e.margin &&
            this.getY() + this.height <= e.getY() + e.height &&
            clickUp &&
            e.parent != this &&
            this.parent != e &&
            !(this.parent instanceof Panel)
          ) {
            this.x -= e.getX() + e.marginL;
            this.y -= e.getY() + e.marginU;
            this.parent = e;
          }
        }
      }
  
      //Fixed size wall collisions
  
      if (this.x + this.width > this.parent.rWidth) {
        this.x = this.parent.rWidth - this.width;
      }
  
      if (this.y + this.height > this.parent.rHeight) {
        this.y = this.parent.rHeight - this.height;
      }
  
      if (this.x < 0) {
        this.x = 0;
      }
  
      if (this.y < 0) {
        this.y = 0;
      }
  
      pensPerCol = Math.floor(
        (this.height - this.marginU - this.marginD) / uiScale
      );
  
      pensPerRow = Math.ceil(colors.length / pensPerCol) - 1;
  
      //Fixed minimum size
  
      if (this.width < this.marginL + this.marginR + this.minWidth) {
        if (this.panZoomTo[0] - this.panZoomFrom[0] > 0) {
          this.x += this.width - this.marginL - this.marginR - this.minWidth;
        }
        this.width = this.marginL + this.marginR + this.minWidth;
      }
  
      if (this.height < this.marginU + this.marginD + this.minHeight) {
        if (this.panZoomTo[1] - this.panZoomFrom[1] > 0) {
          this.y += this.height - this.marginU - this.marginD - this.minHeight;
        }
        this.height = this.marginU + this.marginD + this.minHeight;
      }
  
      // updates the panel size
  
      this.rX = this.x + this.parentX + this.marginL;
      this.rY = this.y + this.parentY + this.marginU;
      this.rWidth = this.width - this.marginL - this.marginR;
      this.rHeight = this.height - this.marginU - this.marginD;
  
      this.content(
        this.getX(),
        this.getY(),
        this.marginL,
        this.marginR,
        this.marginU,
        this.marginD,
        this.width,
        this.height
      );
  
      if (isDevMode) {
        //rect(...this.panZoomFrom,2,2)
        //rect(...this.panZoomTo,2,2)
        //rect(this.x+this.parentX,this.y+this.parentY,this.width,this.height)
        //rect(this.rX,this.rY,this.rWidth,this.rHeight)
        //uiCtx.strokeStyle="black"
      }
    };
  };
  
  function drawWindow(x,y,width,height,mL,mU,mR,mD){
    //Shadow
    shadowDistance = 3
    
    uiCtx.beginPath();
    uiCtx.rect(x+shadowDistance, y+shadowDistance, width+shadowDistance, height+shadowDistance)
    uiCtx.fillStyle="rgba(0,0,0,.2)"
    uiCtx.fill()

    //Border menu

    uiCtx.beginPath();
    uiCtx.rect(x,y,width,height)
    uiCtx.strokeStyle="#161616"
    uiCtx.fillStyle="#4c4c4c"
    uiCtx.lineWidth=1.2
    uiCtx.fill()
    //uiCtx.stroke()

    //Background menu  

    uiCtx.beginPath();
    uiCtx.rect(x+mL,y+mU,width-mL-mR,height-mU-mD)
    uiCtx.fillStyle="#252525"
    uiCtx.fill()

  }

  function drawTitle(text, x, y) {
    uiCtx.fillStyle = "#aaaaaa";
    uiCtx.font = "12px Arial";
    uiCtx.textAlign = "center";
    uiCtx.textBaseline = "initial";
  
    uiCtx.fillText(text, x, y + 10);

  }
    
  panels["colors"]=(new Panel("",0,0,24,uiCanvas.height,0,0,0,0,0,0,0,0,60,60,false,(x,y,mL,mR,mU,mD,w,h)=>{
    //al hacer click

    pensPerCol = Math.floor((h-mU-mD) / uiScale);
    pensPerRow = Math.ceil(colors.length / pensPerCol)-1;
    if (isInRect(...mouse, x, y, w, h)) {
      if (
        1 +
        Math.floor((mouse[1] - y - mU) / uiScale) +
        Math.floor((mouse[0] - x - mL) / uiScale) * pensPerCol < colors.length+1
        ) {

          color =
          1 +
          Math.floor((mouse[1] - y - mU) / uiScale) +
          Math.floor((mouse[0] - x - mL) / uiScale) * pensPerCol;

          if (!search == '') {
            color = 1
            colors.forEach( (c, i) => {
              if (c.id.substring(2) == search) color = 1 + i  
            })

            document.getElementById('search').value = ''
          }

          /*tool = 1;*/
          if (color < 1) color = 1;
        }
    }
  },(x,y,mL,mR,mU,mD,width,height)=>{
    drawWindow(x,y,width,height,mL,mU,mR,mD);

  
    //Draw-menu-beads
    pensPerCol = Math.floor((height-mU-mD) / uiScale);
    pensPerRow = Math.ceil(colors.length / pensPerCol)-1;


    panels["colors"].width = pensPerRow * uiScale + 30;

    search = document.getElementById('search').value

    var colorId = ''


    for (let i = 0; i < colors.length; i++) {
      if (
        Math.floor(i / pensPerCol) * uiScale + 15 + x + mL <
        x + width - mL - mR
      ) {

        var xPos = Math.floor(i / pensPerCol) * uiScale + 15 + x + mL
        var yPos = (i % pensPerCol) * uiScale + 15 + y + mU

        if (!search == '') {
          xPos = 15 + x + mL
          yPos = 15 + y + mU

        }

        if (search == '' || search.toLowerCase() == colors[i].id.toLowerCase().substring(2)) {
          


          drawBead2(
            xPos,
            yPos,
            uiScale,
            colors[i].rgb,
            color == i + 1 && !panels["colors"].inactive
          );
        }

        var dx = mouse[0] - xPos ;
        var dy = mouse[1] - yPos ;

        
        if (dx * dx + dy * dy < (uiScale * uiScale)/ (2.5 * 2.5) ) {
          colorId = colors[i].id
        }

      }

      if (colorId /*&& search == ''*/) {
        drawTooltip(uiCtx, mouse[0], mouse[1],  colorId, 50)
      }

      
    }

  }))
  


  panels["palete"]=(new Panel('',90,1000,120,100,0,0,16,0,0,0,0,30,120,120,true,(x,y,mL,mR,mU,mD,width,height)=>{
    //al hacer click
    pensPerCol = Math.floor((width - mL - mR) / uiScale);
    pensPerRow = Math.ceil(colorPalette.length / pensPerCol) - 1;
  
      if(isInRect(...mouse,x,y,width,height)){
        if (isHorizontal) {
          if (
            Math.floor((mouse[0] - x - mL) / uiScale) +
            Math.floor((mouse[1] - y - mU) / uiScale) * pensPerCol <
            colorPalette.length
          ) {

            color =
              1 +
              colors.indexOf(
                colorPalette[
                  Math.floor((mouse[0] - x - mL) / uiScale) +
                    Math.floor((mouse[1] - y - mU) / uiScale) * pensPerCol
                ]
              );

            /*tool = 1;*/
            if(color <1) color = 1;
          }
        } else {
          if (
            Math.floor((mouse[1] - y - mU) / uiScale) +
              Math.floor((mouse[0] - x - mL) / uiScale) * pensPerCol <
            colorPalette.length
          ) {
            color =
              1 +
              colors.indexOf(
                colorPalette[
                  Math.floor((mouse[1] - y - mU) / uiScale) +
                    Math.floor((mouse[0] - x - mL) / uiScale) * pensPerCol
                ]
              );
            /*tool = 1;*/
            if(color <1) color = 1;
          }
        } 
  
      }
        
    },(x,y,mL,mR,mU,mD,width,height)=>{
  
    //dibuja una ventana
    drawWindow(x,y,width,height,mL,mU,mR,mD);
  
    drawTitle('Paleta', x + width / 2 - 3, y)


    if (colorPalette.length == 0) {
      uiCtx.fillStyle = "#aaaaaa";
      uiCtx.font = "11px Arial";
      uiCtx.textAlign = "left";
      uiCtx.textBaseline = "initial";
    
      uiCtx.fillText('No hay colores en uso.', x + 6, y + 30);
    }

    //Draw-menu-beads
  
    pensPerCol = Math.floor((width - mL - mR) / uiScale);
    pensPerRow = Math.ceil(colorPalette.length / pensPerCol) - 1;
  

    var colorId = ''


    for (let i = 0; i < colorPalette.length; i++) { // FIXME: checkiar esto
      if (
        Math.floor(i / pensPerCol) * uiScale + 15 + x + mL <
        x + width - mL - mR
      ) {
        if ((isHorizontal == true)) {


          var xPos = (i % pensPerCol) * uiScale + 15 + x + mL
          var yPos = Math.floor(i / pensPerCol) * uiScale + 15 + y + mU

          var dx = mouse[0] - xPos ;
          var dy = mouse[1] - yPos ;
  
        
          drawBead2(
            xPos,
            yPos,
            uiScale,
            colorPalette[i].rgb,
            colors.map((color) => color.rgb).indexOf(colorPalette[i].rgb) + 1 ==
              color && !panels["palete"].inactive
          );

          if (dx * dx + dy * dy < (uiScale * uiScale)/ (2.5 * 2.5) ) {
            colorId = colorPalette[i].id
          }

        } else {
          drawBead2(
            Math.floor(i / pensPerCol) * uiScale + 15 + x + mL,
            (i % pensPerCol) * uiScale + 15 + y + mU,
            uiScale,
            colorPalette[i].rgb,
            colors.map((color) => color.rgb).indexOf(colorPalette[i].rgb) + 1 ==
              color && !panels["palete"].inactive
          );
        }
      }
      
    }
    
    if (colorId) {
      drawTooltip(uiCtx, mouse[0], mouse[1],  colorId, 46)
    }

  }))
  
/* ===========================

          Tools Panel

  ===========================    */ 

  var ui = document.getElementById("ui");


panels["tools"]=(new Panel("",window.innerWidth/2 - 96*2, 800, 192+96*2,50,0,0,0,0,15,15,15,15,60,0,true,(x,y,mL,mR,mU,mD,width,height)=>{},(x,y,mL,mR,mU,mD,width,height)=>{
    drawWindow(x,y,width,height,mL,mU,mR,mD);
}))

panels["move"]=(new Panel(panels["tools"],0,0,50,50,0,0,0,0,0,0,0,0,50,50,true,(x,y,mL,mR,mU,mD,width,height)=>{setTool(0)},(x,y,mL,mR,mU,mD,width,height)=>{
  if (tool == 0) {
    uiCtx.drawImage(ui, 0, 48, 48, 48, x + mL, y + mU, 48, 48);
  } else {
    uiCtx.drawImage(ui, 0, 0, 48, 48, x + mL, y + mU, 48, 48);
  }
}))


panels["pen"]=(new Panel(panels["tools"],48,0,50,50,0,0,0,0,0,0,0,0,50,50,true,(x,y,mL,mR,mU,mD,width,hheight)=>{setTool(1)},(x,y,mL,mR,mU,mD,width,height)=>{
  if (tool == 1) {
    uiCtx.drawImage(ui, 48, 48, 48, 48, x + mL, y + mU, 48, 48);
  } else {
    uiCtx.drawImage(ui, 48, 0, 48, 48, x + mL, y + mU, 48, 48);
  }
}))



panels["eraser"]=(new Panel(panels["tools"],48*2,0,50,50,0,0,0,0,0,0,0,0,50,50,true,(x,y,mL,mR,mU,mD,width,height)=>{setTool(3)},(x,y,mL,mR,mU,mD,width,height)=>{
  if (tool == 3) {
    uiCtx.drawImage(ui, 48 * 2, 48, 48, 48, x + mL, y + mU, 48, 48);
  } else {
    uiCtx.drawImage(ui, 48 * 2, 0, 48, 48, x + mL, y + mU, 48, 48);
  }
}))

panels["bucket"]=(new Panel(panels["tools"],48*3,0,50,50,0,0,0,0,0,0,0,0,50,50,true,(x,y,mL,mR,mU,mD,width,height)=>{setTool(2)},(x,y,mL,mR,mU,mD,width,height)=>{
  if (tool == 2) {
    uiCtx.drawImage(ui, 48 * 3, 48, 48, 48, x + mL, y + mU, 48, 48);
  } else {
    uiCtx.drawImage(ui, 48 * 3, 0, 48, 48, x + mL, y + mU, 48, 48);
  }
}))

panels["undo"]=(new Panel(panels["tools"],48*4,0,50,50,0,0,0,0,0,0,0,0,50,50,true,(x,y,mL,mR,mU,mD,width,height)=>{
  
  undo()

},(x,y,mL,mR,mU,mD,width,height)=>{
  uiCtx.drawImage(ui, 48 * 4, 0, 48, 48, x + mL, y + mU, 48, 48);
}))


panels["picker"]=(new Panel(panels["tools"],48*5,0,50,50,0,0,0,0,0,0,0,0,50,50,true,(x,y,mL,mR,mU,mD,width,height)=>{setTool(4)},(x,y,mL,mR,mU,mD,width,height)=>{
  if (tool == 4) {
    uiCtx.drawImage(ui, 48 * 5, 48, 48, 48, x + mL, y + mU, 48, 48);
  } else {
    uiCtx.drawImage(ui, 48 * 5, 0, 48, 48, x + mL, y + mU, 48, 48);
  }
}))

panels["zoomout"]=(new Panel(panels["tools"],48*6,0,50,50,0,0,0,0,0,0,0,0,50,50,true,(x,y,mL,mR,mU,mD,width,height)=>{scale -= 2},(x,y,mL,mR,mU,mD,width,height)=>{
  uiCtx.drawImage(ui, 48 * 11, 0, 48, 48, x + mL, y + mU, 48, 48);

}))

panels["zoomin"]=(new Panel(panels["tools"],48*7,0,50,50,0,0,0,0,0,0,0,0,50,50,true,(x,y,mL,mR,mU,mD,width,height)=>{scale += 2},(x,y,mL,mR,mU,mD,width,height)=>{
  uiCtx.drawImage(ui, 48 * 10, 0, 48, 48, x + mL, y + mU, 48, 48);
}))

/* ===========================

      Transform Panel

  ===========================    */ 


panels["transform"]=(new Panel("",window.innerWidth/2+400,800,48*4,70,0,0,16,0,0,0,0,0,60,0,true,(x,y,mL,mR,mU,mD,width,height)=>{},(x,y,mL,mR,mU,mD,width,height)=>{
    drawWindow(x,y,width,height,mL,mU,mR,mD);

    drawTitle('Transformar', x + width / 2 - 3, y)
}))

panels["flipHorizontal"]=(new Panel(panels["transform"],0,0,50,50,0,0,0,0,0,0,0,0,50,50,true,(x,y,mL,mR,mU,mD,width,height)=>{flipHorizontal()},(x,y,mL,mR,mU,mD,width,height)=>{
    uiCtx.drawImage(ui, 48*6, 0, 48, 48, x + mL, y + mU, 48, 48);
}))

panels["flipVertical"]=(new Panel(panels["transform"],48,0,50,50,0,0,0,0,0,0,0,0,50,50,true,(x,y,mL,mR,mU,mD,width,height)=>{flipVertical()},(x,y,mL,mR,mU,mD,width,height)=>{    
    uiCtx.drawImage(ui, 48*7, 0, 48, 48, x + mL, y + mU, 48, 48);
}))


panels["rotateRight"]=(new Panel(panels["transform"],48*2,0,50,50,0,0,0,0,0,0,0,0,50,50,true,(x,y,mL,mR,mU,mD,width,height)=>{rotateRight()},(x,y,mL,mR,mU,mD,width,height)=>{    
    uiCtx.drawImage(ui, 48*8, 0, 48, 48, x + mL, y + mU, 48, 48);
}))

panels["rotateLeft"]=(new Panel(panels["transform"],48*3,0,50,50,0,0,0,0,0,0,0,0,50,50,true,(x,y,mL,mR,mU,mD,width,height)=>{rotateLeft()},(x,y,mL,mR,mU,mD,width,height)=>{
    uiCtx.drawImage(ui, 48*9, 0, 48, 48, x + mL, y + mU, 48, 48);
}))

