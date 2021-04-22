function setViewMode(mode) {
    viewMode = mode

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