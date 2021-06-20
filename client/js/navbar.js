function setViewMode(mode) {
    viewMode = mode

    // todo:refactor
    
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
    
        

    localStorage.setItem("viewMode",viewMode)
}

function toggleGrid () {
    showGrid = !showGrid
    localStorage.setItem("showGrid",showGrid)
}

function toggleIds() {
    showIds = !showIds
    localStorage.setItem("showIds",showIds)
}