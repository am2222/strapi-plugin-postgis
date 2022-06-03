'use strict';

module.exports = {
  async getPgCollectionTypes(ctx) {
    const { userAbility } = ctx.state;
    const { model } = ctx.params;
    const { query } = ctx.request;
    
    const pgContentTypes = await strapi
    .plugin('postgis')
    .service('pgManagerService')
    .getPgContentTypes()
    // const pgService = await strapi.plugin('postgis').service('pgcollectionTypeService')

    if(!pgContentTypes){
      return ctx.forbidden();
    }


    // const entityManager = getService('entity-manager');
    // const permissionChecker = getService('permission-checker').create({ userAbility, model });

    // if (permissionChecker.cannot.read()) {
    //   return ctx.forbidden();
    // }

    // const permissionQuery = permissionChecker.buildReadQuery(query);

    // const { results, pagination } = await entityManager.findWithRelationCounts(
    //   permissionQuery,
    //   model
    // );

    // const sanitizedResults = await Promise.all(
    //   results.map(result => permissionChecker.sanitizeOutput(result))
    // );

    ctx.body = {
      results: pgContentTypes
    };
  },
  async getPgMetadata(ctx) {
    const pgMetadata = await strapi
    .plugin('postgis')
    .service('pgManagerService')
    .getPgMetadata()

    if(!pgMetadata){
      return ctx.forbidden();
    }

    ctx.body = {
      results: pgMetadata
    };
  },
};