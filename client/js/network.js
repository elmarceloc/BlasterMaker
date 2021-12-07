//TODO: crear funcion que setea el estado de public, id,etc al importar un proyecto propio

function getProjects() {
  axios
    .get("http://localhost:4000/project", { credentials: true })
    .then(function (response) {
      console.log(response.data);
      self.projects = response.data;

      self.projects.forEach((project) => {
        project.colors = JSON.parse(project.colors);
      });
    });
}

function updateSave() {

  //todo: verificar si hay algun proyecto en curso

  if (id != null) {
    /*
  
      usar id de proyecto para actualisar
  
      axios.update('http://localhost:4000/project', formData).then(resp => {
  
      })
      */
  }
}


function loadFromWeb() {
  var file = {
    width: app.selected.width,
    height: app.selected.height,
    code: app.selected.code,
    name: app.selected.name,
    palette: app.selected.palette,
    size: app.selected.size,
  };

  UIkit.modal(document.getElementById("modal-project")).hide();

  load(JSON.stringify(file));

  initProject();

  app.setPublish(app.selected.type == "public" && app.personal ? true : false);

  if (app.personal) {
    initialSave();

    // TODO:update   updateSave() en loop
  } else {
    app.name = "Copia de " + app.selected.name;
  }
}
