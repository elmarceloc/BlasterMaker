
//TODO: crear funcion que setea el estado de public, id,etc al importar un proyecto propio

function getProjects() {
    axios.get("http://localhost:4000/project", {credentials:true }).then(function (response) {
      console.log(response.data)
      self.projects = response.data
  
      self.projects.forEach(project =>{
        project.colors = JSON.parse(project.colors)
  
      })
  
    })
  }
  
  function updateSave() {
    // actualisar
  
    //todo: verificar si hay algun proyecto en curso
  
    if(id != null){
      /*
  
      usar id de proyecto para actualisar
  
      axios.update('http://localhost:4000/project', formData).then(resp => {
  
      })
      */
    }
  
  }
  
  function initialSave() {
    
    const canvas = document.getElementById('renderCanvas');
    canvas.toBlob(function(blob) {
      const formData = new FormData();
      formData.append('file', blob, 'filename.png');
  
      formData.append('name' , app.name); 
      formData.append('type' , 'private'); 
      formData.append('size' , gridSize); 
      formData.append('palette' , palette); 
      formData.append('width' , width); 
      formData.append('height' , height); 
      formData.append('total' ,getColorsAmount()); 
      formData.append('code' , JSON.stringify(generate())); 
      formData.append('colors' , JSON.stringify(colors)); 
  
  
      formData.append('userId' , '6066682fe0fb5c09e00dc132'); //TODO: Cambiar 👀
  
  
  
      // Post via axios or other transport method
      axios.post('http://localhost:4000/project', formData).then(resp => {
  
        console.log(resp.status);
        
        switch (resp.data) {
          case '0':
            UIkit.notification({
              message: "Tu proyecto esta vacío",
              pos: "top-center",
            });
            break;
            // TODO: activar esto cuando este el online ready
         /* case '2':
            UIkit.notification({
              message: "Error al subir el proyecto a la nube",
              pos: "top-center",
            });
            break;*/
  
        /* case '3':
            UIkit.notification({
              message: "Proyecto guardado exitosamente en la nube",
              pos: "top-center",
            });
            break;  */
        }
  
      }).catch(function (error) {
  
       /* if (!error.response) {
          // network error
          UIkit.notification({
            message: "Error al subir el proyecto a la nube.",
            pos: "top-center",
          });
      }*/
  
      
      });
      
  
  
    })
  }
  
  
  function loadFromWeb() {
    var file = {
      width: app.selected.width,
      height: app.selected.height,
      code: app.selected.code,
      name: app.selected.name,
      palette: app.selected.palette,
      size: app.selected.size
    }
  
    UIkit.modal(document.getElementById('modal-project')).hide();
  
    
    load(JSON.stringify(file))
  
    initProject()
    
    app.setPublish(app.selected.type == 'public' && app.personal ? true: false )
  
  
    if (app.personal) {
      initialSave()
  
      // TODO:update   updateSave() en loop
  
      
    }else{
      app.name = 'Copia de '+app.selected.name
    }
  
  }
  