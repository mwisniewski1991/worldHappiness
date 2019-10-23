import * as L from 'leaflet';
import { getMax, calculateDiffrence, shadeColor, getColor } from './base.js'


export default class Map{
    constructor(){
      //group of elemnts which will be add to map
      this.mapsElements = {};

    }

    renderMap(){
        //CREATE MAPS
        this.map = L.map('mapid')
    
        //SETTING NECCESERY FOR MAPS
        const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'; //layer for map 
        const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'; //who is contributor
        const tiles = L.tileLayer(tileUrl, { attribution }); //add data to map
    
        //ADDS TO MAPS
        tiles.addTo(this.map);
    
        //SET VIEW
        this.map.setView([18,0],1.5)
    };
    
    createMarkers(arr){

        arr.forEach( ({name, lat, lon}) => {
            //CREATE MARKERS
            let marker = L.marker([lat, lon],{
                opacity: .8
            })
            
            //ADD MARKERS TO MAP
            marker.addTo(this.map);
    
            //ADD POP UP
            marker.bindPopup(name);
    
        });
    };
    
    createPolygon(dataGeoJSON, variable="family"){

        // console.log(dataGeoJSON.features.slice(0,5)); //test
 
        //CREATE LAYER WITH OPTIONS
        const continentsLayer = L.geoJSON(dataGeoJSON, {
            style: function(feature) {  

                const maxValue = getMax(dataGeoJSON, variable);
                const countryValue = parseFloat(feature.properties[variable]);
                const perDiffrences = calculateDiffrence(maxValue, countryValue);
                // const color = shadeColor("#0AFF00", perDiffrences);

                const color = getColor(perDiffrences * -1);         
                return {color: color}
            },
            opacity: 1,
            fillOpacity: .25,
            weight: 1,
            onEachFeature: function (feature, layer) {
                layer.on('mouseover', function () {
                    this.setStyle({
                        'fillColor': shadeColor(layer.options.color, -50)
                    });
                });
                layer.on('mouseout', function () {
                  this.setStyle({
                    'fillColor': layer.options.color
                  });
                }),
                layer.on('click', function () {
                    // Let's say you've got a property called url in your geojsonfeature:
                });

                //POP UP DATA
                const arr = dataGeoJSON.features.map( el => el.properties[variable])
                const maxValue = Math.max(...arr);

                //CREATE CUTOM popup
                const textMarkup = `${feature.properties.country} - ${feature.properties.region} </br>
                                Value: ${parseFloat(feature.properties[variable]).toFixed(3)} </br>
                                Max: ${parseFloat(maxValue).toFixed(3)}`;

                const popUp = L.popup({}).setContent(textMarkup);

               //BIND POPUP TO LAYER
                layer.bindPopup(popUp);
            }
        })
        
        //ADD TO STATE
        this.mapsElements.geoJsonLayer = continentsLayer;
        //ADD TO MAP
        continentsLayer.addTo(this.map);
    }

    createPolygonTopMode(dataGeoJSON, counter){

        // console.log(dataGeoJSON.features.slice(0,5)); //test
 
        //CREATE LAYER WITH OPTIONS
        const continentsLayer = L.geoJSON(dataGeoJSON, {
            style: function(feature) {  
                const countryValue = parseInt(feature.properties.happinessRank);
                let color = "";
                if(countryValue <= counter){
                    color="#4cd137";
                }
                else{
                    color="#e84118";
                }
                return {color: color}
            },
            opacity: 1,
            fillOpacity: .25,
            weight: 1,
            onEachFeature: function (feature, layer) {
                layer.on('mouseover', function () {
                  this.setStyle({
                    'fillColor': shadeColor(layer.options.color, -50)
                  });
                });
                layer.on('mouseout', function () {
                  this.setStyle({
                    'fillColor': layer.options.color
                  });
                });
                layer.on('click', function () {
                  // Let's say you've got a property called url in your geojsonfeature:
                });

                //CREATE CUTOM popup
                const textMarkup = `${feature.properties.country} - ${feature.properties.region} </br>
                                    Rank: ${feature.properties.happinessRank}`;

                const popUp = L.popup({}).setContent(textMarkup);
               //BIND POPUP TO LAYER
                layer.bindPopup(popUp);
              }
        })
        
        //ADD TO STATE
        this.mapsElements.geoJsonLayer = continentsLayer;
        //ADD TO MAP
        continentsLayer.addTo(this.map);
    }
    
    removePolygon(){
        this.mapsElements.geoJsonLayer.remove()
    }
}



