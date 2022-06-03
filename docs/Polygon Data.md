

### Polygon Data Type Support
* POLYGON((0 0,4 0,4 4,0 4,0 0),(1 1, 2 1, 2 2, 1 2,1 1))

![Screenshot](https://github.com/am2222/strapi-plugin-postgis/raw/main/images/polygon.png?raw=true)

```json
    "g_polygon": {
      "columnType": {
        "type": "specificType",
        "args": [
          "geometry(POLYGON,4326)"
        ]
      },
      "type": "json",
      "fieldRenderer": "postgis"
    }

```

* MULTIPOLYGON(((0 0,4 0,4 4,0 4,0 0),(1 1,2 1,2 2,1 2,1 1)), ((-1 -1,-1 -2,-2 -2,-2 -1,-1 -1)))
 Not yet supported 