import React, { useState, useEffect } from 'react';
import ReactMapGL, { Marker, Popup } from 'react-map-gl';
import PopupInfo from './components/PopupInfo';
import MapStations from './components/mapStations';
import YelpService from './yelp';
import db from './base';
import logo from './logo.svg';
import './App.css';

function App() {
  const defaultLat = 45.4211;
  const defaultLong =  -75.6903;
  const [userLocation, setUserLocation] = useState({defaultLat,defaultLong});
  const [selectedStation, setSelectedStation] = useState(null);
  const [gasStations,setGasStations] = useState([]);
  const [viewport, setViewport] = useState({
    latitude: defaultLat,
    longitude: defaultLong,
    width: '100vw',
    height: '100vh',
    zoom: 10
  });
  const [stationProps,setStationProps] = useState({});
  var sortable = [];
  var sortedObject = {};
  var id = 1;

  var getGasStations = async() => {
    let currentUserLocation = {
      lat: viewport.latitude,
      long: viewport.longitude
    };
    let gasPlaces = await YelpService.getGasStations(currentUserLocation);
    sortedObject = {};
    sortable = [];
    console.log(gasPlaces);
    setGasStations({gasPlaces});
    getPrices(gasPlaces);
  }

  async function getData (identity) {
    let id = identity.id;
    console.log(id);
    let listOfPrices = [3.50,3.50,3.50];
    db.collection('gas-locations').doc(id).get().then(function(snapshot){
      if(snapshot.exists){
        console.log('price of lowest gas: '+ snapshot.data().price[0]);
        listOfPrices = snapshot.data().price
      }else{
        console.log('id does not exist');
        db.collection('gas-locations').doc(id).set({
          name: identity.name,
          coordinates: identity.coords,
          distance: identity.distance,
          price: [3.50,3.50,3.50]
        });
      }
    })
    return listOfPrices[0];
  }

  async function getPrices(response) {
    let counter = 1;
     response.forEach(async function(item){
       let identity = item.id;
       let location = item.coords;
       let dist = item.distance;
       let title = item.name;
       let prices = await getData(item);

       console.log('these are the prices in getPrices: '+ prices);
       sortable.push([identity,prices,location,dist,title]);
       sortedObject[identity]={
          name: title,
          coordinates: location,
          distance: dist,
          price: prices
       }
      })

    sortable.sort(function(a,b){
      return a[1]-b[1];
    });

    console.log(sortable);

    sortable.forEach(function(item){
      if(counter>3){
        counter = 3;
      }
      sortedObject[item[0]].grade = counter++;
    });

    setStationProps(sortedObject);
  };

  function getUserLocation(){
    navigator.geolocation.getCurrentPosition(position => {
     let newLocation = {
         lat: position.coords.latitude,
         long: position.coords.longitude
      };
     let newViewport = {
        height: "100vh",
        width: "100vw",
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        zoom: 10
      };
      setViewport(newViewport);
      setUserLocation(newLocation);
      console.log(newViewport);
   });
  };

  useEffect(()=>{
      const listener = e => {
        if(e.key === 'Escape') {
          setSelectedStation(null);
        }
      };
      window.addEventListener('keydown',listener);

      return () => {
        window.removeEventListener('keydown',listener);
      }
    }, [])

    return (
      <div>
          <button onClick={getUserLocation}>
            Click to get location
          </button>
          <button onClick={getGasStations}>
            Click to get gas Stations nearby
          </button>
          <ReactMapGL {...viewport}
              mapboxApiAccessToken={process.env.REACT_APP_MAP_TOKEN}
              mapStyle='mapbox://styles/peachplucker/ck61exaww025d1jmpbk39he8u'
              onViewportChange = {viewport => {
                setViewport(viewport)
              }}
            >
            {gasStations.gasPlaces==null ? null : gasStations.gasPlaces.map(station => (
                <Marker key={++id}
                  latitude={station.coords.latitude}
                  longitude={station.coords.longitude}
                >
                  <button className='marker-btn' onClick={e => {
                    e.preventDefault();
                    setSelectedStation(station);
                  }}>
                    <img src='gsIcon.svg' alt='skate park icon'></img>
                  </button>
                </Marker>
            ))}
            {selectedStation ? (
              <Popup
                latitude={selectedStation.coords.latitude}
                longitude={selectedStation.coords.longitude}
                onClose={() => {
                  setSelectedStation(null);
                }}>
                <PopupInfo object={stationProps} station={selectedStation}/>
              </Popup>
            ) : null}
          </ReactMapGL>
      </div>
    );
}

export default App;
