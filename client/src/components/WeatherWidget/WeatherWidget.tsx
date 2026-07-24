import "./weatherwidget.scss";
import { useState, useEffect } from "react";

const degreeSymbol = "°";

export default function WeatherWidget() {
  const [weatherData, setWeatherData] = useState<any>(null);
  const [isCelsiusMode, setIsCelsiusMode] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("https://wttr.in/?format=j1");
      const data = await res.json();
      setWeatherData(data);
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!weatherData) return;
    console.log("weatherData:", weatherData);
  }, [weatherData]);

  return (
    <div className="weather-widget">
      {weatherData ? (
        <>
          <div className="location-name">
            {`${weatherData.nearest_area[0].areaName[0].value}, ${weatherData.nearest_area[0].region[0].value}`}{" "}
            <div
              className="celsius-toggle"
              onClick={() => setIsCelsiusMode(!isCelsiusMode)}
            >
              {isCelsiusMode ? "C°" : "F°"}
            </div>
          </div>
          <div className="ww-main">
            <div className="ww-current">
              <p className="header">
                {(() => {
                  const [, month, day] = weatherData.weather[0].date.split("-");
                  return `${Number(month)}/${Number(day)}`;
                })()}
              </p>
              <div className="current-main">
                <div className="icon-container">
                  <img
                    src={`${weatherData.current_condition[0].weatherIconUrl[0].value}`}
                  />
                </div>
                <div className="current-data">
                  <div className="current-temp">
                    Current:{" "}
                    <b>
                      {`${isCelsiusMode ? weatherData.current_condition[0].temp_C : weatherData.current_condition[0].temp_F}${degreeSymbol}`}
                    </b>
                  </div>
                  <div className="current-feels-like">
                    Feels Like:{" "}
                    <b>
                      {`${isCelsiusMode ? weatherData.current_condition[0].FeelsLikeC : weatherData.current_condition[0].FeelsLikeF}${degreeSymbol}`}
                    </b>
                  </div>
                  <div className="current-average-temp">
                    Avg Temp:{" "}
                    <b>
                      {`${isCelsiusMode ? weatherData.weather[0].avgtempC : weatherData.weather[0].avgtempF}${degreeSymbol}`}
                    </b>
                  </div>
                  <div className="min-max">
                    Min/Max:{" "}
                    <b>
                      {isCelsiusMode
                        ? `${weatherData.weather[0].mintempC}/${weatherData.weather[0].maxtempC}${degreeSymbol}`
                        : `${weatherData.weather[0].mintempF}/${weatherData.weather[0].maxtempF}${degreeSymbol}`}
                    </b>
                  </div>
                </div>
              </div>
            </div>
            <div className="ww-forecast">
              <div className="ww-next-day">
                <p className="header">
                  {(() => {
                    const [, month, day] =
                      weatherData.weather[1].date.split("-");
                    return `${Number(month)}/${Number(day)}`;
                  })()}
                </p>
                <div className="main">
                  <div className="next-average-temp">
                    Avg Temp:{" "}
                    <b>
                      {`${isCelsiusMode ? weatherData.weather[1].avgtempC : weatherData.weather[1].avgtempF}${degreeSymbol}`}
                    </b>
                  </div>
                  <div className="min-max">
                    Min/Max:{" "}
                    <b>
                      {isCelsiusMode
                        ? `${weatherData.weather[1].mintempC}/${weatherData.weather[1].maxtempC}${degreeSymbol}`
                        : `${weatherData.weather[1].mintempF}/${weatherData.weather[1].maxtempF}${degreeSymbol}`}
                    </b>
                  </div>
                </div>
              </div>
              <div className="ww-next-next-day">
                <p className="header">
                  {(() => {
                    const [, month, day] =
                      weatherData.weather[2].date.split("-");
                    return `${Number(month)}/${Number(day)}`;
                  })()}
                </p>
                <div className="main">
                  <div className="next-average-temp">
                    Avg Temp:{" "}
                    <b>
                      {`${isCelsiusMode ? weatherData.weather[2].avgtempC : weatherData.weather[2].avgtempF}${degreeSymbol}`}
                    </b>
                  </div>
                  <div className="min-max">
                    Min/Max:{" "}
                    <b>
                      {isCelsiusMode
                        ? `${weatherData.weather[2].mintempC}/${weatherData.weather[2].maxtempC}${degreeSymbol}`
                        : `${weatherData.weather[2].mintempF}/${weatherData.weather[2].maxtempF}${degreeSymbol}`}
                    </b>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="location-name">Loading...</div>
      )}
    </div>
  );
}
