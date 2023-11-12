AFRAME.registerComponent("atoms", {
  init: async function () {

    //Get the compund details of the element
    var compounds = await this.getCompounds();

    var barcodes = Object.keys(compounds);

    barcodes.map(barcode => {
      var element = compounds[barcode];

      //Call the function
      this.createAtoms(element);
    });

  },
  getCompounds: function () {
    return fetch("js/compoundList.json")
      .then(res => res.json())
      .then(data => data);
  },
  getElementColors: function () {
    return fetch("js/elementColors.json")
      .then(res => res.json())
      .then(data => data);
  },
  createAtoms: async function (element) {

    //Element data
    var elementName = element.element_name;
    var barcodeValue = element.barcode_value;
    var numOfElectron = element.number_of_electron;

    //Get the color of the element
    var colors = await this.getElementColors();

    //Scene
    var scene = document.querySelector("a-scene");

    //Add marker entity for BARCODE marker
    var marker = document.createElement("a-marker");

    marker.setAttribute("id", `marker-${barcodeValue}`);
    marker.setAttribute("type", "barcode");
    marker.setAttribute("element_name", elementName);
    marker.setAttribute("value", barcodeValue);

    scene.appendChild(marker);

    var atom = document.createElement("a-entity");
    atom.setAttribute("id", `${elementName}-${barcodeValue}`);
    marker.appendChild(atom);

    //Create atom card
    var card = document.createElement("a-entity");
    card.setAttribute("id", `card-${elementName}`);
    card.setAttribute("geometry", {
      primitive: "plane",
      width: 1,
      height: 1
    });

    card.setAttribute("material", {
      src: `./assets/atom_cards/card_${elementName}.png`
    });

    card.setAttribute("position", { x: 0, y: 0, z: 0 });
    card.setAttribute("rotation", { x: -90, y: 0, z: 0 });

    atom.appendChild(card);

    //Create nucleus
    var nucleusRadius = 0.1;
    var nucleus = document.createElement("a-entity");
    nucleus.setAttribute("id", `nucleus-${elementName}`);
    nucleus.setAttribute("geometry", {
      primitive: "sphere",
      radius: nucleusRadius
    });

    nucleus.setAttribute("material", "color", colors[elementName]);
    nucleus.setAttribute("position", { x: 0, y: 1, z: 0 });

    nucleus.setAttribute("rotation", { x: 0, y: 0, z: 0 });

    var nucleusName = document.createElement("a-entity");
    nucleusName.setAttribute("id", `nucleus-name-${elementName}`);
    nucleusName.setAttribute("position", { x: 0, y: 0.21, z: -0.06 });
    nucleusName.setAttribute("rotation", { x: -90, y: 0, z: 0 });
    nucleusName.setAttribute("text", {
      font: "monoid",
      width: 3,
      color: "black",
      align: "center",
      value: elementName
    });

    nucleus.appendChild(nucleusName);

    atom.appendChild(nucleus);
    
    
    //create electrons
    var orbit_angle = -180
    var electron_angle = 30

    for (var num =1;num <= numOfElectron; num++){
      var orbit = document.createElement("a-entity")
      orbit.setAttribute("geometry",{
        primitive:"torus",
        arc:360,
        radius:0.28,
        radiusTubular:0.001,})
      orbit.setAttribute("material",{color:"#ff9e80",opacity:0.3})
      orbit.setAttribute("position",{x:0 ,y:1 , z:0})
      orbit_angle.setAttribute("rotation",{x:0,y:orbit_angle,z:0})
      
      orbit_angle += 45

      atom.appendChild(orbit)

      var electron_group = document.createElement("a-entity")

      electron_group.setAttribute("id",`electron-group-${elementName}`)
      electron_group.setAttribute("rotation",{x:0 ,y:0, z:electron_angle})
      electron_angle += 65
      electron_group.setAttribute("animation",{
        property:"rotation",
        to:`0 0 -360`,
        loop:"true",
        dur:3500,
        easing:"linear"
      })

      orbit.appendChild(electron_group)
     
      var electron = document.createElement("a-entity")
      electron.setAttribute("id",`electron-${elementName}`)
      electron.setAttribute("position",{x:0.2 ,y:0.2, z:0})
      electron.setAttributeNS("geometry",{
        primitive:"sphere",
        radius:0.02,
      })
      electron.setAttribute("material",{color:"#0d47a1",opacity:0.6})

      electron_group.appendChild(electron)
    }


    
  }
});
