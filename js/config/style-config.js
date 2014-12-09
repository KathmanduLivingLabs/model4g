LayerStyles = {
    "inset-map-current-view": {
        color: "#333366",
        weight: 1,
        opacity: 0.9,
        fillColor: 0,
        fillOpacity: 0
    },
    "map-features": {
        "road": {
            weight: 10,
            opacity: 1,
            color: "#003366",
            //"dashArray": "28 8",
            fillColor: "#669999",
            lineCap: "butt",
            lineJoin: "miter",
        },
        "sewerage": {
            weight: 6,
            opacity: 1,
            color: "#333300",
            "dashArray": "16 8",
            fillColor: "#ffff00"
        },
        "water-supply": {
            weight: 8,
            opacity: 1,
            color: "#ff0000",
            "dashArray": "16 8",
            fillColor: "#ffff00"
        },
        "space": {
            weight: 16,
            opacity: 0.4,
            color: "#ffaa00",
            "dashArray": "16 8",
            fillColor: "#ffff00"
        },
        "heritage": {
            weight: 16,
            opacity: 0.4,
            color: "#ffaa00",
            "dashArray": "16 8",
            fillColor: "#ffff00"
        },
        "buildings":{
            weight: 2,
            color: "#666666",
            fillColor: "#ffcc00",
            fillOpacity: 1
        }
        ,
        "helper-styles": {
            "road": {
                weight: 2,
                opacity: 1,
                color: "#ffffff",
                dashArray: "28 16",
                lineCap: "butt",
                lineJoin: "miter"
            }
        },
        "min-zoom": 16,
        "max-zoom": 22
    },
    "boundary-mask-style": {
        fillColor: "#ececec",
        color: "#666666",
        fillOpacity: 0.8,
        weight: 2,
        clickable: false
    }
};