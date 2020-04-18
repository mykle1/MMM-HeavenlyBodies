/* Magic Mirror
 * Module: MMM-HeavenlyBodies
 *
 * By Mykle1
 *
 */
Module.register("MMM-HeavenlyBodies", {

    // Module config defaults.
    defaults: {
        useHeader: true, // false if you don't want a header
        header: "Bodies of the Solar Sysem",
        maxWidth: "300px",
        rotateInterval: 2 * 60 * 1000,
        animationSpeed: 3000, // fade in and out speed
        initialLoadDelay: 4250,
        retryDelay: 2500,
        updateInterval: 60 * 60 * 1000,

    },

    getStyles: function() {
        return ["MMM-HeavenlyBodies.css"];
    },

    start: function() {
        Log.info("Starting module: " + this.name);

        // Set locale.
        this.Bodies = {};
        this.activeItem = 0;
        this.rotateInterval = null;
        this.scheduleUpdate();
    },

    getDom: function() {

        var wrapper = document.createElement("div");
        wrapper.className = "wrapper";
        wrapper.style.maxWidth = this.config.maxWidth;

        if (!this.loaded) {
            wrapper.innerHTML = "Perihelion means?";
            wrapper.classList.add("bright", "light", "small");
            return wrapper;
        }

        if (this.config.useHeader != false) {
            var header = document.createElement("header");
            header.classList.add("xsmall", "bright", "light", "header");
            header.innerHTML = this.config.header;
            wrapper.appendChild(header);
        }


        var Keys = Object.keys(this.Bodies);
        if (Keys.length > 0) {
            if (this.activeItem >= Keys.length) {
                this.activeItem = 0;
            }
            var Bodies = this.Bodies[Keys[this.activeItem]];
            // console.log(Bodies.density);


            var englishName = document.createElement("div");
            englishName.classList.add("small", "bright", "englishName");
            englishName.innerHTML = Bodies.englishName;
            wrapper.appendChild(englishName);

            var semimajorAxis = document.createElement("div");
            semimajorAxis.classList.add("small", "bright", "semimajorAxis");
            semimajorAxis.innerHTML = "Semimajor Axis = " + Bodies.semimajorAxis.toLocaleString() + " km";
            wrapper.appendChild(semimajorAxis);

        if (Bodies.perihelion != 0) {
            var perihelion = document.createElement("div");
            perihelion.classList.add("small", "bright", "perihelion");
            perihelion.innerHTML = "Perihelion = " + Bodies.perihelion.toLocaleString() + " km";
            wrapper.appendChild(perihelion);
          }

        if (Bodies.aphelion != 0) {
            var aphelion = document.createElement("div");
            aphelion.classList.add("small", "bright", "aphelion");
            aphelion.innerHTML = "Aphelion = " + Bodies.aphelion.toLocaleString() + " km";
            wrapper.appendChild(aphelion);
         }


         var eccentricity = document.createElement("div");
         eccentricity.classList.add("small", "bright", "eccentricity");
         eccentricity.innerHTML = "Orbital eccentricity = " + Bodies.eccentricity;
         wrapper.appendChild(eccentricity);


         var inclination = document.createElement("div");
         inclination.classList.add("small", "bright", "inclination");
         inclination.innerHTML = "Orbital inclination = " + Bodies.inclination + "°";
         wrapper.appendChild(inclination);


         var mass = document.createElement("div");
         mass.classList.add("small", "bright", "mass");
         mass.innerHTML = "Mass = " + Bodies.mass.massValue + " x 10" + `<sup>` + Bodies.mass.massExponent + `</sup>` + " kg";
         wrapper.appendChild(mass);


      if (Bodies.vol != null) {
         var volume = document.createElement("div");
         volume.classList.add("small", "bright", "volume");
         volume.innerHTML = "Volume = " + Bodies.vol.volValue + " x 10" + `<sup>` + Bodies.vol.volExponent + `</sup>` + " kg";
         wrapper.appendChild(volume);
       }

         var density = document.createElement("div");
         density.classList.add("small", "bright", "density");
         density.innerHTML = "Density = " + Bodies.density + " g.cm" + `<sup>`+ "3" + `</sup>`;
         wrapper.appendChild(density);


         var gravity = document.createElement("div");
         gravity.classList.add("small", "bright", "gravity");
         gravity.innerHTML = "Gravity = " + Bodies.gravity + " m.s" + `<sup>`+ "-2" + `</sup>`;
         wrapper.appendChild(gravity);


      if (Bodies.escape != 0) {
         var escape = document.createElement("div");
         escape.classList.add("small", "bright", "escape");
         escape.innerHTML = "Escape = " + Bodies.escape + " m.s" + `<sup>`+ "-1" + `</sup>`;
         wrapper.appendChild(escape);
       }


         var meanRadius = document.createElement("div");
         meanRadius.classList.add("small", "bright", "meanRadius");
         meanRadius.innerHTML = "Mean Radius = " + Bodies.meanRadius.toLocaleString() + " km";
         wrapper.appendChild(meanRadius);


         var equaRadius = document.createElement("div");
         equaRadius.classList.add("small", "bright", "equaRadius");
         equaRadius.innerHTML = "Equatorial Radius = " + Bodies.equaRadius.toLocaleString() + " km";
         wrapper.appendChild(equaRadius);


         var polarRadius = document.createElement("div");
         polarRadius.classList.add("small", "bright", "polarRadius");
         polarRadius.innerHTML = "Polar Radius = " + Bodies.polarRadius.toLocaleString() + " km";
         wrapper.appendChild(polarRadius);


         var sideralOrbit = document.createElement("div");
         sideralOrbit.classList.add("small", "bright", "sideralOrbit");
         sideralOrbit.innerHTML = "Sideral Orbit = " + Bodies.sideralOrbit + " Ea days";
         wrapper.appendChild(sideralOrbit);


         var sideralRotation = document.createElement("div");
         sideralRotation.classList.add("small", "bright", "sideralRotation");
         sideralRotation.innerHTML = "Sideral Rotation	 = " + Bodies.sideralRotation	 + " hours";
         wrapper.appendChild(sideralRotation);


         var aroundPlanet = document.createElement("div");
         aroundPlanet.classList.add("small", "bright", "planet");
         aroundPlanet.innerHTML = "Around Planet = " + Bodies.aroundPlanet.planet.charAt(0).toUpperCase() + Bodies.aroundPlanet.planet.slice(1);
         wrapper.appendChild(aroundPlanet);


      if (Bodies.discoveredBy != "") {
         var discoveredBy = document.createElement("div");
         discoveredBy.classList.add("small", "bright", "discoveredBy");
         discoveredBy.innerHTML = "Discovered by " + Bodies.discoveredBy;
         wrapper.appendChild(discoveredBy);
       }


       if (Bodies.discoveryDate != "") {
          var discoveryDate = document.createElement("div");
          discoveryDate.classList.add("small", "bright", "discoveryDate");
          discoveryDate.innerHTML = "Date discovered " + Bodies.discoveryDate;
          wrapper.appendChild(discoveryDate);
        }

      }
        return wrapper;
    },


    processBodies: function(data) {
        this.Bodies = data;
        console.log(this.Bodies); // checking my data
        this.loaded = true;
    },

    scheduleCarousel: function() {
        console.log("Carousel of Boobies!");
        this.rotateInterval = setInterval(() => {
            this.activeItem++;
            this.updateDom(this.config.animationSpeed);
        }, this.config.rotateInterval);
    },

    scheduleUpdate: function() {
        setInterval(() => {
            this.getBodies();
        }, this.config.updateInterval);
        this.getBodies(this.config.initialLoadDelay);
    //    var self = this;
    },

    getBodies: function() {
        this.sendSocketNotification('GET_BODIES');
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === "BODIES_RESULT") {
            this.processBodies(payload);
            if (this.rotateInterval == null) {
                this.scheduleCarousel();
            }
            this.updateDom(this.config.animationSpeed);
        }
        this.updateDom(this.config.initialLoadDelay);
    },
});
