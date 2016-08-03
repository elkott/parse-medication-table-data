var pDPFiles=[];

var pharmaceuticalCompaniesRawList;
var pharmaceuticalCompanies=[];
var pharmaceuticalCompaniesGroupedList;

var medsList;
var medsGroupedList;
var medsGroupedByBrand;
var medsGroupedByPediatricFlag;
var medsBrandNamesAndDrugCodes=[];
var medsBrandNames=[];
var drugIngredients;

var cypherQueries_medsBrandNames=[];
var cypherQueries_meds=[];
var cypherQueries_drugCompaniesAndAddresses="";


var companiesAndMeds;

// PapaParse configuration settings object
var parserConfig = {
  delimiter: "", // auto-detect
  newline: "", // auto-detect
  header: true,
  dynamicTyping: false,
  preview: 0,
  encoding: "",
  worker: false,
  comments: false,
  step: undefined,
  complete: undefined,
  error: undefined,
  download: false,
  skipEmptyLines: false,
  chunk: undefined,
  fastMode: undefined,
  beforeFirstChunk: undefined,
  withCredentials: undefined
}

var drugDataMessage = document.querySelector('#drugDataMessage');
var cypherQueries = document.querySelector('#cypherQueries');
