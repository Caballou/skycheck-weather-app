import React from 'react';

const Main = ({ city, current, daily, getWeatherIcon }) => {
  let weatherStatus;
  //if current weather exists, get icon and description of current weather
  if (current) {
    weatherStatus = getWeatherIcon(current.weathercode);
  }

  return (
    <section
      id='main'
      className='min-h-[38vh] h-fit flex items-center justify-center'
    >
      {current ? (
        <div className='w-[90vw] flex flex-col items-center justify-center'>
          <div className='mt-5 -mb-1.5'>{city}</div>
          <img
            className='w-44'
            src={`./icons/${current.is_day}-${weatherStatus.icon}.svg`}
          />

          <div className='flex justify-center text-7xl -mt-4 mb-2.5 '>
            {Math.round(current.temperature)}
            <span className='pt-1 text-2xl'>°C</span>
          </div>
          <div className='tetx-xl flex flex-wrap justify-center mb-5 gap-5'>
            {weatherStatus.description}
            <div className='max-min'>
              {`${Math.round(daily.temperature_2m_max[0])}° / ${Math.round(
                daily.temperature_2m_min[0]
              )}°`}
            </div>
          </div>
        </div>
      ) : (
        <div></div>
      )}
    </section>
  );
};

export default Main;
