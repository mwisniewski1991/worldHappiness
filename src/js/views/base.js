//HTML MARKDOWN
export const htmlElements = {
    continentsButtons: document.querySelector("#countrVar--container"),
    variablesButtons: document.querySelector("#variables--container"),
    topCountryButton: document.querySelector("#topCountryButton"),    
    topModeInput: document.querySelector("#topModeInput"),    
    topModeLabel: document.querySelector("#topModeLabel")    
};


//CHANGE COLORS FOR COUNTRY 
export const shadeColor = (color, percent) => {

    var R = parseInt(color.substring(1,3),16);
    var G = parseInt(color.substring(3,5),16);
    var B = parseInt(color.substring(5,7),16);

    R = parseInt(R * (100 + percent) / 100);
    G = parseInt(G * (100 + percent) / 100);
    B = parseInt(B * (100 + percent) / 100);

    R = (R<255)?R:255;  
    G = (G<255)?G:255;  
    B = (B<255)?B:255;  

    var RR = ((R.toString(16).length==1)?"0"+R.toString(16):R.toString(16));
    var GG = ((G.toString(16).length==1)?"0"+G.toString(16):G.toString(16));
    var BB = ((B.toString(16).length==1)?"0"+B.toString(16):B.toString(16));

    // return "#"+RR+GG+BB;
    return `#${RR}${GG}${BB}`;
}


//GET COLOR FOR CONUTRY BASED OON PERCENTAGE VALUE
export const getColor = (percent) =>{
    switch(true){
        case (percent <= 25):
            return "#0AFF00";
            break;
        case (percent <= 50):
            return "#2EABFF";
            break;
        case (percent <= 75):
            return "#FF6A0A";
            break;
        case (percent <= 100):
            return "#C20000";
            break;
    }
}


//FIND MAX VALUE OF ONE VRIABLE
export const getMax = (obj, variable) => {

    const countries = obj.features;

    const varArr = countries.map( country => {
        return country.properties[variable];
    })

    // //FIND MAX VALUES
    const maxvalue = Math.max(...varArr);
    return maxvalue
};

//CALCULETE DIFFRENCE
export const calculateDiffrence = (maxValue, countryValue) => {
    const perDiffrence = Math.round(((maxValue - countryValue) / maxValue) * 100,0) * -1
    return perDiffrence
};


//DISABLE OR ENABLE BUTTON
export const disableEnableButtons = (type) => {

    //DISABLE OR ENABLE DEPENDS ON ARGUMENT
    const onOrOff = type === 'disable' ? true : false  

    const continentsButtons = Array.from(htmlElements.continentsButtons.querySelectorAll(".checkbox__input"));
    continentsButtons.forEach(el => el.disabled = onOrOff);

    const variableButtons = Array.from(htmlElements.variablesButtons.querySelectorAll(".radio__input"));
    variableButtons.forEach(el =>el.disabled = onOrOff);

};