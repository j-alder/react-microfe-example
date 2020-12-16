# react-microfe-example
example micro-frontend using React

### Concept
Each micro-frontend (MFE) is developed and deployed independently. A container application orchestrates their combination into a single 
application for the user.

The container app interacts with MFE components via each MFE's compiled `asset-manifest.json`. `window.render` functions 
in respective root files are called, appending an app's DOM to the container's DOM. `window.unmount` callbacks are provided 
for when the MFE is navigated away from.

Currently, geocoordinates for the map are set in `localStorage` to show a possible solution to the issue of sharing necessary data 
(e.g. session tokens) between the container and MFEs.

### Running
1. install dependencies for all three subdirectories
2. start `map`
3. start `form`
4. start `container`

### Issues, Thoughts, Caveats
- to allow full decoupling between apps, an api service/sdk is needed
- hot reloading doesn't work currently
