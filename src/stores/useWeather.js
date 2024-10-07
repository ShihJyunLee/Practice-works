import { defineStore } from 'pinia'
import { ref,computed  } from 'vue'
import axios from 'axios';
import { nextTick } from 'vue';

export const useWeatherStore  = defineStore('weather',() => {
  // 狀態
  const weatherData = ref(null);  // 存儲天氣數據
  const error = ref(null);  // 錯誤信息

  // 請求天氣數據
  const fetchWeather = async (city) => {
    const apiKey = import.meta.env.VITE_WEATHER_API_AUTH;
    const apiUrl = `https://opendata.cwa.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=${apiKey}&locationName=${city}`; 

    try {
      const response = await axios.get(apiUrl);
      weatherData.value = response.data.records;  // 儲存 API 回應的天氣數據
      console.log(response.data.records)
      await nextTick();
    } catch (err) {
      error.value = err.message;  // 儲存錯誤信息
    }
  }

  return {
    weatherData,
    error,
    fetchWeather,
  }
})