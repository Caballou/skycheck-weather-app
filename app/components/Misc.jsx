import React from 'react';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/splide/dist/css/splide.min.css';
import { AutoScroll } from '@splidejs/splide-extension-auto-scroll';
import useMediaQuery from '../hooks/useMediaQuery';

const Misc = ({ current, daily, hourly, utc_offset }) => {
  // console.log('current: ', current);
  // console.log('daily:', daily);
  // console.log('hourly:', hourly);

  //Get wind direction text from angle degrees
  const getWindDirection = (winddirection) => {
    if (winddirection <= 20 || winddirection >= 340) {
      return 'North';
    } else if (winddirection > 20 && winddirection < 70) {
      return 'NorthEast';
    } else if (winddirection >= 70 && winddirection <= 110) {
      return 'East';
    } else if (winddirection > 110 && winddirection < 160) {
      return 'SouthEast';
    } else if (winddirection >= 160 && winddirection <= 200) {
      return 'South';
    } else if (winddirection > 200 && winddirection < 250) {
      return 'SouthWest';
    } else if (winddirection >= 250 && winddirection <= 290) {
      return 'West';
    } else {
      return 'NorthWest';
    }
  };

  const currentHour = new Date().getHours() + utc_offset / 3600;

  const isMediumScreen = useMediaQuery('md');

  return (
    <>
      {current ? (
        <section id='misc' className='flex min-h-[25vh] justify-center py-1.5 '>
          <div className='flex w-11/12 max-w-3xl'>
            <div className='w-6/12'>
              <div className='border border-white flex justify-evenly items-center rounded-2xl mr-2 mb-2 h-[48%]'>
                <div className='flex flex-col'>
                  <div>{getWindDirection(current.winddirection)}</div>
                  <div>{current.windspeed} km/h</div>
                </div>
                {/* prettier-ignore */}
                <svg height={80} width={80}>
                  <circle cx={40} cy={40} r={36} stroke='white' strokeWidth={2} fill='transparent' />
                  <text x={34} y={20} fill='white'>N</text>
                  <text x={35} y={72} fill='white'>S</text>
                  <text x={63} y={46} fill='white'>E</text>
                  <text x={7} y={46} fill='white'>W</text>
                  <defs>
                    {/* Arrow head */}
                    <marker 
                      id="arrowhead" 
                      markerWidth="5" 
                      markerHeight="5" 
                      refX="0" refY="2.5" 
                      orient="auto">
                      <polygon points="0 0, 5 2.5, 0 5" fill='white'/>
                    </marker>
                  </defs>
                  {/* Half top line */}
                  <line 
                    x1={40} 
                    y1={40} 
                    x2={16 * Math.cos((Math.PI / 2) * (current.winddirection / 90 - 1)) + 40}
                    y2={16 * Math.sin((Math.PI / 2) * (current.winddirection / 90 - 1)) + 40}
                    stroke='white'
                    strokeWidth={2}
                  />
                  {/* Half bot line */}
                  <line 
                    x1={40} 
                    y1={40}
                    x2={-4 * Math.cos((Math.PI / 2) * (current.winddirection / 90 - 1)) + 40}
                    y2={-4 * Math.sin((Math.PI / 2) * (current.winddirection / 90 - 1)) + 40}
                    stroke='white'
                    strokeWidth={2}
                    markerEnd='url(#arrowhead)'
                  />
                </svg>
              </div>

              <div className='border border-white flex flex-col justify-center items-center rounded-2xl mr-2 mb-2 h-[48%]'>
                <div>Sunrise: {daily.sunrise[0].slice(-5)}</div>
                <div>Sunset: {daily.sunset[0].slice(-5)}</div>
              </div>
            </div>

            <div className='border border-white rounded-2xl w-6/12'>
              <ul className='flex flex-col justify-evenly h-full w-full py-2'>
                <li className='flex justify-between px-4 py-1'>
                  <div>Humidity</div>
                  <div>{hourly.relativehumidity_2m[currentHour]}%</div>
                </li>
                <li className='flex justify-between px-4 py-1'>
                  <div>Real Feel</div>
                  <div>{hourly.apparent_temperature[currentHour]}°</div>
                </li>
                <li className='flex justify-between px-4 py-1'>
                  <div>UV</div>
                  <div>{hourly.uv_index[currentHour]}</div>
                </li>
                <li className='flex justify-between px-4 py-1'>
                  <div>Pressure</div>
                  <div>
                    {Math.round(hourly.pressure_msl[currentHour])}
                    <label className='text-xs'>mbar</label>
                  </div>
                </li>
                <li className='flex justify-between px-4 py-1'>
                  <div className='w-4/6'>
                    {!isMediumScreen ? (
                      <Splide
                        options={{
                          type: 'loop',
                          gap: '100px',
                          drag: false,
                          arrows: false,
                          pagination: false,
                          perPage: 1,
                          autoScroll: {
                            pauseOnHover: true,
                            pauseOnFocus: true,
                            rewind: false,
                            speed: 0.4,
                          },
                        }}
                        extensions={{ AutoScroll }}
                      >
                        {' '}
                        <SplideSlide className='flex h-full whitespace-nowrap'>
                          Precipitation Probability
                        </SplideSlide>
                      </Splide>
                    ) : (
                      <div>Precipitation Probability</div>
                    )}
                  </div>
                  <div>{hourly.precipitation_probability[currentHour]}%</div>
                </li>
              </ul>
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
};

export default Misc;
