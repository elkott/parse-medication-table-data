function isPharmaceuticalCompaniesFile(fileName) {
  return fileName === "comp.txt";
}

function isMedsFile(fileName) {
  return fileName === "drug.txt";
}

function displayFileParsingSuccess(message) {
  Materialize.toast(message, 2000, '');
}

function obtainDrugDataForDrugCompanies(pharmaceuticalCompanyObject) {
  _.each(pharmaceuticalCompanyObject, function(pharmaCoObjectArrayElement) {
    var medObject = _.find(medsList, function(medsListObj) {
      return medsListObj.drugCode == pharmaCoObjectArrayElement.drugCode
    });
    if (medObject != undefined) {
      pharmaCoObjectArrayElement.medBrandName = medObject.brandName;
      pharmaCoObjectArrayElement.drugCode = medObject.drugCode;
    } else {
      return;
    }
  });
}

function obtainDrugCompanyData(pharmaceuticalCompanyObject) {
  if (pharmaceuticalCompanyObject[0].companyCode != undefined) {
    pharmaceuticalCompanies.push({
      companyName: pharmaceuticalCompanyObject[0].companyName,
      mfrCode: pharmaceuticalCompanyObject[0].mfrCode,
      companyCode: pharmaceuticalCompanyObject[0].companyCode,
      companyType: pharmaceuticalCompanyObject[0].companyType,
      address: {
        suiteNumber: pharmaceuticalCompanyObject[0].suiteNumber,
        streetAddress: pharmaceuticalCompanyObject[0].streetAddress,
        city: pharmaceuticalCompanyObject[0].city,
        province: pharmaceuticalCompanyObject[0].province,
        postalCode: pharmaceuticalCompanyObject[0].postalCode,
        country: pharmaceuticalCompanyObject[0].country,
        pOBox: pharmaceuticalCompanyObject[0].pOBox,
      }
    });
    cypherQueries_drugCompaniesAndAddresses += getCypherQuery_CreateDrugCompany(pharmaceuticalCompanyObject[0]);
  }
}

function getDrugCompaniesAndAddressesQueries() {
  cypherQueries.innerHTML = cypherQueries_drugCompaniesAndAddresses;
  $('body').scrollTo('#cypherQueriesLable');
}

function getCypherQuery_CreateDrugCompany(drugCompanyObject) {
  var query;

  function getBasicData(drugCompanyObject) {
    return "CREATE(drugCompany_" + drugCompanyObject.companyCode + ":DrugCompany" + "{" + "companyName:\'" + drugCompanyObject.companyName + "\'," + "mfrCode:\'" + drugCompanyObject.mfrCode + "\'," + "companyCode:\'" + drugCompanyObject.companyCode + "\'," + "companyType:\'" + drugCompanyObject.companyType + "\'})" + "<br/>";
  }

  function getAddressData(drugCompanyObject) {
    return "CREATE(address_" + drugCompanyObject.companyCode + ":Address" + "{" + "forCompany:\'" + drugCompanyObject.companyCode + "\'," + "suiteNumber:\'" + drugCompanyObject.suiteNumber + "\'," + "streetAddress:\'" + drugCompanyObject.streetAddress + "\'," + "city:\'" + drugCompanyObject.city + "\'," + "province:\'" + drugCompanyObject.province + "\'," + "postalCode:\'" + drugCompanyObject.postalCode + "\'," + "country:\'" + drugCompanyObject.country + "\'," + "pOBox:\'" + drugCompanyObject.pOBox + "\'})" + "<br/>";
  }

  function getCompanyToAddressLink(drugCompanyObject) {
    // return "MATCH (c:DrugCompany {companyCode:\'" + drugCompanyObject.companyCode + "\'})" + " " + "MATCH (a:Address {forCompany:\'" + drugCompanyObject.companyCode + "\'})" + " " + "CREATE (c)-[:HAS_ADDRESS " + "{" + "isMailingAddress:\'" + drugCompanyObject.isMailingAddress + "\'," + "isBillingAddress:\'" + drugCompanyObject.isBillingAddress + "\'," + "isNotificationAddress:\'" + drugCompanyObject.isNotificationAddress + "\'," + "isOtherAddress:\'" + drugCompanyObject.isOtherAddress + "\'" + "}]->(a);" + "<br/>";
    return "CREATE (drugCompany_" + drugCompanyObject.companyCode + ")" +
      "-[:HAS_ADDRESS " + "{" + "isMailingAddress:\'" + drugCompanyObject.isMailingAddress + "\'," + "isBillingAddress:\'" + drugCompanyObject.isBillingAddress + "\'," + "isNotificationAddress:\'" + drugCompanyObject.isNotificationAddress + "\'," + "isOtherAddress:\'" + drugCompanyObject.isOtherAddress + "\'" + "}]->" + "(address_" + drugCompanyObject.companyCode + ")" + "<br/>";
  }
  query = getBasicData(drugCompanyObject) + getAddressData(drugCompanyObject) + getCompanyToAddressLink(drugCompanyObject);
  return query;
}

function getCypherQuery_CreateMedBrandName(medBrandName, index) {
  return "CREATE(medBrandName_" + index.toString() + ":BrandName " + "{brandName:\'" + medBrandName + "\'});";
}

function getBrandNameQueries() {
  var cypherQueriesString = "";
  if (cypherQueries_medsBrandNames.length == 0) {
    var index = 0;
    _.each(medsBrandNames, function(medBrandName) {
      if (medBrandName != undefined) {
        cypherQueriesString += getCypherQuery_CreateMedBrandName(medBrandName, index) + "<br/>";
        index++;
      }
    });
  }
  cypherQueries.innerHTML = cypherQueriesString;
  $('body').scrollTo('#cypherQueriesLable');
}

function getCypherQuery_CreateDrug(drugObject) {
  if (drugObject.drugCode.length != 0) {
    var drugLabels = "";
    drugLabels = ":DRUG" + " :" + drugObject.class.toUpperCase() + " ";

    return "CREATE(drug_" + drugObject.drugCode.toString() + drugLabels + "{drugCode:\'" + drugObject.drugCode + "\'," + "pediatricFlag:\'" + drugObject.pediatricFlag + "\'," + "DIN:\'" + drugObject.DIN + "\'," + "aIGroupNumber:\'" + drugObject.aIGroupNumber + "\'," + "accessionNumber:\'" + drugObject.accessionNumber + "\'," + "lastUpdateDate:\'" + drugObject.lastUpdateDate + "\'," + "productCategorization:\'" + drugObject.productCategorization + "\'" + "}) <br/>";
  }
}

function getDrugQueries() {
  var cypherQueriesString = "";
  if (cypherQueries_meds.length == 0) {
    _.each(medsList, function(drugObject) {
      if (drugObject != undefined)
        cypherQueriesString += getCypherQuery_CreateDrug(drugObject);
    })
  }
  cypherQueries.innerHTML = cypherQueriesString;
  $('body').scrollTo('#cypherQueriesLable');
}


function getCypherQuery_CreateBrandNameAndDrugCodeRelationship(medsBrandNameAndDrugCodeObj, index) {
  var query = "";
  _.each(medsBrandNameAndDrugCodeObj.drugCodes, function(drugCode) {
    query += "MATCH(brand_" + index + ":BrandName {brandName:\'" + medsBrandNameAndDrugCodeObj.brandName + "\'}) <br/>";
    query += "MATCH(drug_" + drugCode + ":DRUG {drugCode:\'" + drugCode + "\'}) <br/>";
    query += "CREATE(drug_" + drugCode + ")-[:HAS_BRAND_NAME]->(brand_" + index + "); <br/>";
  });
  return query;
}

function getDrugAndBrandNameRelationshipQueries() {
  var cypherQueriesString = "";
  if (medsBrandNamesAndDrugCodes.length > 0) {
    var index = 0;
    _.each(medsBrandNamesAndDrugCodes, function(medsBrandNameAndDrugCodeObj) {
      if (medsBrandNameAndDrugCodeObj != undefined) {
        cypherQueriesString += getCypherQuery_CreateBrandNameAndDrugCodeRelationship(medsBrandNameAndDrugCodeObj, index);
        index++;
      }
    });
  }
  cypherQueries.innerHTML = cypherQueriesString;
  $('body').scrollTo('#cypherQueriesLable');
}

function getCypherQuery_CreateCompanyAndBrandNameRelationship(pharmaceuticalCompanyAndDrugsObj, index) {
  if (pharmaceuticalCompanyAndDrugsObj[0].drugCode.length > 0) {
    var query = "";
    _.each(pharmaceuticalCompanyAndDrugsObj, function(companyAndDrugObject) {
      query += "MATCH(brand_" + companyAndDrugObject.drugCode + ":BrandName {brandName:\'" + companyAndDrugObject.medBrandName + "\'}) <br/>";
      query += "MATCH(company_" + index + ":DrugCompany {companyName:\'" + companyAndDrugObject.companyName + "\'}) <br/>";
      query += "CREATE UNIQUE (company_" + index + ")-[:PRODUCES_DRUG]->(brand_" + companyAndDrugObject.drugCode + "); <br/>";
    });
    return query;
  }
}

function getCompaniesAndBrandNameRelationshipQueries() {
  var cypherQueriesString = "";
  if (pharmaceuticalCompaniesGroupedList != undefined) {
    var index = 0;
    _.each(pharmaceuticalCompaniesGroupedList, function(pharmaceuticalCompanyAndDrugsObj) {
      cypherQueriesString += getCypherQuery_CreateCompanyAndBrandNameRelationship(pharmaceuticalCompanyAndDrugsObj, index);
    });
  }
  cypherQueries.innerHTML = cypherQueriesString;
  $('body').scrollTo('#cypherQueriesLable');
}


function parsePDPFile(file) {
  if (/\.(txt)$/i.test(file.name)) {
    var reader = new FileReader();
    reader.readAsText(file, "UTF-8");

    reader.onload = function(evt) {
      console.log("Parsing --- " + file.name);

      if (isPharmaceuticalCompaniesFile(file.name)) {
        pharmaceuticalCompaniesRawList = Papa.parse(evt.target.result, parserConfig).data;
        pharmaceuticalCompaniesGroupedList = _.groupBy(pharmaceuticalCompaniesRawList, 'companyCode');
        _.each(pharmaceuticalCompaniesGroupedList, obtainDrugCompanyData);
        console.log("            " + "SUCCESS!");
        displayFileParsingSuccess('Pharmaceutical Companies Data Read Successfully');
      }

      if (isMedsFile(file.name)) {
        if (pharmaceuticalCompaniesRawList == undefined) {
          $('#modal1').openModal();
          return;
        }
        else {
          medsList = Papa.parse(evt.target.result, parserConfig).data;
          medsGroupedByBrand = _.groupBy(medsList, 'brandName');
          medsGroupedByPediatricFlag = _.groupBy(medsList, 'pediatricFlag');
          _.each(medsGroupedByBrand, function(medsObject) {
            medsBrandNames.push(medsObject[0].brandName);
          });
          medsBrandNames = _.uniq(medsBrandNames);

          _.each(medsBrandNames, function(medBrandName) {
            var medAndDrugObject = _.find(medsGroupedByBrand, function(medObject) {
              return medObject[0].brandName === medBrandName;
            });
            if (medAndDrugObject != undefined) {
              var medObject = {};
              medObject.brandName = medBrandName;
              medObject.drugCodes = [];
              _.each(medAndDrugObject, function(matchMedObject) {
                medObject.drugCodes.push(matchMedObject.drugCode);
              });
              medsBrandNamesAndDrugCodes.push(medObject);
            }
          });

          if (pharmaceuticalCompaniesGroupedList != undefined && medsList.length > 1) {
            _.each(pharmaceuticalCompaniesGroupedList, obtainDrugDataForDrugCompanies);
            $('#queryForms').show();
            $('#getDrugDataTab').removeClass('active');
            $('#getGraphQueriesTab').removeClass('active');
            $('#getDrugDataTab').addClass('active');
          }
          console.log("            " + "SUCCESS!");
          displayFileParsingSuccess('Drug Data Read Successfully');
        }
      }
    }
    reader.onerror = function(evt) {
      displayFileParsingSuccess('Error Parsing -- ' + file.name);
    }
  } else {
    return;
  }
}


function getDrugData(drugCode) {
  if (drugCode.length > 0) {
    var drugObject;
    var drugProducer;

    if (medsList.length > 1) {
      drugObject = _.filter(medsList, function(obj) {
        return obj.drugCode == drugCode;
      });
    }

    if (pharmaceuticalCompaniesRawList) {
      drugProducer = _.filter(pharmaceuticalCompaniesRawList, function(companyObj) {
        return companyObj.drugCode == drugCode;
      });
      console.log(drugProducer);
    }


    drugDataMessage.innerHTML = "";
    drugDataMessage.innerHTML += "Medication:        " + drugObject[0].brandName + "<br/>";
    drugDataMessage.innerHTML += "Producer:          " + "<br/>";
    drugDataMessage.innerHTML += "<span class=\"company-name-span\">" + drugProducer[0].companyName + " -- " + drugProducer[0].streetAddress + ", " + drugProducer[0].suiteNumber + ", " + drugProducer[0].city + ", " + drugProducer[0].province + ", " + drugProducer[0].postalCode + ", " + drugProducer[0].country + "</span><br/>";
  }
}

$("#getDrugData").mouseup(function() {
  var drugCode = $('#drugCode').val();
  getDrugData(drugCode);
});

$("#getDrugCompaniesAndAddressesQueries").mouseup(function() {
  getDrugCompaniesAndAddressesQueries();
});

$("#getBrandNameQueries").mouseup(function() {
  getBrandNameQueries();
});

$("#getDrugQueries").mouseup(function() {
  getDrugQueries();
});


$("#getDrugAndBrandNameRelationshipQueries").mouseup(function() {
  getDrugAndBrandNameRelationshipQueries();
});

$("#getCompaniesAndBrandNameRelationshipQueries").mouseup(function() {
  getCompaniesAndBrandNameRelationshipQueries();
});

function readPDPFilesList() {
  pDPFiles = document.querySelector('input[type=file]').files;
  if (pDPFiles.length > 0) {
    return true;
  } else {
    return false;
  }
}

function parseAllPDPFiles() {
  fileParseMessage.innerHTML = "";
  for (var i = 0; i < pDPFiles.length; i++) {
    parsePDPFile(pDPFiles[i]);
  }
}

function readAndParsePDPFiles() {
  if (readPDPFilesList()) {
    for (var i = 0; i < pDPFiles.length; i++) {
      parsePDPFile(pDPFiles[i]);
    }
  } else {
    return;
  }
}
