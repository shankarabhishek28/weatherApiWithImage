import axios from 'axios'
import { apiKey } from '../constants'
import { endEvent } from 'react-native/Libraries/Performance/Systrace'
const currentWeatherEndPoint = params => `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${params.cityName}&aqi=no`
const locationEndPoint = params => `https://api.weatherapi.com/v1/search.json?key=${apiKey}&q=${params.cityName}`
const apiCall = async (endpoint) => {
    const options = {
        method:'GET',
        url:endpoint
    }
    try{
        const response =  await axios.request(options);
        return response.data;

    }catch(err){
        console.log('error',err);
        return null;
    }
}
export const fetchCurrentWeather = params => {
    return apiCall(currentWeatherEndPoint(params))
}
export const fetchlocationEndPoint = params => {
    return apiCall(locationEndPoint(params))
}