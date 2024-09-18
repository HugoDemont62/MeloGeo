
import axios from "axios";
class ApiManager {
    getPositionClickedInfos = async(longitude, latitude, token) =>
    {
        const url = `https://api.mapbox.com/search/geocode/v6/reverse?longitude=${longitude}&latitude=${latitude}&access_token=${token}`;
         return await axios.get(url)
            .then(res => {
                 return res.data;
            })
            .catch(error => {
                throw new Error(`Failed to fetch reverse geocode: ${error.message}`);
            });
    }

    getCityByLngLat = async(longitude, latitude, token) =>
    {
        const url = `https://api.mapbox.com/search/geocode/v6/reverse?longitude=${longitude}&latitude=${latitude}&types=place&access_token=${token}`;
        return await axios.get(url)
            .then(res => {
                return res.data;
            })
            .catch(error => {
                throw new Error(`Failed to fetch reverse geocode: ${error.message}`);
            });
    }

    getCityInfos(city, token) {
        const url = `https://api.mapbox.com/search/geocode/v6/forward?q=${city}&access_token=${token}`
        return axios.get(url)
            .then(res => {
                return res.data;
            })
            .catch(error => {
                throw new Error(`Failed to get city infos: ${error.message}`);
            });
    }

    getWeatherByCity(city, token) {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${token}&units=metric`;
        return axios.get(url)
            .then(res => {
                return res.data;
            })
            .catch(error => {
                throw new Error(`Failed to get city temperature: ${error.message}`);
            });
    }


    getWeatherByLngLat(long, lat, token) {
        const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${long}&appid=${token}`;
        return axios.get(url)
            .then(res => {
                return res.data;
            })
            .catch(error => {
                throw new Error(`Failed to get city temperature: ${error.message}`);
            });
    }

    getAirPollution(long,lat,token) {
        const url = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${long}&appid=${token}`;
        return axios.get(url)
            .then(res => {
                return res.data;
            })
            .catch(error => {
                throw new Error(`Failed to get air pollution: ${error.message}`);
            });
    }

    getPexelsVideos = async (query, token) => {

        const url = `https://api.pexels.com/videos/search?query=${encodeURIComponent(query)}`;
        return await axios.get(url, {
            headers: {
                Authorization: token
            }
        })
            .then(res => {
                return res.data;
            })
            .catch(error => {
                throw new Error(`Failed to fetch Pexels videos: ${error.message}`);
            });
    }

    getGiphyGif = async (query, token) => {
        const url = `https://api.giphy.com/v1/gifs/search?api_key=${token}&q=${encodeURIComponent(query)}&limit=1&rating=g&lang=en`;
        return await axios.get(url)
            .then(res => {
                return res.data;
            })
            .catch(error => {
                throw new Error(`Failed to fetch Giphy GIFs: ${error.message}`);
            });
    }


}
const apiManager = new ApiManager();
export default apiManager;