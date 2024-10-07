<style scoped lang="css">
/* 基本重置 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* 容器樣式 */
.container {
  display: flex;
  flex-direction: row; /* 水平排列 */
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-family: 'Microsoft JhengHei', sans-serif;
  background-color: #f0f4f8; /* 整體背景色 */
  padding: 20px;
}

/* Box1 和 Box2 的共用樣式 */
.box1, .box2 {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
  text-align: center;
  margin: 10px;
  border-radius: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
}

/* Box1 特有樣式 */
.box1 {
  height: 40vh;
  width: 35vh;
  background-image: url('https://thumb.photo-ac.com/05/05fdab754d1ba8b565eab0fd92c6efb3_t.jpeg');
  background-color: #87CEEB; /* 假設圖片失效的備選 */
  background-size: cover;
  background-position: center;
  color: white;
}

/* Box2 特有樣式 */
.box2 {
  height: 35vh;
  width: 30vh;
  background-color: #4d4d4d;
  color: white;
}

/* 當滑鼠懸停在 Box 上時 */
.box1:hover, .box2:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 12px rgba(0, 0, 0, 0.2);
}

/* Header 樣式 */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: 10px;
}

.header h2 {
  font-size: 1.2rem;
  margin-right: 10px;
}

/* 下拉選單樣式 */
select {
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  background-color: rgba(255, 255, 255, 0.8);
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

select:hover {
  background-color: rgba(255, 255, 255, 1);
}

/* 文字段落樣式 */
p {
  font-size: 1rem;
  margin: 5px 0;
}

/* 錯誤訊息樣式 */
.error {
  margin-top: 20px;
  color: red;
  font-weight: bold;
}

/* 載入中樣式 */
.loading {
  margin-top: 20px;
  color: #333;
  font-weight: bold;
}

/* 響應式設計 */
@media (max-width: 768px) {
  .container {
    flex-direction: column; /* 垂直排列 */
    height: auto;
  }

  .box1, .box2 {
    width: 80vw;
    height: auto;
  }

  .header {
    flex-direction: column;
  }

  .header h2 {
    margin-bottom: 10px;
  }
}
</style>

<template>
  <div class="container">
    <div class="box1">
      <div class="header">
        <h2> {{ weatherData?.location?.[0]?.locationName || '當前城市' }} </h2>
        <select v-model="selectedCity" @change="getWeatherForCity">
          <option v-for="city in cityList" :key="city" :value="city">{{ city }}</option>
        </select>
      </div>
      <p>天氣: {{ weatherData?.location?.[0]?.weatherElement?.[0]?.time?.[0]?.parameter?.parameterName || 'N/A' }}</p>
      <p>溫度: {{ weatherData?.location?.[0]?.weatherElement?.[2]?.time?.[0]?.parameter?.parameterName || 'N/A' }}°C</p>
    </div>
    <div class="box2">
      <h2>下一時段預報</h2>
      <p>天氣: {{ weatherData?.location?.[0]?.weatherElement?.[0]?.time?.[1]?.parameter?.parameterName || 'N/A' }}</p>
      <p>溫度: {{ weatherData?.location?.[0]?.weatherElement?.[2]?.time?.[1]?.parameter?.parameterName || 'N/A' }}°C</p>
      <p>降雨機率: {{ weatherData?.location?.[0]?.weatherElement?.[1]?.time?.[1]?.parameter?.parameterName || 'N/A' }}%</p>
    </div>
    <!-- 錯誤訊息顯示 -->
    <div v-if="error" class="error">
      <p>{{ error }}</p>
    </div>
    <!-- 載入中顯示 -->
    <div v-else-if="!weatherData" class="loading">
      <p>載入中...</p>
    </div>
  </div>
</template>


<script>
import { useWeatherStore } from '@/stores/useWeather.js';
import { computed, onMounted, ref } from 'vue';

export default {
  setup() {
    const weatherStore = useWeatherStore();
    const selectedCity = ref('新北市');  // 預設城市
    const cityList = ['基隆市','臺北市','新北市','桃園市','新竹縣','新竹市','苗栗縣','臺中市','南投縣','彰化縣','雲林縣','嘉義縣','嘉義市','臺南市','高雄市','屏東縣','臺東縣','花蓮縣','宜蘭縣','金門縣','澎湖縣','連江縣'];  // 可以根據需求加入更多城市

    
    onMounted(() => {
      getWeatherForCity();  // 觸發 API 請求
    })

    // 根據選中城市更新天氣數據
    const getWeatherForCity = () => {
      weatherStore.fetchWeather(selectedCity.value);
    }

    const weatherData = computed(() => weatherStore.weatherData);
    const error = computed(() => weatherStore.error);

    return {
      weatherData,
      error,
      selectedCity,
      cityList,
      getWeatherForCity
    }
  }
}
</script>
