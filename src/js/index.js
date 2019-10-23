import '../styles/main.scss'; //IMPORT SASS
import "babel-polyfill"; //IMPORT BABEL FOR ASYNC/AWAIT

import Data from './Models/data'
import Map from './views/map'
import { htmlElements, disableEnableButtons } from './views/base'


const state = {};

const mapsCtrl = async () =>{

    //1. GET DATA 
    state.data = new Data;
    // await state.data.getDataFromCSV();
    await state.data.getHappinessData();
    await state.data.getWorldGeoJSON();
    await state.data.mergeData();
    await state.data.removeCountryWithoutData();
    await state.data.newRankNumbers();

    //2. BUILD MAP
    state.map = new Map;
    state.map.renderMap();

    const variable = state.data.getCurrenVariable();

    state.map.createPolygon(state.data.mapGeoData, variable);

    // console.log(state.data)
    // console.log(state.map)
};

mapsCtrl()


//FILTER CONITNENTS ON MAP
const filterContinents = (event) => {
    if(event.target.classList[0] === "checkbox__input"){
        //change dataConfig
        const continent = event.target.id.replace("countrVar--","")
        state.data.dataConfig.continents[continent] = event.target.checked;
        state.data.filterMapGeoData(); 

        //GET CURRENT VARIABLE
        const variable = state.data.getCurrenVariable();

        state.map.removePolygon();
        state.map.createPolygon(state.data.mapGeoData, variable);
    }
};

//CHANGE VARIABLE ON MAP
const changeVariable = (event) => {
    if(event.target.classList[0] === "radio__input"){
        const variable = event.target.id.replace("happinessVar--",""); //read clicked button

        //change state data config
        state.data.changeVariable(variable);

        state.map.removePolygon();
        state.map.createPolygon(state.data.mapGeoData, variable); //add variable and create new polygon
    }
};

//TOP MODE
const activateTopMode = (event) => {

    if (!state.data.dataConfig.topMode){
        state.data.dataConfig.topMode = event.target.checked;
    
        const totalCountryCount = state.data.finalGeoData.features.length;
        htmlElements.topModeInput.max = totalCountryCount;

        //ENABLE SLIDER
        htmlElements.topModeInput.disabled = false;

        //DISABLE OTHER BUTTONS
        disableEnableButtons('disable')

        //FILTER ALL COUNTRY
        state.data.filterTopMode();        
        //SET MAP
        state.map.removePolygon();
        state.map.createPolygonTopMode(state.data.mapGeoData, 10)
    }else{
        state.data.dataConfig.topMode = event.target.checked;

        //DISABLE SLIDER
        htmlElements.topModeInput.disabled = true;

        //ENABLE BUTTONS
        disableEnableButtons('enable')

        //FILTER COUNTRY
        state.data.filterMapGeoData();
        
        //SET MAP
        state.map.removePolygon();
        state.map.createPolygon(state.data.mapGeoData);
    }
};

//TOP MODE CHANGE
const changeTopMode = (event) => {

    const inputValue = event.target.value;
    const labelDiv = htmlElements.topModeLabel;

    labelDiv.textContent = inputValue;

    //SET MAP
    state.map.removePolygon();
    state.map.createPolygonTopMode(state.data.mapGeoData, inputValue)
};

//EVENT LISTENERS
htmlElements.continentsButtons.addEventListener('click', filterContinents);
htmlElements.variablesButtons.addEventListener('change', changeVariable);
htmlElements.topCountryButton.addEventListener('click', activateTopMode)
htmlElements.topModeInput.addEventListener('change', changeTopMode);