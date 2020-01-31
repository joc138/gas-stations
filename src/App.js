import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import ReactMapGL, { Marker, Popup } from 'react-map-gl';
import * as parkData from './data/skateparks.json'
import './App.css';
import { usePosition } from 'use-position';
function App() {
    const defaultLat = 45.4211;
    const defaultLong =  -75.6903;

    const userPos = usePosition();
    const [viewport, setViewport] = useState({
      latitude: defaultLat,
      longitude: defaultLong,
      width: '100vw',
      height: '100vh',
      zoom: 10
    }
  );


    const [selectedPark, setSelectedPark] = useState(null);

    useEffect(()=>{
      const listener = e => {
        if(e.key === 'Escape') {
          setSelectedPark(null);
        }
      };
      window.addEventListener('keydown',listener);

      return () => {
        window.removeEventListener('keydown',listener);
      }
    }, [])
    return (
      <div>
        <ReactMapGL {...viewport}
          mapboxApiAccessToken={process.env.REACT_APP_MAP_TOKEN}
          mapStyle='mapbox://styles/peachplucker/ck61exaww025d1jmpbk39he8u'
          onViewportChange = {viewport => {
            setViewport(viewport)
          }}
      >
        {parkData.features.map(park => (
            <Marker key={park.properties.PARK_ID}
              latitude={park.geometry.coordinates[1]}
              longitude={park.geometry.coordinates[0]}
            >
              <button className='marker-btn' onClick={e => {
                e.preventDefault();
                setSelectedPark(park);
              }}>
                <img src='gsIcon.svg' alt='skate park icon'></img>
              </button>
            </Marker>
        ))}
        {selectedPark ? (
          <Popup
            latitude={selectedPark.geometry.coordinates[1]}
            longitude={selectedPark.geometry.coordinates[0]}
            onClose={() => {
              setSelectedPark(null);
            }}
          >
            <div>
              <h2>{selectedPark.properties.NAME}</h2>
              <p>{selectedPark.properties.DESCRIPTIO}</p>
            </div>
          </Popup>
        ) : null}
    </ReactMapGL>
    </div>
  );
}

export default App;
