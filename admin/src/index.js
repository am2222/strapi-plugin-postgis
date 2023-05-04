import React from 'react';
import { prefixPluginTranslations } from '@strapi/helper-plugin';
import { Button } from '@strapi/design-system'
import { Upload } from '@strapi/icons'

import pluginPkg from '../../package.json';
import pluginId from './pluginId';
import pluginPermissions from './permissions';

import Map from "./components/Map";
import Cell from "./components/Cell";
import Initializer from './components/Initializer';
import PluginIcon from './components/PluginIcon';

import {capitlizeFirst} from './utils/stringFormatter';

const name = pluginPkg.strapi.name;

/*
  Since strapi doesn't support custom fields in v4, we have to overwrite the current implementation
*/
//import { intercept } from './utils/intercept';
//import * as helperPlugin from '@strapi/helper-plugin';
/*intercept(helperPlugin, 'GenericInput', ({ args: [props], resolve }) => {
  const type = (props.attribute || {}).fieldRenderer || props.type;
  return resolve({
    ...props,
    type,
  });
});*/


const handleTriggerDeployment = () => {
  alert("hi")
}
export default {
  register(app) {
    app.customFields.register({
      name: 'map',
      pluginId,
      type: 'json',
      icon: PluginIcon,
      intlLabel: {
        id: 'postgis.label',
        defaultMessage: 'postgis map',
      },
      intlDescription: {
        id: 'postgis.description',
        defaultMessage: 'postgis map description',
      },
      components: {
        Input: async () => import(
          './components/Map'
        ),
      },
      options: {
      },    
    });
    //app.addFields({ type: 'postgis', Component: Map });
    // app.addMenuLink({
    //   to: `/plugins/${pluginId}`,
    //   icon: PluginIcon,
    //   intlLabel: {
    //     id: `${pluginId}.plugin.name`,
    //     defaultMessage: capitlizeFirst(name),
    //   },
    //   Component: async () => {
    //     const component = await import(/* webpackChunkName: "[request]" */ './pages/App');

    //     return component;
    //   },
    //   permissions: pluginPermissions.readSettings,
    // });
    app.registerPlugin({
      id: pluginId,
      initializer: Initializer,
      isReady: false,
      name,
    });
  },

  // bootstrap(app) {
  //   app.injectContentManagerComponent("listView", "actions", {
  //     name: "DraftFilterButton",
  //     Component: () => (
  //       <Button
  //         onClick={() => handleTriggerDeployment}
  //         variant='secondary'
  //         endIcon={<Upload />}
  //       >
  //         listView - actions
  //       </Button>
  //     ),
  //   });
  //   app.injectContentManagerComponent("editView", "right-links", {
  //     name: "PreviewButton",
      
  //     Component: () => (
  //       <Button
  //         onClick={() => handleTriggerDeployment}
  //         variant='secondary'
  //         endIcon={<Upload />}
  //       >
  //         editView - right-links
  //       </Button>
  //     ),
  //   });
  //   app.injectContentManagerComponent("editView", "informations", {
  //     name: "InternalComment",
     
      
  //     Component: () => (
  //       <Button
  //         onClick={() => handleTriggerDeployment}
  //         variant='secondary'
  //         endIcon={<Upload />}
  //       >
  //         editView - informations
  //       </Button>
  //     ),
  //   });
  //   app.registerHook("Admin/CM/pages/ListView/inject-column-in-table", ({ displayedHeaders, layout }) => {
  //     debugger;
  //     displayedHeaders=displayedHeaders.map(header=>{
  //       if(header.fieldSchema.isSpatial){
  //         return {
  //           key: header.key, // Needed for the table
  //           fieldSchema: header.fieldSchema, // Schema of the attribute
  //           metadatas: {
  //             label:  `${header.metadatas.label}-${header.fieldSchema.geoType}(${header.fieldSchema.srid})-[${header.fieldSchema.coord_dimension}D]`, // Label of the header,
  //             sortable: false,
  //             searchable: false
  //           }, // Metadatas for the label
  //           // Name of the key in the data we will display
  //           name: header.name,
  //           // Custom renderer
  //           cellFormatter: props => {return <Cell row={props} col={header.name}  metadata={header.fieldSchema} >Open </Cell>},
  //         }
  //       }
  //       return header
  //     })
  //     return { displayedHeaders, layout }
  //   });
  // },
  async registerTrads({ locales }) {
    const importedTrads = await Promise.all(
      locales.map(locale => {
        return import(`./translations/${locale}.json`)
          .then(({ default: data }) => {
            return {
              data: prefixPluginTranslations(data, pluginId),
              locale,
            };
          })
          .catch(() => {
            return {
              data: {},
              locale,
            };
          });
      })
    );

    return Promise.resolve(importedTrads);
  },
};
