import React from 'react'
import axios from 'axios'


const api = axios.create({
  baseURL: 'https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3',
  headers: {
   Authorization: `Bearer ${process.env.REACT_APP_YELP_API_KEY}`
 },
})
const getGasStations = userLocation => {
  return api.get('businesses/search',{
      params: {
        limit: 10,
        categories: 'servicestations, All',
        latitude: userLocation.lat,
        longitude: userLocation.long,
      }
    })
    .then(res =>
    res.data.businesses.map(business => {
      return {
        id: business.id,
        name: business.name,
        coords: business.coordinates,
        location: business.location,
        distance: business.distance
      }
    })
  )
   .catch(error => console.error(error))
}

export default {
  getGasStations,
}
