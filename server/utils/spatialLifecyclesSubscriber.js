'use strict';

const _ = require('lodash');
const knex = require('knex');

// | 'beforeCreate'
// | 'afterCreate'
// | 'beforeFindOne'
// | 'afterFindOne'
// | 'beforeFindMany'
// | 'afterFindMany'
// | 'beforeCount'
// | 'afterCount'
// | 'beforeCreateMany'
// | 'afterCreateMany'
// | 'beforeUpdate'
// | 'afterUpdate'
// | 'beforeUpdateMany'
// | 'afterUpdateMany'
// | 'beforeDelete'
// | 'afterDelete'
// | 'beforeDeleteMany'
// | 'afterDeleteMany';
/**
 * @typedef {import(".").Subscriber } Subscriber
 * @typedef { import("..").Event } Event
 */

// NOTE: we could add onCreate & onUpdate on field level to do this instead

/**
 * @type {Subscriber}
 */
class spatialLifecyclesSubscriber {
  constructor(strapi) {
    this.strapi = strapi;
  }

  async getPgService(){
    if(!this.pgManagerService){
      this.pgManagerService = await this.strapi.plugin('postgis').service('pgManagerService')

    }
    return this.pgManagerService
  }

  beforeCreate(event) {
    const { data } = event.params;

    const now = new Date();
    _.defaults(data, { createdAt: now, updatedAt: now });
  }

  /**
   * Init createdAt & updatedAt before create
   * @param {Event} event
   */
  beforeCreateMany(event) {


    const { data } = event.params;

    const now = new Date();
    if (_.isArray(data)) {
      data.forEach(data => _.defaults(data, { createdAt: now, updatedAt: now }));
    }
  }

  async updateSingleObject(data,model,where={}){
    let updateFields = []
    Object.keys(this.strapi.postgis.spatialTables[model.uid]).forEach(columnName => {
      let columnDetails = this.strapi.postgis.spatialTables[model.uid][columnName]
      if (data[columnName]) {
        let updateField = {};
        if(!data[columnName]['crs']){
          data[columnName]['crs']={"type":"name","properties":{"name":`EPSG:${columnDetails['srid']}`}}
        }
        updateField[columnName] = strapi.postgis.pg.geomFromGeoJSON(data[columnName])
        updateFields.push(updateField)
        //remove it from data since strapi does not undrestand it
        _.unset(data, columnName);
      }
    })

    if (updateFields.length > 0) {
      let pgService = await this.getPgService()
      for (let index = 0; index < updateFields.length; index++) {
        const element = updateFields[index];
        await pgService.updateGeometryField(model.tableName, element, where)
      }
    }
  }
  /**
   * Update updatedAt before update
   * @param {Event} event
   */
  async beforeUpdate(event) {
    if (this.strapi.postgis.spatialTables[event.model.uid]) {
      const { data , where} = event.params;
      await this.updateSingleObject(data,event.model,where)
    }
  }

  /**
   * Update updatedAt before update
   * @param {Event} event
   */
   async beforeUpdateMany(event) {
    if (this.strapi.postgis.spatialTables[event.model.uid]) {
      const { data , where} = event.params;
      if (_.isArray(data)) {
        for (let index = 0; index < data.length; index++) {
          const element = data[index];
          await this.updateSingleObject(element,event.model,where)

        }
      }
    }
  }
  beforeFindOne(event) {
    if (this.strapi.postgis.spatialTables[event.model.uid]) {
      let {select} = event.params;
      let columns =Object.keys(this.strapi.postgis.spatialTables[event.model.uid])
      event.params.select = this.modifySelect(columns, select) ;
    }
  }
  afterFindOne(event) {
    if (event.model.tableName === 'tags') {
      let a = 1
    }
  }

  modifySelect(columns,select=[]){
    select = _.castArray(select) 
    if(select.length===0){
      select.push(`*`)
      for (let index = 0; index < columns.length; index++) {
        const columnName = columns[index];
        select.push(strapi.db.connection.raw(`(ST_AsGeoJSON(${columnName})) as ${columnName}`))
      }
    }else{
      for (let index = 0; index < columns.length; index++) {
        const columnName = columns[index];
        if (select.includes(columnName)) {
          select[select.map((x, i) => [i, x]).filter(x => x[1] == columnName)[0][0]] = strapi.db.connection.raw(`(ST_AsGeoJSON(${columnName})) as ${columnName}`)
        }
      }
    }
    return select
  }
  beforeFindMany(event) {
    if (this.strapi.postgis.spatialTables[event.model.uid]) {
      let {select} = event.params;
      let columns =Object.keys(this.strapi.postgis.spatialTables[event.model.uid])
      event.params.select = this.modifySelect(columns, select) ;
    }
  }
  afterFindMany(event) {
    let a = 1
  }
}

// const spatialLifecyclesSubscriber = {
//   /
// };

module.exports = spatialLifecyclesSubscriber;