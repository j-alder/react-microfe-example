import React, { useEffect } from "react";
import { loadModules } from "esri-loader";

/** ArcGIS map */
export const WebMapView = React.memo(function WebMapView() {
  useEffect(
    () => {
      const coords = localStorage.getItem('coords').split(',').map((coord) => parseInt(coord));
      // lazy load the required ArcGIS API for JavaScript modules and CSS
      loadModules([
        "esri/Map",
        "esri/views/MapView",
        "esri/layers/GraphicsLayer",
        "esri/widgets/BasemapToggle",
        "esri/widgets/Search",
        "esri/widgets/Locate",
      ], { css: true })
        .then(([
          Map,
          MapView,
          GraphicsLayer,
          BasemapToggle,
          Search,
          Locate,
        ]) => {

          /********************
           * Initialize map and graphics layer(s)
           *******************/

          // graphics layer for displaying markers
          const graphicsLayer = new GraphicsLayer({
            id: "tempGraphics",
          });

          const map = new Map({
            basemap: "streets-navigation-vector",
            layers: [graphicsLayer],
          });

          // load the map view at the ref's DOM node
          const view = new MapView({
            container: "viewDiv",
            map: map,
            center: coords,
            zoom: 10,
          });

          /********************
           * Dragging functionality
           *******************/

          function toCoords(pt) {
            return {
              latitude: pt.latitude.toFixed(6),
              longitude: pt.longitude.toFixed(6),
            }
          }

          let draggingGraphic;
          let tempGraphic;

          function getPoint(resp) {
            if (
              resp &&
              resp.results &&
              resp.results[0] &&
              resp.results[0].graphic &&
              resp.results[0].graphic.geometry &&
              resp.results[0].graphic.geometry.type === 'point'
            ) {
              return resp.results[0].graphic;
            }
            return undefined;
          }

          view.on("drag", function(evt) {
            // if this is the starting of the drag, do a hitTest
            if (evt.action === 'start'){
              view.hitTest(evt).then(resp => {
                const point = getPoint(resp);
                if (point) {
                  evt.stopPropagation();
                  draggingGraphic = point;
                }
              });
            } else if (evt.action === 'update'){
              // on drag update events, only continue if a draggingGraphic is set
              if (draggingGraphic){
                evt.stopPropagation();
                // if there is a tempGraphic, remove it
                if (tempGraphic) {
                  view.graphics.remove(tempGraphic);
                } else {
                  // if there is no tempGraphic, this is the first update event, so remove original graphic
                  view.graphics.remove(draggingGraphic);
                }
                // create new temp graphic and add it
                tempGraphic = draggingGraphic.clone();
                tempGraphic.geometry = view.toMap(evt);
                tempGraphic.id = draggingGraphic.id;
                view.graphics.add(tempGraphic);
              }

            } else if (evt.action === 'end'){
              view.hitTest(evt).then(async (resp) => {
                const point = getPoint(resp);
                if (point) {
                  const location = await getPinLocation(evt);
                  updateHandlers[point.id]();
                }
              })
              // on drag end, continue only if there is a draggingGraphic
              toCoords(view.toMap({ x: evt.x, y: evt.y }));
              if (draggingGraphic){
                evt.stopPropagation();
                // rm temp
                if (tempGraphic) view.graphics.remove(tempGraphic);
                // create new graphic based on original dragging graphic
                let newGraphic = draggingGraphic.clone();
                newGraphic.geometry = tempGraphic.geometry.clone();
                newGraphic.id = tempGraphic.id;

                // add replacement graphic
                view.graphics.add(newGraphic);

                // reset vars
                draggingGraphic = null;
                tempGraphic = null;
              }
            }
          });

          /*****************
           * Find current location or location of a pin
           ****************/

          const locator = new Locate({ view: view });
          view.ui.add(locator, "top-left");

          const search = new Search({
            view: view
          });

          async function getPinLocation(evt) {
            search.clear();
            if (search.activeSource) {
              const coordinates = toCoords(view.toMap({ x: evt.x, y: evt.y }));
              const geocoder = search.activeSource.locator;
              const params = {
                location: view.toMap({ x: evt.x, y: evt.y })
              };
              const res = await geocoder.locationToAddress(params);
              if (res && res.address) {
                return {
                  address: res.address,
                  coordinates: coordinates
                };
              }
            }
          }

          /*****************
           * Toggle satellite/street
           ****************/

          // keep at end of code
          const basemapToggle = new BasemapToggle({
            view: view,
            nextBasemap: "hybrid"
          });
          view.ui.add(basemapToggle, "bottom-right");

          return () => {
            if (view) {
              // destroy the map view
              view.container = null;
            }
          };
        });
    }
  );

  return (
    <div style={{ position: "relative", height: 400 }}>
      <div className="webmap" style={{ height: 400, zIndex: 0 }} id="viewDiv" />
    </div>
  );
});
