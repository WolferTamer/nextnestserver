const MetaData = {
    "lat": {
      name:"Latitude",
      prefix:"",
      suffix:"",
      forceinclude: false
    },
    "name": {
      name:"Name",
      prefix:"",
      suffix:"",
      forceinclude: true
    },
    "state": {
      name:"State",
      prefix:"",
      suffix:"",
      forceinclude: false
    },
    "statecode": {
      name:"State",
      prefix:"",
      suffix:"",
      forceinclude: true
    },
    "lon": {
      name:"Longitude",
      prefix:"",
      suffix:"",
      forceinclude: false
    },
    "density": {
      name:"Density",
      prefix:"",
      suffix:"/mile^2",
      forceinclude: true
    },
    "growth": {
      name:"Growth",
      prefix:"",
      suffix:"%",
      operator: (e) => Math.floor(parseFloat(e)*10000)/100,
      forceinclude: true
    },
    "population": {
      name:"Population",
      prefix:"",
      suffix:"",
      forceinclude: true
    },
    "id": {
      name:"ID",
      prefix:"",
      suffix:"",
      forceinclude: true
    },
    "julytemp": {
        name:"Summer Temp",
        prefix:"",
        suffix:" °F",
        operator: (e) => (parseInt(e) - 273.15) * 9/5 + 32,
        forceinclude: true
    },
    "jantemp": {
        name:"Winter Temp",
        prefix:"",
        suffix:" °F",
        operator: (e) => (parseInt(e) - 273.15) * 9/5 + 32,
        forceinclude: true
    },
    "julyprecipitation": {
        name:"Precipitation",
        prefix:"",
        suffix:"m",
        forceinclude: true
    },
    "julyhumidity": {
        name:"Humidity",
        prefix:"",
        suffix:"",
        forceinclude: true
    },
    "bracket": {
        name:"Bracket",
        prefix:"$",
        suffix:"",
        forceinclude: true
    },
    "rate": {
        name:"Tax Rate",
        prefix:"",
        suffix:"%",
        forceinclude: true
    },
    "salestax": {
        name:"Sales Tax",
        prefix:"",
        suffix:"%",
        operator: (e) => Math.floor(parseFloat(e)*10000)/100,
        forceinclude: true
    }
    
  }

export default MetaData