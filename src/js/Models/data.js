//IMPORT PACKAGE
import Papa from "papaparse";
import { happinessData } from './happinessData'

//LOCATION DATA
const world = require('../locationData/world.json');


export default class Data{
    constructor(){
        this.dataConfig = {
            continents: {
                europe: true,
                americas: true,
                asia: true,
                africa: true,
                oceania: true,
            },
            variables: {
                family: true,
                freedom: false,
                gdpPerCapita: false,
                generosity: false,
                lifeExpectancy: false,
                trusGovermentCorruption: false,
                happinessScore: false
            },
            topMode: false
        };
    }

    //GET DATA FROM CSV FILE
    async getDataFromCSV(){

        //1. GET DATA - NOW FROM FILE IN BROWSER LATER ON NODE AND SEND BY API TO USER
        const csvFile = await require('../../data/2017.csv'); //this line change csv into URL which are able to fetch
        //2. FETCH DATA
        const result = await fetch(csvFile);
        //3. CHANGE TO TEXT
        const data = await result.text();
        //4. LAUNCH FUNCTION WHICH WILL CHANGE CSV INTO ARRAY OF OBJECTS
        this.parseCSVData(data);

    }
    //PARSE CSV DATA INTO ARR OF OBJECTS
    async parseCSVData(data){
        //1. PARSE WITH PAPA PARSE TO ARRAYS
        let finalData = Papa.parse(data)

        //2. SAVE FIRST ARRAY AS COL NAMDES
        // const colNames = await finalData.data.slice(0,1)[0];
        // const colNames = ["Country", "Happiness.Rank", "Happiness.Score", "Whisker.high", "Whisker.low", "Economy..GDP.per.Capita.", "Family", "Health..Life.Expectancy.", "Freedom", "Generosity", "Trust..Government.Corruption.", "Dystopia.Residual"];
        const colNames = ['country', 'happinessRank', 'happinessScore', 'whiskerHigh', 'whiskerLow', 'gdpPerCapita', 'family', 'lifeExpectancy', 'freedom', 'generosity', 'trusGovermentCorruption', 'dystopiaResidual',]; //better names for object

        //3. SAVE THE ACTUAL DATA
        // finalData = finalData.data.slice(1,5); //TESTING
        finalData = finalData.data.slice(1); //WHOLE DATA

        // console.log(colNames); //TESTING
        // console.log(finalData); //TESTING

        //4. CREATE OBJ FROM ARRAYS
        //arr to contain each country
        let modifyArr = []; 
            //loop through each array
            finalData.forEach( (el) => {
                //obj for each country
                const tempObj = {};
                //loop through each elements in country array
                el.forEach( (minEl, index) => {
                    //d. read values based on col index and saved value for current city
                    tempObj[colNames[index]] = minEl
                })
                //push data to arrays
                modifyArr.push(tempObj);
            });

        // //save data in object
        this.happinessData = modifyArr;
    }

    getHappinessData(){
        this.happinessData = happinessData;
    }

    getWorldGeoJSON(){
        this.geoData = world;
    }

    mergeData(){

        //1. SAVE VARIABLE TO WORK WITH 
        // const workGeoData = this.geoData.features.slice(0,40); //testing
        const workGeoData = [...this.geoData.features];
        const workHappinessData = [...this.happinessData];

        //2. MATCH DATA FROM TWO OBJECTS
        //loop through each country in geoJSON
        workGeoData.forEach( (geoEl)=>{
            //loop through all data in happinessData

            workHappinessData.forEach((happyEl) => {
                // console.log(happyEl.Country);

                //found same country in second arr
                if(geoEl.properties.name === happyEl.country){

                    // console.log("ZNALEZIONO");
                    //want to keep those two properties
                    const region = geoEl.properties.region_un;
                    const subregion = geoEl.properties.subregion;

                    //change properties  for country
                    geoEl.properties = happyEl;

                    //save two needed property
                    geoEl.properties.region = region;
                    geoEl.properties.subregion = subregion;
                }
            })
        });  

        //3. CREATE GEOJSON OBJECT
        this.finalGeoData = {
            type: "FeatureCollection",
            features: workGeoData
        };

        //4. REMOVE USELESS DATA 
        delete this.happinessData;
        delete this.geoData;
    }

    removeCountryWithoutData(){
        //1. SAVE DATA TO VARIABLE
        let data = [...this.finalGeoData.features]; //without rest operator splice will change two arrays;
        //2. CHECK ALL COUNTRY. IF NO HAPPY DATA THEN REMOVE FROM OBJ
        const finalData = data.filter( el => typeof el.properties.country === 'string')
        // //3. RETURN ARR AFER CHANGES
        this.finalGeoData.features = finalData; 

        this.mapGeoData = {
            type: "FeatureCollection",
            features: finalData
        };
    }

    changeVariable(variable){
        const obj =  this.dataConfig.variables;

        //reset all  keys to false
        for (let key in obj){
            obj[key] = false
        };

        // set selected key to true 
        for (let key in obj){
            if(key === variable){
                obj[key] = true;
            }
        };

    }

    getCurrenVariable(){

        const obj =  this.dataConfig.variables;
        let variable;

        for (let key in obj){
            if(obj[key] === true){
                variable = key;
            }
        };

        return variable;
    }

    //FILTER DATA ACORDING TO CURRENT USER SPECIFICATION
    filterMapGeoData(){
        const data = [... this.finalGeoData.features];

        //THINK ABOUTR BETTER SOLUTION
        let finalData = [];
        if(this.dataConfig.continents.europe === true){
            const continentData = data.filter( el => el.properties.region === "Europe");
            finalData = [...finalData, ...continentData];
        }
        if(this.dataConfig.continents.americas === true){
            const continentData = data.filter( el => el.properties.region === "Americas");
            finalData = [...finalData, ...continentData];
        }
        if(this.dataConfig.continents.asia === true){
            const continentData = data.filter( el => el.properties.region === "Asia");
            finalData = [...finalData, ...continentData];
        }
        if(this.dataConfig.continents.africa === true){
            const continentData = data.filter( el => el.properties.region === "Africa");
            finalData = [...finalData, ...continentData];
        }
        if(this.dataConfig.continents.oceania === true){
            const continentData = data.filter( el => el.properties.region === "Oceania");     
            finalData = [...finalData, ...continentData];
        }

        this.mapGeoData.features = finalData; //CHANGE TO NEW DATA
    }

    //CREATE DATA FOR MAP FOR TOP MODE
    filterTopMode(){
        this.mapGeoData.features = [... this.finalGeoData.features];
    }

    //RANKING IS NOT COMPLETE SO FIX HAPPINESSRANK
    newRankNumbers(){
        const countries = this.mapGeoData.features;
        
        countries.sort((a,b) => parseInt(a.properties.happinessRank) - parseInt(b.properties.happinessRank))
       
        for(let i=1; i<=countries.length; i++){
            try{
                let diff = parseInt(countries[i+1].properties.happinessRank) - parseInt(countries[i].properties.happinessRank);
                if(diff > 1){
                    countries[i+1].properties.happinessRank = parseInt(countries[i].properties.happinessRank) + 1
                }
            }
            catch(err){
                // console.log(err);
            }
        }
    }
}

