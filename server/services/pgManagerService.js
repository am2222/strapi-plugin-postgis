'use strict';

module.exports = ({ strapi }) => {
    const pgGeometryTypes = function(){
        return ["GEOMETRY", "POINT", "LINESTRING", "POLYGON", "MULTIPOINT", "MULTILINESTRING", "MULTIPOLYGON", "GEOMETRYCOLLECTION"]
    }
//https://github.com/mapbox/geojson-rewind
//@mapbox/geojsonhint
    const updateGeometryField = async function(table,updateFields,where={}){
          //'{"type":"Point","coordinates":[-48.23456,20.12345]}'
        let result = await strapi.db.connection(table).update(updateFields).where(where).catch(err => {
            return err.message;
        });

        if (typeof result === 'string') {
            strapi.log.info(`Error updating geometry field, ${result}`);
            return false
        }
        return result;
    }
    const getPgMetadataTable = async function () {
        let result = await strapi.db.connection.raw(`select * from geometry_columns;`).catch(err => {
            return err.message;
        });
        if (typeof result === 'string') {
            strapi.log.info(`Error reading from geometry_columns, ${result}`);
            return false
        }
        return result;
    }

    const createPgExtension = async function (db) {
        if(!db){
            db = strapi.db.connection;
        }
        let result = await db.raw(`create extension postgis;`).catch(err => {
            return err.message;
        });
        if (typeof result === 'string') {
            strapi.log.info(`Error Enabling PostGIS, ${result}`);
            return false
        }
        return true;
    }


    const pgVersion = async function (db) {
        if(!db){
            db = strapi.db.connection;
        }
        let result = await db.raw(`SELECT PostGIS_version();`).catch(err => {
            return err.message;
        });
        if (typeof result === 'string') {
            strapi.log.info(`Postgis is not installed, ${result}`);
            return undefined
        } 
        return result.rows[0].postgis_version;
    }


    const getPgContentTypes = async function () {
            const pGMetadata = await getPgMetadataTable();

            strapi.db.config.models.forEach((model,index) => {
                const contenType = strapi.contentTypes[model.uid];

                Object.keys(model.attributes).forEach((columnName) => {
                    let column = model.attributes[columnName]
                    pGMetadata.rows.forEach(row => {
                        if (row['f_table_name'] === model.tableName && row['f_geometry_column'] === columnName) {
                            column.isSpatial = true
                            column.srid = row['srid']
                            column.coord_dimension = row['coord_dimension']
                            column.f_table_schema = row['f_table_schema']
                            column.geoType = row['type']

                            strapi.postgis.spatialColumns.push(`${model.uid}:${columnName}`)
                            if (!strapi.postgis.spatialTables[model.uid]) {
                            strapi.postgis.spatialTables[model.uid] = {}
                            }
                            strapi.postgis.spatialTables[model.uid][columnName] = contenType.attributes[columnName]
                        }
                    })
                })
            })


            return strapi.postgis
            //     // registeration phase
            //     strapi.postgis = {
            //         spatialColumns: [],
            //         spatialTables: {}
            //     }
                
                


            // let spatialTables = {}
            // strapi.db.config.models.forEach((model,index) => {
            //     Object.keys(model.attributes).forEach((columnName) => {
            //         let column = model.attributes[columnName]
                   
            //         if (pgGeometryTypes().includes(column.type.toUpperCase())) {
            //             column.geoType = column.type .toUpperCase()
            //             column.spType = 'geometry'
            //             // column.type = 'json'
            //             column.isSpatial = true
            //             strapi.db.config.models[index].attributes[columnName].type='json'
            //             strapi.db.config.models[index].attributes[columnName].type='json'
            //             if (!spatialTables[model.tableName]) {
            //                 spatialTables[model.tableName] = {
            //                     'MODEL_OBJECT':model
            //                 }
            //             }
            //             spatialTables[model.tableName][columnName] = column;
            //             column.pluginOptions = column.pluginOptions || {}
            //             column.pluginOptions.postgis = { geomType: column.geoType, srid: 0, ...column.pluginOptions.postgis }

            //             pGMetadata.rows.forEach(row => {
            //                 if (row['f_table_name'] === model.tableName && row['f_geometry_column'] === columnName) {
            //                     //it already exists. just check if column has changed so drop it
            //                     // TODO: fix gemetry <-> geography change
            //                     if (row['srid'] !== column.pluginOptions.postgis.srid || column.pluginOptions.postgis.geomType !== row['type']) {
            //                         spatialTables[model.tableName][columnName]['dropFirst'] = true;
            //                     } else {
            //                         spatialTables[model.tableName][columnName]['exists'] = true;
            //                         spatialTables[model.tableName][columnName]['f_table_schema'] = row['f_table_schema'];
            //                         spatialTables[model.tableName][columnName]['coord_dimension'] = row['coord_dimension'];
            //                         spatialTables[model.tableName][columnName]['srid'] = row['srid'];
            //                         spatialTables[model.tableName][columnName]['geoType'] = row['type'];
            //                     }
            //                 }
            //                 // row['f_table_schema']
            //                 // row['coord_dimension']
            //                 // row['srid']
            //                 // row['type']
            //             })


            //         }
            //     })
            // })
            // return spatialTables;
        }

    const isPgAvailable = async function(tryToEnable=false,db){
        
        let postgisVersion = await pgVersion(db);
        if (!postgisVersion && tryToEnable) {
            await createPgExtension(db);
            postgisVersion = await pgVersion(db);
        }
        return (postgisVersion? true:false)
    }

    const migratePgTable = async function(){

        return 
        let oldMetadata = strapi.db.metadata.get('api::tag.tag')
        oldMetadata.attributes['geom'].type='json'
        strapi.db.metadata.set('api::tag.tag',oldMetadata)
        
        const spatialTables = await getPgContentTypes()

        for (let index = 0; index < Object.keys(spatialTables).length; index++) {
          const spatialTable = Object.keys(spatialTables)[index]
          const columns = spatialTables[spatialTable];
          for (let index = 0; index < Object.keys(columns).length; index++) {
            let columnName = Object.keys(columns)[index]
            let column = spatialTables[spatialTable][columnName]
            if (column['exists'] || columnName==='MODEL_OBJECT') {
              continue;
            }
            let columnSql = column.pluginOptions?.postgis?.columnSql || `${column.spType}(${column.pluginOptions?.postgis?.geomType.toUpperCase()},${column.pluginOptions?.postgis?.srid || 0})`
            if (column['dropFirst']) {
              await strapi.db.connection.schema.table(spatialTable, function (table) {
                table.dropColumn(columnName);
              })
            }
            await strapi.db.connection.schema.table(spatialTable, function (table) {
              if (column.pluginOptions?.postgis?.defaultTo) {
                table.specificType(columnName, columnSql).defaultTo(strapi.db.connection.raw(column.pluginOptions?.postgis?.defaultTo))
              } else {
                table.specificType(columnName, columnSql)
              }
      
            })
          }
        }
    }

    const getPgMetadata = async function(){
        return {
            spatialColumns: strapi.postgis.spatialColumns,
            spatialTables: strapi.postgis.spatialTables,
        }
    }
    return {
        async getWelcomeMessage() {
            return `Welcome to Strapi Postgis 🚀 + 🐘 + 🗺️ | ${await pgVersion()}`;
        },
        getPgMetadataTable,
        createPgExtension,
        pgVersion,
        getPgContentTypes,
        pgGeometryTypes,
        isPgAvailable,
        migratePgTable,
        getPgMetadata,
        updateGeometryField
    }
};

