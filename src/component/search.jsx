import React, { useEffect, useState } from 'react'
import Input from './input'
import './index.css'

function search() {
  const [data, setData] = useState();
  const [city, setCity] = useState("delhi");
  const [umbrellaRequired, setUmbrellaRequired] = useState(false);
  const [locate, setLocation] = useState()
  console.log(umbrellaRequired);

  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000); // Update every second 
    return () => clearInterval(interval);// Cleanup the interval on unmount
  }, []);

      const hours = currentDateTime.getHours().toLocaleString();
      const minutes = currentDateTime.getMinutes().toLocaleString();
      const seconds = currentDateTime.getSeconds().toLocaleString();
      const formattedTime = `${hours}:${minutes}:${seconds}`;

      const date = currentDateTime.getDate().toString();
      const month = currentDateTime.getMonth().toString();
      const year = currentDateTime.getFullYear().toString();
      const  day_month_year = `${date}/${month}/${year}`;
  

  useEffect(() => {
    const fetchData = async() => {
      try {
        const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&metric&units=metric&appid=599f1045cba255c30f7664916f6950ae`)
        const data = await res.json();
        setData(data);

        if (data && data.weather && data.weather.length > 0 ) {
          if (data.weather[0].description === 'rain' || data.weather[0].description === 'drizzle' || data.weather[0].description === 'showers' || data.main.humidity > 70 || data.cloud.all >70 || data.wind.speed > 10 ) {
            setUmbrellaRequired(true);
          } else {
            setUmbrellaRequired(false);
          }
        }

      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, [city])
  
  console.log(data);


  function convertUtcToIst(utcTime) {
    const utcDate = new Date(utcTime * 1000); 
    const istDate = new Date(utcDate.getTime());
    return istDate;
  }
  
  const sunrise = convertUtcToIst(data?.sys?.sunrise); 
  const sunset = convertUtcToIst(data?.sys?.sunset); 
  
  const latitude = data?.coord?.lat; // Latitude of the location
  const cloudCoverPercentage = data?.clouds?.all; // Percentage of cloud cover
  console.log(latitude);
  console.log(cloudCoverPercentage);

  let uvIndex = 0;
  if (latitude > 23.5) {
      uvIndex = 12; 
  } else {
      uvIndex = 12 * (latitude / 23.5);
  }
  uvIndex = uvIndex * (100 - cloudCoverPercentage) / 100;
  uvIndex = uvIndex.toFixed(1);

  // const location = () => {
  //   navigator.geolocation.getCurrentPosition(
  //     position => {
  //       const { latitude, longitude } = position.coords;
  //       setLocation({ latitude, longitude });
  //       // Fetch city name using reverse geocoding
  //       fetchCityName(latitude, longitude);
  //     }
  //   )
  // }

  // const fetchCityName = async(lat, lon) => {
  //   try {
  //     const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&metric&units=metric&appid=d381b20ed7f7d99018426989322ad0f8`)
  //     const data = await res.json();
  //     setData(data);

  //     if (data && data.weather && data.weather.length > 0 ) {
  //       if (data.weather[0].description === 'rain' || data.weather[0].description === 'drizzle' || data.weather[0].description === 'showers' || data.main.humidity > 70 || data.cloud.all >70 || data.wind.speed > 10 ) {
  //         setUmbrellaRequired(true);
  //       } else {
  //         setUmbrellaRequired(false);
  //       }
  //     }

  //   } catch (error) {
  //     console.log(error);
  //   }
  // }  


  return (
    
    <>
        <div className='search '>
          <div className='search-child'>
            <div className='search-navbar mt-10'>
              <div className='text-2xl font-serif  text-gray-700'>Weather Application</div>
                <div className='sh flex justify-between'>
                  {/* <div className='border rounded-tl-2xl rounded-bl-2xl'><img src='../../public/adreess icon in black.png' className='mt-1 ml-2 mr-1' width="17" /></div> */}
                  <Input className="w-96 rounded-tl-lg  font-serif rounded-bl-lg" placeholder="enter your location" type="text" value={city} onChange={(e) => setCity(e.target.value)}/>
                  <div className='rounded-tr-lg rounded-br-lg bg-white'><img src='https://thumb.ac-illust.com/ce/cef480ef2d30b4eefd1dbdfb024bacd9_t.jpeg' className='mt-2 ml-1 mr-2 bg-white' width="22" /></div>
                </div>
            </div>
            {data?.main? <>
            <div className='flex  mt-10 justify-between'>
              <div className='image h-60'>
                <p className='image-child mt-10 absolute ml-8 text-xl font-light font-serif text-gray-700'>Temperature: </p>
                <p className='image-child mt-16 absolute text-7xl ml-10'>{data?.main?.temp } &deg;</p>

                <p className='image-child absolute ml-96 w-80 text-3xl font-serif text-white mt-2'>{city}</p>
                <p className='image-child ml-96 absolute w-80 text-xl font-serif text-white mt-10 '>{data?.sys?.country}</p>

                <p className='image-child ml-80 absolute text-xl font-serif text-gray-700 mt-16 '>max: {data?.main?.temp_max}&deg;</p>
                <p className='image-child ml-80 absolute text-xl font-serif text-gray-700 mt-24 '>min: {data?.main?.temp_min}&deg;</p>

                <p className='image-child ml-6 absolute text-lg font-serif text-gray-800 mt-48 '>Fell like: {data?.main?.feels_like}&deg;</p>
                <p className='image-child ml-44 absolute text-lg font-serif text-gray-800 mt-48 '>{umbrellaRequired ? 'Umbrella required' : 'no need of umbrella'}</p>

                <p className='image-child ml-96 pl-36 absolute text-xl font-serif text-gray-800 mt-40 pt-2 '>{formattedTime}</p>
                <p className='image-child ml-96 pl-36 absolute text-lg font-serif text-gray-800 mt-48 '>{day_month_year}</p>
              </div>
              <div className='image-side col h-56 text-xl mt-4 font-serif text-gray-500'>
                <div className='col mt-2'>Wind</div>
                <img src='https://t4.ftcdn.net/jpg/06/01/13/51/360_F_601135131_2NWepBS7U7BguU6HkE5XHlGodl7sPQqC.jpg' width='100' className='ml-12' />
                <div className='col text-5xl text-blue-400'>{data?.wind?.speed}<span className='col text-xl '>km/h</span></div>

              </div>
              <div className='image-side col h-56 text-xl mt-4 font-serif text-gray-500'>
                <div className='col mt-2'>Humidity</div>
                <img src='https://static.vecteezy.com/system/resources/previews/021/829/033/original/icon-humidity-weather-elements-symbol-icons-in-filled-line-style-good-for-prints-web-smartphone-app-posters-infographics-logo-sign-etc-vector.jpg' width='83' className='ml-12' />
                <div className='col text-5xl text-blue-400 mt-3'>{data?.main?.humidity}<span className='col text-xl '>% </span></div>
              </div>
            </div>

            <div className='flex justify-between mt-10'>
              <div className='image-side sd1 col h-56 text-xl mt-4 font-serif text-gray-500'>
                <div className='col mt-2'>UV Index</div>
                <img src='https://previews.123rf.com/images/ascom73/ascom732105/ascom73210500067/169915955-uv-radiation-icon-vector-solar-ultraviolet-light-symbol-for-graphic-design-logo-web-site-social.jpg' width='83' className='ml-14' />
                <div className='col text-5xl text-blue-400'>{uvIndex}<span className='col text-xl '></span></div>
              </div>
              <div className='image-side sd2 col h-56 text-xl mt-4 font-serif text-gray-500'>
                <div className='col mt-2'>Pressure</div>
                <img src='https://thumbs.dreamstime.com/b/atmospheric-pressure-planet-icon-vector-outline-illustration-sign-color-symbol-179417988.jpg' width='83' className='ml-14' />
                <div className='col text-5xl mt-2 text-blue-400'>{data?.main?.pressure}<span className='col text-xl '> hpa</span></div>
              </div>
              <div className='image-side sd3 col h-56 text-xl mt-4 font-serif text-gray-500'>
                <div className='col mt-2'>Visibility</div>
                <img src='https://png.pngtree.com/png-clipart/20200224/original/pngtree-eye-icon-isolated-on-background-png-image_5207343.jpg' width='83' className='ml-14' />
                <div className='col text-5xl text-blue-400 mt-3'>{data?.visibility /1000} <span className='col text-xl '> km </span></div>
              </div>
              
              <div className='image-side sd4 col h-56 text-xl mt-4 font-serif text-gray-500'>
                <div className='col flex justify-center mt-4 mr-3'>
                  <img src='https://as2.ftcdn.net/v2/jpg/03/36/31/19/1000_F_336311979_ZdVsReVwU3fxD36tduWxg03PaZrCiU07.jpg' width="50"/>
                  <div className='col mt-2 text-2xl'>Sunrise</div>
                </div>
                <div className='col text-2xl text-blue-400'>{sunrise.toLocaleTimeString()}</div>
                <div className='col flex justify-center mt-4 mr-3'>
                  <img src='https://t4.ftcdn.net/jpg/01/02/27/51/360_F_102275153_HLFr7oDjcMPz8hkh1Cbdr75yQO8wDMnL.jpg' width="50" className='mt-1'/>
                  <div className='col mt-2 text-2xl'>Sunset</div>
                </div>
                <div className='col text-2xl text-blue-400'>{sunset.toLocaleTimeString()}</div>
              </div>
            </div>
            </> : <div className='mt-72 text-2xl rounded-xl font-medium sh bg-blue-400 py-2 text-white'>No Result Data Found for this City</div>
            } 
          </div>
        </div>
        <div className='mt-2 text-xl rounded-lg font-medium sh py-1 text-red-400'>Message: I did not found any free API key that can show 5 days data.<br></br>About Project: Built by Tushar saini Email id: ttushar476@gmail.com</div>
    </>
  )
}

export default search
