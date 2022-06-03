'use strict';

const { routing } = require('../middlewares');

module.exports = {
  type: 'admin',
  routes: [
    {
      method: 'GET',
      path: '/pgcollection-types',
      handler: 'pgManager.getPgCollectionTypes',
      config: {
        policies:['admin::isAuthenticatedAdmin'],
      },
    },   
    {
      method: 'GET',
      path: '/pgmetadata',
      handler: 'pgManager.getPgMetadata',
      config: {
        policies:['admin::isAuthenticatedAdmin'],
      },
    },
  ],
};