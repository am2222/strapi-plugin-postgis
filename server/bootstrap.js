'use strict';
const knexPostgis = require('knex-postgis');
const spatialLifecyclesSubscriber = require('./utils/spatialLifecyclesSubscriber');


const postgisActions = {
  actions: [
    {
      // Settings
      section: 'plugins',
      displayName: 'Read',
      uid: 'settings.read',
      subCategory: 'Settings',
      pluginName: 'postgis',
    },
    {
      // Settings Update
      section: 'plugins',
      displayName: 'Edit',
      uid: 'settings.update',
      subCategory: 'Settings',
      pluginName: 'postgis',
    },
  ],
};

module.exports = async ({ strapi }) => {
  if (strapi.postgis && strapi.postgis['enabled']) {
    const pluginStore = strapi.store({ environment: '', type: 'plugin', name: 'postgis', });
    const settings = await pluginStore.get({ key: 'settings' });
    if (!settings) {
      const value = { enabled: true, };
      await pluginStore.set({ key: 'settings', value });
    }

    await strapi.admin.services.permission.actionProvider.registerMany(
      postgisActions.actions
    );


    const pgManagerService = await strapi.plugin('postgis').service('pgManagerService')

    const pgMetadata = await pgManagerService.getPgContentTypes()

    const st = knexPostgis(strapi.db.connection);
    strapi.postgis.pg = st;
    let spsun = new spatialLifecyclesSubscriber(strapi)
    strapi.db.lifecycles.subscribe(spsun)


    let pgVersion = await pgManagerService.getWelcomeMessage()
    strapi.log.info(pgVersion)
  }



  // // registeration phase
  // strapi.postgis = {
  //   spatialColumns: [],
  //   spatialTables: {}
  // }

  // let contentTypes = Object.keys(strapi.contentTypes);
  // for (let index = 0; index < contentTypes.length; index++) {
  //   const contenTypeName = contentTypes[index];
  //   const contenType = strapi.contentTypes[contenTypeName];
  //   const attributes = Object.keys(contenType.attributes)
  //   for (let j = 0; j < attributes.length; j++) {
  //     const attributeName = attributes[j];
  //     const attribute = contenType.attributes[attributeName];
  //     if (['geometry'].includes(attribute.type)) {
  //       strapi.postgis.spatialColumns.push(attributeName)
  //       if (!strapi.postgis.spatialTables[contenType.uid]) {
  //         strapi.postgis.spatialTables[contenType.uid] = {}
  //       }
  //       strapi.postgis.spatialTables[contenType.uid][attributeName] = contenType.attributes[attributeName]
  //     }
  //   }
  // }



  //https://postgis.net/docs/using_postgis_dbmanagement.html#Create_Spatial_Table
  // table.specificType('coordinates', 'POINT').defaultTo(knex.raw('POINT (37.3875, -122.0575)'))
  // https://postgis.net/docs/using_postgis_dbmanagement.html#RefObject

};
