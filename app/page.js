'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Forecast from './components/Forecast';
import Main from './components/Main';
import Hours from './components/Hours';
import Misc from './components/Misc';

function App() {
  //location, city & data (API Response) states
  const [location, setLocation] = useState('');
  const [city, setCity] = useState('');
  const [data, setData] = useState({});
  const [firstRender, setFirstRender] = useState(true);
  const [home, setHome] = useState(false);

  //OpenWeatherMap API geo url
  const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=1&appid=dd55c4767ae9847d2b72a4d08eeeb868`;

  //function to get the coordinates of the city written in the input box
  const getGeo = async () => {
    try {
      const { name, lat, lon } = (await axios.get(geoUrl)).data[0];
      const res = await axios.get(geoUrl);
      return { name, lat, lon };
    } catch (error) {
      alert('Please, enter a valid location');
    }
  };

  //Function to get the timezone name from latitude and longitude
  const getTimeZone = async (lat, lon) => {
    try {
      const timzoneUrl = `https://api.timezonedb.com/v2.1/get-time-zone?key=CERBC1PU4R1K&format=json&by=position&lat=${lat}&lng=${lon}`;
      const res = (await axios.get(timzoneUrl)).data.zoneName;
      return res;
    } catch (error) {
      console.log(error);
    }
  };

  //Function to get city name from coordinates
  const getReverseGeo = async (lat, lon) => {
    try {
      const reverseGeoUrl = `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=dd55c4767ae9847d2b72a4d08eeeb868`;
      const res = (await axios.get(reverseGeoUrl)).data[0];
      return res;
    } catch (error) {}
  };

  //OpenMeteo API weather url
  const weatherUrl = `https://api.open-meteo.com/v1/forecast?&hourly=temperature_2m,apparent_temperature,precipitation_probability,relativehumidity_2m,pressure_msl,uv_index,weathercode,windspeed_10m,is_day&daily=weathercode,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_probability_max,winddirection_10m_dominant&current_weather=true`;
  //function to obtain the weather (current, daily and hourly) from the coordinates obtained with OpenWeatherMap API geo function
  // Intl.DateTimeFormat().resolvedOptions().timeZone
  const getWeather = async (e, coords) => {
    try {
      if (coords) {
        setData({});
        const reverseGeo = await getReverseGeo(
          coords.latitude,
          coords.longitude
        );
        setCity(reverseGeo.name);
        const timezone = await getTimeZone(coords.latitude, coords.longitude);
        const { data } = await axios.get(weatherUrl, {
          params: {
            latitude: coords.latitude,
            longitude: coords.longitude,
            timezone,
          },
        });
        setData(data);
      } else {
        const geo = await getGeo();
        if (geo && e) {
          setData({});
          e.target.value = '';
          setLocation('');
          setFirstRender(false);
          setHome(true);
          setCity(geo.name);
          const timezone = await getTimeZone(geo.lat, geo.lon);
          const { data } = await axios.get(weatherUrl, {
            params: {
              latitude: geo.lat,
              longitude: geo.lon,
              timezone,
            },
          });
          setData(data);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  //function to define the icon and describe the weather from the "weathercode" provided by OpenMeteo API
  const getWeatherIcon = (weathercode) => {
    if (weathercode === 0) {
      return { icon: 0, description: 'Clear sky' };
    } else if (weathercode === 1) {
      return { icon: 1, description: 'Mainly clear' };
    } else if (weathercode === 2) {
      return { icon: 2, description: 'Partly cloudy' };
    } else if (weathercode === 3) {
      return { icon: 3, description: 'Overcast' };
    } else if (weathercode >= 40 && weathercode < 50) {
      return { icon: 40, description: 'Fog' };
    } else if (weathercode >= 50 && weathercode < 60) {
      return { icon: 50, description: 'Drizzle' };
    } else if (weathercode >= 60 && weathercode < 70) {
      return { icon: 60, description: 'Rain' };
    } else if (weathercode > 70 && weathercode <= 75) {
      return { icon: 70, description: 'Snow fall' };
    } else if (weathercode === 77) {
      return { icon: 77, description: 'Snow grains' };
    } else if (weathercode >= 80 && weathercode < 90) {
      return { icon: 80, description: 'Rain showers' };
    } else {
      return { icon: 90, description: 'Thunderstorm' };
    }
  };

  const geoSuccess = (pos) => {
    let coords = pos.coords;
    setFirstRender(false);
    setHome(true);
    getWeather(null, coords);
  };

  const geoError = () => {
    setFirstRender(true);
    setHome(false);
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(geoSuccess, geoError);
    setLocation('');
  }, []);

  return (
    <section
      id='home'
      className='flex flex-col items-center min-h-fit text-slate-100'
    >
      {firstRender === true && home === false ? (
        <div className='flex flex-col items-center justify-center w-[100dvw] h-[100dvh] min-w-[375px]'>
          <div className='border min-h-[350px] w-11/12 max-w-xl px-10 rounded-3xl flex flex-col items-center justify-evenly'>
            <div className='flex text-4xl text-center'>
              Welcome to Skycheck Weather App!
            </div>
            <div className='h-fit'>
              <div className='flex items-center flex-wrap justify-center'>
                <label className='text-lg mx-5 my-2 text-center'>
                  To start, please enter location here:{' '}
                </label>
                <input
                  placeholder='e.g. Buenos Aires'
                  className='flex text-black'
                  type='text'
                  onChange={(e) => setLocation(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      getWeather(e);
                      if (data.current_weather) {
                        getWeatherIcon(data.current_weather);
                      }
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      ) : firstRender === false && home === true ? (
        <div className='container'>
          <div className='min-w-[375px] min-h-[45px] flex justify-center items-center gap-2.5'>
            <label className='text-sm'>Enter Location: </label>
            <input
              placeholder='e.g. Buenos Aires'
              className='flex text-black'
              type='text'
              onChange={(e) => setLocation(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  getWeather(e);
                  if (data.current_weather) {
                    getWeatherIcon(data.current_weather);
                  }
                }
              }}
            />
          </div>
          <Main
            city={city}
            current={data.current_weather}
            daily={data.daily}
            getWeatherIcon={getWeatherIcon}
          />
          <Forecast daily={data.daily} getWeatherIcon={getWeatherIcon} />
          <Hours
            hourly={data.hourly}
            utc_offset={data.utc_offset_seconds}
            getWeatherIcon={getWeatherIcon}
          />
          <Misc
            current={data.current_weather}
            daily={data.daily}
            hourly={data.hourly}
            utc_offset={data.utc_offset_seconds}
          />
        </div>
      ) : (
        ''
      )}
    </section>
  );
}

export default App;
