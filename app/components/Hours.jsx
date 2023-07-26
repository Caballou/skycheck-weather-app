import React from 'react';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/splide/dist/css/splide.min.css';
import useMediaQuery from '../hooks/useMediaQuery';

const Hours = ({ hourly, utc_offset, getWeatherIcon }) => {
  let weatherStatus = [];
  let hoursLabels = ['Now'];
  let hourObject = [];

  const currentHour = new Date().getUTCHours() + utc_offset / 3600;

  if (hourly) {
    for (let i = 0; i < 24; i++) {
      weatherStatus[i] = getWeatherIcon(hourly.weathercode[currentHour + i]);
      hoursLabels = [
        ...hoursLabels,
        hourly.time[currentHour + i + 1].slice(-5),
      ];
      hourObject[i] = {
        temp: hourly.temperature_2m[currentHour + i],
        wind: hourly.windspeed_10m[currentHour + i],
        icon: weatherStatus[i].icon,
        isDay: hourly.is_day[currentHour + i],
        label: hoursLabels[i],
        index: new Date().getHours() + i,
      };
    }
  }
  // console.log(hourObject);

  const isSmallScreen = useMediaQuery('sm');

  return (
    <>
      {hourly ? (
        <section
          id='hours'
          className='flex min-h-[20vh] justify-center py-1.5 '
        >
          <div className='border border-white rounded-2xl w-11/12 max-w-3xl'>
            <div className='pt-5 px-5 flex justify-between'>
              24 Hours Forecast
            </div>
            <div className='h-40 flex flex-col'>
              {isSmallScreen ? (
                <Splide
                  options={{
                    gap: '5px',
                    type: 'slide',
                    drag: 'free',
                    arrows: true,
                    pagination: false,
                    perPage: 4,
                  }}
                >
                  {hourObject.map((hour, i) => (
                    <SplideSlide className='flex h-full' key={i}>
                      <div className='flex flex-col justify-center items-center w-full h-40'>
                        <div className='flex'>{hour.temp} °C</div>
                        <div>
                          <img src={`./icons/${hour.isDay}-${hour.icon}.svg`} />
                        </div>
                        <div>{hour.wind} km/h</div>
                        <div>{hour.label}</div>
                      </div>
                    </SplideSlide>
                  ))}
                </Splide>
              ) : (
                <Splide
                  options={{
                    gap: '5px',
                    type: 'slide',
                    drag: 'free',
                    arrows: false,
                    pagination: false,
                    perPage: 4,
                  }}
                >
                  {hourObject.map((hour, i) => (
                    <SplideSlide className='flex h-full' key={i}>
                      <div className='flex flex-col justify-center items-center w-full h-40'>
                        <div className='flex'>{hour.temp} °C</div>
                        <div>
                          <img src={`./icons/${hour.isDay}-${hour.icon}.svg`} />
                        </div>
                        <div>{hour.wind} km/h</div>
                        <div>{hour.label}</div>
                      </div>
                    </SplideSlide>
                  ))}
                </Splide>
              )}
            </div>
          </div>
        </section>
      ) : (
        ''
      )}
    </>
  );
};

export default Hours;
