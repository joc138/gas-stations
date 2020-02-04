import React from 'react'
import axios from 'axios'

const REACT_APP_YELP = 'awOJFMrLfZ0QhRWqvREwwby0E3r8vqEXP5F-FYb25tbulDZI9LW2Fknk7eXNDhaWTnuUeUm-C3R4bJS6rsGSQEzxHoPchsZXq06oVfKvj7mOopv8VgJ-FmsumhA2XnYx'
const api = axios.create({
  baseURL: 'https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3',
  headers: {
   Authorization: `Bearer ${REACT_APP_YELP}`
 },
})
const getGasStations = userLocation => {
  return api.get('businesses/search',{
      params: {
        limit: 10,
        categories: 'coffee',
        latitude: userLocation.lat,
        longitude: userLocation.long,
      }
    })
    .then(res =>
    res.data.businesses.map(business => {
      return {
        name: business.name,
        coords: business.coordinates,
      }
    }
  )
  )
   .catch(error => console.error(error))
}

export default {
  getGasStations,
}
