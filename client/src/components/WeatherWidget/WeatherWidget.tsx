import "./weatherwidget.scss";
import { useState, useEffect } from "react";

export default function WeatherWidget() {
  const [weatherData, setWeatherData] = useState<any>(null);
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
        <div className="location-name">{`${weatherData.nearest_area[0].areaName[0].value}, ${weatherData.nearest_area[0].region[0].value}`}</div>
      ) : (
        <p>Loading</p>
      )}
    </div>
  );
}
