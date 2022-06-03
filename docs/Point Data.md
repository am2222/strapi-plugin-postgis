

### Point Data Type Support

* POINT(0 0)

![Screenshot](https://github.com/am2222/strapi-plugin-postgis/raw/main/images/points.png?raw=true)
```json
"geom": {
      "columnType": {
        "type": "specificType",
        "args": [
          "geometry(POINT,4326)"
        ]
      },
      "type": "json",
      "fieldRenderer": "postgis"
    }

```
* POINT Z (0 0 0)
 Not yet supported 
* POINT ZM (0 0 0 0)
 Not yet supported
* POINT EMPTY
 Not yet supported
* MULTIPOINT((0 0),(1 2))
 Not yet supported
* MULTIPOINT Z ((0 0 0),(1 2 3))
 Not yet supported
* MULTIPOINT EMPTY
 Not yet supported








