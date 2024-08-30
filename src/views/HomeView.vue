<style scoped lang="css">
/* 註解:Shift + Alt + A */

/*   * {
  border:1px solid black
} */

.all {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

h1 {
  letter-spacing: 5px;
}
</style>

<template>
  <div class="all">
    <h1>練習小工具</h1>
    <div class="link">
      <router-link to="/todolist">Todolist</router-link>
    </div>
  </div>
</template>
