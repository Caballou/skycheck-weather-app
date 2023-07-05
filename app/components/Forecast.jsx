import React from 'react';

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const Forecast = ({ daily, getWeatherIcon }) => {
  // console.log(daily);
  let weatherStatus = [];
  //if daily exist, get icon and description of 5 days forecast
  if (daily) {
    for (let i = 0; i < 5; i++) {
      weatherStatus[i] = getWeatherIcon(daily.weathercode[i]);
    }
  }

  const currentDay = new Date().getDay(); //returns the current day of the week

  let startDay = 0;
  if (currentDay === 6) {
    startDay = 1;
  }

  //string array to use "today" and "tomorrow" and the name of the next 3 days
  let forecastDays = [
    'Today',
    'Tomorrow',
    ...weekDays
      .slice(currentDay + 2, weekDays.length)
      .concat(weekDays.slice(startDay, currentDay)),
  ].slice(0, 5);

  return (
    <>
      {daily ? (
        <section id='forecast' className='flex justify-center py-1.5'>
          <div className='border border-white rounded-2xl w-11/12 max-w-3xl flex justify-center flex-col'>
            <div className=' h-14 px-5 flex justify-between items-center'>
              <div className='description'>5 Days Forecast</div>{' '}
              <div className='max-min'>Max / Min</div>
            </div>
            {forecastDays.map((day, i) => {
              return (
                <div className='flex py-1 px-5' key={i}>
                  {weatherStatus[i] ? (
                    <div className='w-6/12 flex items-center'>
                      <img
                        className='w-12'
                        src={`./icons/1-${weatherStatus[i].icon}.svg`}
                      />
                      {day}
                    </div>
                  ) : null}
                  <div className='flex justify-end items-center w-6/12'>{`${Math.round(
                    daily.temperature_2m_max[i]
                  )}° / ${Math.round(daily.temperature_2m_min[i])}°`}</div>
                </div>
              );
            })}
          </div>
        </section>
      ) : (
        <section id='forecast'></section>
      )}
    </>
  );
};

export default Forecast;
