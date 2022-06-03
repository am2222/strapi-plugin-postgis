

### LineString Data Type Support

* LINESTRING(0 0,1 1,1 2)
![Screenshot](https://github.com/am2222/strapi-plugin-postgis/raw/main/images/linestring.png?raw=true)

```json
    "g_line": {
      "columnType": {
        "type": "specificType",
        "args": [
          "geometry(LINESTRING,4326)"
        ]
      },
      "type": "json",
      "fieldRenderer": "postgis"
    }


```

* LINESTRING EMPTY
 Not yet supported

* MULTILINESTRING((0 0,1 1,1 2),(2 3,3 2,5 4))
 Not yet supported
