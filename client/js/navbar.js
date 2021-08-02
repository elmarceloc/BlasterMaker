function setViewMode(mode) {
    viewMode = mode

  /*    
    switch (viewMode) {
        case 1:
            if(scale < maskScale){
                maskCanvas.style.opacity = '0%'
                maskCanvasHD.style.opacity = '0%'
              }else if(scale >= maskScale && scale < maskScaleHD){
                maskCanvasHD.style.opacity = '0%'
                maskCanvas.style.opacity = '100%'
              }else{
                maskCanvas.style.opacity = '0%'
                maskCanvasHD.style.opacity = '100%'
              }
            
            break;
    
        case 2:
            maskCanvas.style.opacity = '0%'
            maskCanvasHD.style.opacity = '0%'
            break;
    }
    */
        
    if(storage){
      storage.set('viewMode', viewMode, function(error) {
      });
    }else{
      localStorage.setItem('viewMode',viewMode)
    }
}

function toggleGrid () {
    showGrid = !showGrid

    if(storage){
      storage.set('showGrid', viewMode, function(error) {
      });
    }else{
      localStorage.setItem('showGrid',viewMode)
    }
}

function toggleIds() {
    showIds = !showIds
    if(storage){
      storage.set('showIds', viewMode, function(error) {
      });
    }else{
      localStorage.setItem('showIds',viewMode)
    }
}