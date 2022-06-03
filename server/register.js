'use strict';

const knex = require('knex')
module.exports = async ({ strapi }) => {
  strapi.postgis={
    enabled:false,
    spatialColumns: [],
    spatialTables: {}
  }

  if (strapi.config.database.connection.client !== 'postgres') {
    strapi.log.info(`Only postgres client type is supported!`);
    return;
  };



  //lets try enabling postgis on the databas
  try {
    const pg = knex(strapi.config.database.connection);
  
    const pgManagerService = await strapi.plugin('postgis').service('pgManagerService')
  
    const isPgAvailable = await pgManagerService.isPgAvailable(true,pg);
  
    if (!isPgAvailable) {
      strapi.log.info(`Error accessing POSTGIS`);
      return;
    }
  
    pg.destroy()
    strapi.postgis['enabled'] = true;

  } catch (error) {
    strapi.log.info(`Error accessing POSTGIS. ${error}`);
  }
  // const pgColumns = function (result) {
  //   const columns = Object.keys(result)
  //   let pgColumnsList = columns.filter(c => strapi.postgis.spatialColumns.includes(c))
  //   return pgColumnsList
  // }
  // const pgEnabled = function (result) {
  //   let rows =[].concat(result)
  //   let pgColumnsList=[]
  //   let enabled=false;
  //   if (rows.length > 0) {
  //     pgColumnsList =pgColumns(rows[0])
  //   } 
  //   if(pgColumnsList.length>0){
  //     enabled = true;
  //   }
  //   return {pgColumnsList,enabled}
  // }
  // const convertRow = function(result,cols){
  //   for (let index = 0; index < cols.length; index++) {
  //     const element = cols[index];
  //     // result[element]="CONVERted"
      
  //   }
  //   return result;
  // }
  // const pgToGeojson = function (result,cols) {
  //   let rows=[];

  //   if (Array.isArray(result)) {

  //     for (let index = 0; index < result.length; index++) {
  //       const element = result[index];
  //       let  convertedRow = convertRow(element,cols)
  //       rows.push(convertedRow)
  //     }


  //   } else if (!Array.isArray(result)) {
  //     rows = convertRow(result,cols);
  //   }
   
  //   return rows
  // }

  // strapi.config.database.connection.postProcessResponse = (result, queryContext) => {
  //   // TODO: add special case for raw results (depends on dialect)
  //   if(!result){return result}
  //   let pgState = pgEnabled(result)
  //   if(pgState.enabled){
  //    return pgToGeojson(result,pgState.pgColumnsList)
  //   }


  //   return result
  // }
  // let a = 1

};
