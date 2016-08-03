# parse-medication-table-data

This project is to illustrate the use of the PAPAPARSE CSV table file parser, and UNDERSCORE.JS library,  and a downstream application to use the output JSON objects to create queries to construct a small Neo4j graph database. Only the Neo4j Cypher queries are output, which can be used to feed a Neo4j instance to build the graph. This project also uses the MATERIALIZE.CSS framework.

## Notes on the project
1. This project is stand alone.
2. A MeteorJS version will be added to demonstrate the connection to cloud-hosted Neo4j database instance.
3. The table files are obtained from the HealthCanada publicly-available drug database.
4. Only a two files are used, with subset of data in each:
   (a) COMP.TXT - includes drug company data, and 
   (b) DRUG.TXT - includes drug data.


## How to run the project
1. Download repository ZIP file, and unzip it. It will unzip to, say, the "parse-medication-table-data" folder.
2. Browse to the "parse-medication-table-data/html" subfolder.
3. Open "index.html" in the browser (tested in chrome, and FireFox).
4. Load the database sample files from the "DPDFiles" sub-folder. Start with the "COMP.TXT" file first, and then "DRUG.TXT".
5. If both files are loaded successfully, the two main functionality of this example will become available:
    (a) Display drug brand name, and manufacturer data, and 
    (b) Generate Neo4j Cypher queries to create nodes representing drug, and drug companies, and their relationships.
