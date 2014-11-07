function Map() {
    var map = L.map('map', {
        center: [27.713702811633752, 85.34560561180113],
        zoom: 17,
        doubleClickZoom: true
    });


    function osmTiles() {
        return L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: 'Map data and tiles &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://www.openstreetmap.org/copyright/">Read the Licence here</a> | Cartography &copy; <a href="http://kathmandulivinglabs.org">Kathmandu Living Labs</a>, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
            maxZoom: 19,
            minZoom: 1
        });
    }

    var osmTileLayer = new osmTiles();


    //osmTileLayer.addTo(map);
    L.control.scale().addTo(map);



    map.addLayer(osmTileLayer);

    var osmTileLayerClone = new osmTiles();
    //map.addLayer(kilnClusters);

    var baseMaps = {
        "OpenStreetMap": osmTileLayer,
        "OpenStreetMap Grayscale": osmTileLayerClone
        , "Other base layer 1": {_leaflet_id: "dummylayer1"},
        "Other base layer 2..": {_leaflet_id: "dummylayer2"},
        "...": {_leaflet_id: "dummylayer3"}
    };

    var overlayMaps = {
    };

    var layersControl = L.control.layers(baseMaps, overlayMaps,{
        position: "topleft"
    }).addTo(map);
    layersControl._layers.dummylayer1.layer;

    this.getMap = function() {
        return map;
    };
    this.getLayersControl = function() {
        return layersControl;
    };
}

function Cluster(features, map) {
    var clusterGroup = L.markerClusterGroup({
        showCoverageOnHover: false
    });
    var clustering = $.Deferred();

    setTimeout(function() {

        for (var point in features) {
            var pointAttributes = features[point].properties.getAttributes(features[point].properties._cartomancer_id);
            var marker = L.marker(L.latLng(features[point].geometry.coordinates[1], features[point].geometry.coordinates[0]), {
                icon: L.divIcon(Styles.iconStyle),
                riseOnHover: true,
                title: pointAttributes.name + ", " + pointAttributes.city
            });

            

            /*var titleBarJson = {
             "title": pointAttributes.name + ", " + pointAttributes.city,
             "slider": new UI_ThumbnailView({
             thumbUrls: function() {
             var srcs = [];
             for (var photo in pointAttributes.pictures) {
             srcs.push("data/media/photos/thumbs/" + pointAttributes.pictures[photo]["pictures/photo"]);
             }
             return srcs;
             }(),
             photoUrls: function() {
             var srcs = [];
             for (var photo in pointAttributes.pictures) {
             srcs.push("data/media/photos/" + pointAttributes.pictures[photo]["pictures/photo"]);
             }
             return srcs;
             }(),
             mediaOptions: {}
             }).createSlider()
             };
             
             var headerJson = {
             "Contact Person": pointAttributes.contact_person,
             "Contact Number": pointAttributes.contact_number
             //                ,"city": pointAttributes.city
             };
             
             var tabsJson = {
             triggers: {
             title: function() {
             
             }
             },
             tabs: [
             {
             title: "General Information",
             content: {
             Ownership: pointAttributes.ownership,
             "Bricks mainly Sold in": pointAttributes.market,
             "Operating Season": pointAttributes.market,
             "Days Open": pointAttributes.days_open
             }
             },
             {
             title: "Production: Input-Output",
             content: {
             "Fuel Quantity": pointAttributes.fuel_quantity,
             "Kind of Brick Produced": pointAttributes.brick_kind,
             Capacity: pointAttributes.capacity,
             "Raw Material": pointAttributes.raw_material,
             "Quality of Brick Produced": pointAttributes.brick_quality,
             Fuel: pointAttributes.fuel,
             "Brick Production": pointAttributes.brick_production
             }
             },
             {
             title: "Production: Technique",
             content: {
             "Moulding Process": pointAttributes.moulding_process,
             "Number of Chimneys": pointAttributes.chimney_numbers,
             "Chimney-height": pointAttributes.chimney_height,
             Firing: pointAttributes.firing,
             "Chimney category": pointAttributes.chimney_category
             }
             },
             {
             title: "Socio-economic",
             content: {
             "Children as Labourers": pointAttributes.labor_children,
             "Female Workers": pointAttributes.labor_female,
             "Male Workers": pointAttributes.labor_male,
             "Total number of Workers": pointAttributes.labor_total,
             "Young Labourers": pointAttributes.labor_young,
             "Elderly Labourers": pointAttributes.labor_old,
             "Laboureres currently Studying": pointAttributes.labor_currently_studing,
             "Workers with SLC": pointAttributes.labor_slc,
             "Workers with Informal Education": pointAttributes.labor_informal_edu,
             "Workers not Literate": pointAttributes.labor_illiterate,
             "Food Allowance": pointAttributes.food_allowance
             }
             }
             ]
             };
             
             var documentModel = {
             titleBar: {
             title: "Summary",
             cotrols: new CloseButton()
             }
             };*/

            var dom = new PanelDocumentModel(pointAttributes);

            var panelDocument = new PanelDocument(dom.documentModel);
            panelDocument.addToTitleBar(dom.titleBarJson);
            panelDocument.addHeader(dom.headerJson);
            panelDocument.addTabs(dom.tabsJson, PlugsForStyling.popup && PlugsForStyling.popup.body ? PlugsForStyling.popup.body : false);

            marker.bindPopup(panelDocument.getDocument(), {
                autoPan: true,
                keepInView: true,
                offset: L.point(0, -22)
            });

            marker.on("popupopen", function() {
                setTimeout(function() {
                    $("#map").find(".panel-document-header .header-row>div:last-child").each(function() {
                        if ($(this).outerHeight() > 56)
                            $(this).addClass("smaller-text");
                    });
                }, 0);
            });
            marker.addTo(clusterGroup);
        }
        clustering.resolve(clusterGroup);
    }, 0);

    return clustering.promise();
}

function TableContent(jsonData, invert) {
    var content = $("<div></div>").addClass("table-content");
//        if (!jsonData.type) {
    for (var row in jsonData) {
        var tableRow = $("<div></div>")
                .addClass("table-row")
                .append(function() {
                    return jsonData[row] === "999" || jsonData[row] === "999.0" || !jsonData[row] ? $("<div></div>").text(row).append($("<div></div>").addClass("not-available").text("Not Available")) : $("<div></div>").text(row).append($("<div></div>").text(jsonData[row].replace(/_/g, " ")));
                });
        invert ? tableRow.prependTo(content).addClass(row.toLowerCase().replace(/ /g, "_")) : tableRow.appendTo(content).addClass(row.toLowerCase().replace(/ /g, "_"));
    }
    /*}else if(jsonData.type==="image"){
     for (var row in jsonData.data){
     var tableRow = $("<div></div>")
     .addClass("table-row")
     .append(function(){
     return $("<div></div>").append("<img src='"+row+"'/>")
     .add($("<div></div>").text(jsonData.data[row]));
     });
     invert ? tableRow.prependTo(content).addClass(row) : tableRow.appendTo(content).addClass(row);
     }
     }*/
    return content;
}

function Table(jsonData) {
    return $("<div></div>")
            .addClass("table container").addClass(jsonData.type)
            .append(new TableContent(jsonData.content));
}

function PanelDocument(documentModel) {
    var _panelDocument = document.createElement("div");

    var _title = $("<div/>").addClass("panel-document-title");
    var _slider = $("<div/>").addClass("panel-document-slider");
    var _controls = $("<div/>").addClass("panel-document-controls");

    var titleBarNode = document.createElement("div");

    var titleBar = documentModel.titleBar ? $(titleBarNode).append(function() {
        var returnArray = $(_title).add(_slider).add(_controls);
        /*returnArray.push(_title);
         returnArray.push(_slider);
         returnArray.push(_controls);*/
        return returnArray;
    }).addClass("titleBar panel-document-titleBar") : null;
    var _header = $("<div/>").addClass("panel-document-header");
    var _body = $("<div/>").addClass("panel-document-body");
    var _footer = $("<div/>").addClass("panel-document-footer");

//    var document_tabs = new Tabs();
//    var document_header = new Header();

    $(_panelDocument).attr({
        class: "panel float panel-document has-tabs"
    }).append(function() {
        var returnArray = $(titleBar).add(_header).add(_body).add(_footer);
        /*returnArray.push(titleBar);
         returnArray.push(_header);
         returnArray.push(_body);
         returnArray.push(_footer);*/
        return returnArray.addClass("panel-document-section");
    });

    function _addToTitleBar(titleBarJson) {
        setTimeout(function() {
            if (titleBarJson.title) {
                _title.text(function() {
                    return titleBarJson.title;
                });
            }
            if (titleBarJson.slider) {
                (titleBarJson.slider).appendTo(_slider);     //TODO: careful here
            }
            if (titleBarJson.controls) {
                _controls.append(function() {
                    return titleBarJson.controls;  //TODO: careful here
                });
            }
        }, 0);
    }

    function _addHeader(headerJson, extras) {
        new Header().createHeader(headerJson).appendTo(_header);
        if (extras) {
            if (extras["head-plug"])
                $(extras["head-plug"]).prependTo(_header);
            if (extras["tail-plug"])
                $(extras["tail-plug"]).appendTo(_header);
        }
    }

    function _addTabs(tabsJson, extras) {
        new Tabs().createTabs(tabsJson).appendTo(_body);
        if (extras) {
            if (extras["head-plug"])
                $(extras["head-plug"]).prependTo(_body);
            if (extras["tail-plug"])
                $(extras["tail-plug"]).appendTo(_body);
        }
    }

    this.addToTitleBar = function(titleBarJson) {
        _addToTitleBar(titleBarJson);
    };

    this.addHeader = function(headerJson, extras) {
        _addHeader(headerJson, extras);
    };

    this.addTabs = function(tabsJson, extras) {
        _addTabs(tabsJson, extras);
    };
    this.getDocument = function() {
        return _panelDocument;
    };
}

function Header() {
    function _createHeader(headerJson) {
        var _headerContent = $("<div/>");
        for (var row in headerJson) {
            _headerContent.append(function() {
                return $("<div/>").addClass("header-row panel-document-section-header").addClass(row.toLowerCase().replace(/ /g, "_")).append(function() {
                    return row === "name" ? "<div>" + headerJson[row] + "</div>" : "<div>" + row + ": </div>" + "<div>" + headerJson[row] + "</div>";
                });
            }());
        }
        return _headerContent.children();
    }
    this.createHeader = function(headerJson) {
        return _createHeader(headerJson);
    };
}

function Tabs() {
    function _createTabs(tabsJson) {
        var _tabs = $("<div/>");
        var _tab, _tabTrigger;
        for (var tab in tabsJson.tabs) {
            _tab = $("<div/>").addClass("panel-document-tab inactive");
            _tabTrigger = new UI_Button({
                attributes: {
                    class: "trigger tab-trigger " + tabsJson.tabs[tab].title,
                    title: tabsJson.tabs[tab].title.replace(/_/g, " ")
                },
                eventHandlers: {
                    click: function(e) {
                        $(this).switchToTab();
                    }
                }
            }).css({
                "z-index": tab + 1
            }).append($("<div class='label'/>").text(tabsJson.tabs[tab].title)).appendTo(_tab);

            var _page = $("<div/>").addClass("panel-document-page").append(function() {
                return new Table({
                    content: tabsJson.tabs[tab].content,
                    type: "cartomancer-popup-table"
                });
            }).addClass(tabsJson.tabs[tab].title.toLowerCase().replace(/:/g, "").replace(/ /g, "_"));

            _tabs.append(_tab);
            _tab.append(_page);
        }
        //$(_tabs.find(".panel-document-page")[0]).removeClass("inactive");
        $(_tabs.find(".panel-document-tab>a.tab-trigger")[0]).switchToTab();
        //console.log(_tabs.children())
        return _tabs.children();
    }
    this.createTabs = function(tabsJson) {
        return _createTabs(tabsJson);
    };
}



function UI_Button(initObj) {
    var button = $("<a></a>");
    if (initObj) {
        $(button).attr(function() {
            var attrObj = {};
            for (var attr in initObj.attributes) {
                attrObj[attr] = initObj.attributes[attr];
            }
            return attrObj;
        }());
        for (var event in initObj.eventHandlers) {
            $(button).on(event, initObj.eventHandlers[event]);
        }
        $(typeof initObj.content === "function" ? initObj.content.call() : initObj.content).appendTo(button);
    }

    return button;
}

var UI_CloseButton = function() {
    return new UI_Button({
        attributes: {
            class: "close trigger"
        },
        eventHandlers: {
            click: function(e) {
                //$(this).parent().addClass("hidden");
                $(this).parent().trigger("remove").remove();
            }
        },
        content: "<div class='icon'>X</div>"
    });
};

function UI_Thumbnail(thumbUrl, mediaOptions) {
    var thumbnail = $(document.createElement("a"));
    thumbnail.addClass("trigger thumbnail").append(function() {
        return $("<img/>").attr({
            src: thumbUrl,
            class: "icon"
        }).css("z-index", 1);
    }).attr({
        title: "Click to View the Photograph"
    }).on("click", mediaOptions.triggers.click);
    return thumbnail;
}

/*function UI_Thumbnail(thumbUrl, mediaOptions) {
 var thumbnail = $(document.createElement("div"));
 thumbnail.addClass("trigger thumbnail").append(function() {
 return $("<div/>").append($("<img/>").attr({
 src: thumbUrl
 //,class: "icon"
 })).addClass("icon");
 }).attr({
 title: "Click to View the Photograph"
 })
 .on("click", mediaOptions.triggers.click);
 return thumbnail;
 }*/



function UI_ThumbnailView(srcObject) {
    function _createSlider() {
        //var thumnailSlider = $("<div>").addClass("ui-thumbnail-slider");
        var thumbnailSlider = $(document.createElement("div")).addClass("ui-thumbnail-slider").css({
        });

        var thumbnailSlide = $("<div/>").addClass("ui-thumbnail-slide")/*.css({
         display: "inline-block",
         width: "120px",
         height: "80px",
         "margin-left": "20px",
         "overflow": "hidden"
         })*/.appendTo(thumbnailSlider);
        var thumnailStrip = $("<div/>").addClass("ui-thumbnail-strip")/*.css({
         display: "inline-block",
         "white-space": "nowrap"
         })*/.appendTo(thumbnailSlide);
        for (var thumbUrl in srcObject.thumbUrls) {

            new UI_Thumbnail(srcObject.thumbUrls[thumbUrl], srcObject.mediaOptions({src: srcObject.photoUrls[thumbUrl]})).css({
                /*display: "inline-block",
                 margin: "0px 1px",
                 padding: "0px",*/
                "z-index": Number(thumbUrl) + 1
            }).appendTo(thumnailStrip);


        }

        var sliderNav = $("<div/>").addClass("ui-slider-nav").appendTo(thumbnailSlider);

        new UI_Button({
            attributes: {
                class: "ui-slider-button-prev",
                title: "Previous photo"
            },
            eventHandlers: {
                mouseover: function() {
                    var currViewIndex = thumbnailSlider.getViewIndex();
                    currViewIndex > 0 ? thumbnailSlider.setViewToIndex(currViewIndex - 1) : $(this).addClass("disabled");
                }
            },
            content: $("<div/>").addClass("icon").text("<")
        }).appendTo(sliderNav);
        new UI_Button({
            attributes: {
                class: "ui-slider-button-next",
                title: "Next photo"
            },
            eventHandlers: {
                mouseover: function() {
                    var currViewIndex = thumbnailSlider.getViewIndex();
                    var maxViewIndex = thumbnailSlider.find(".thumbnail").length - 1;
                    currViewIndex < maxViewIndex ? thumbnailSlider.setViewToIndex(currViewIndex + 1) : $(this).addClass("disabled");
                }
            },
            content: $("<div/>").addClass("icon").text(">")
        }).appendTo(sliderNav);

        return thumbnailSlider;
    }
    this.createSlider = function() {
        return _createSlider();
    };
}

function SplashScreen(content) {
    var splashScreen = $("<div/>").addClass("splash-screen").append(content);
    content.on("remove", function() {
        splashScreen.remove();
    });
    return splashScreen;
}

function MediaDocument(src) {
    console.log(src);
    //var container = $("<div/>").addClass("leaflet-popup");
    var viewer = $("<div/>").addClass("media-viewer float panel");
    //$("<div/>").addClass("leaflet-popup-content-wrapper").append($("<div/>").addClass("leaflet-popup-content").append(viewer)).appendTo(container);
    $("<div/>").addClass("media-document").append(function() {
        return $("<img/>").attr({
            class: "image media",
            src: src
        });
    }).appendTo(viewer);

    new UI_CloseButton().appendTo(viewer);

    return viewer;
}


function Popup() {
    return L.popup({
        autoPan: true,
        keepInView: true
    });
}



function UI_TabularColumn(options){
    var column = $("<div class='col'/>");
    var header = $("<div class='col-header'/>").append(options.header);
    var body = $("<div class='col-body'/>");
    
    for(var c in options.body){
       body.append(function(){
          return $("<div class='body-row'/>").append($("<div/>").append(c)).append($("<div/>").append(options.body[c]));
       });
    }
    
    var footer = $("<div class='col-footer'/>").append(options.footer);
    
    header.appendTo(column);
    body.appendTo(column);
    footer.appendTo(column);
    
    this.getUI = function(){
      return column[0];  
    };
}


function UI_ExtensionColumns(options){
    var column = $(new UI_TabularColumn(options).getUI()).addClass(options.class);
    this.getUI = function(){
      return column;  
    };
}
