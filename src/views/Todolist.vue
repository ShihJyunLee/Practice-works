<style  scoped lang="css">
*{
  padding: 0;
  margin: 0;
}

h1{
  display: flex;
  justify-content: center;
  padding-top: 5vh;
  letter-spacing: 16px;
}

.todo-container {
  max-width: 50vh;
  margin: 20px auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: row;
  align-items: center; 
}

.todo-input {
  width: calc(100% - 60px);
  padding: 10px;
  margin-right: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
}

.todo-button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
  white-space: nowrap;
}

.todo-button:hover {
  background-color: #0056b3;
}

.todo-list {
  max-width: 50vh;
  list-style: none;
  padding-top: 2vh;
  margin: 20px auto;
  overflow-wrap: break-word;
}

.todo-item {
  margin-top: 25px;
  padding: 0px 10px;
  border-bottom: 1px solid #ccc;
}

.todo-list-button{
  display: flex;
  justify-content: flex-end;
  gap: 15px
}

.text-button{
  background-color:transparent;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s;
  font-size: 18px;
  padding: 3px;
}

.text-button:hover{
  background-color: #e8f1ea;
}

.todo-done .todo-text {
  color: lightgray;
  text-decoration: line-through;
}

.filter-buttons {
  display: flex;
  justify-content: center;
}

.filter-buttons button {
  padding: 5px 15px;
  margin-right: 15px;
  cursor: pointer;
  background-color: #f0f0f0;
  border:0;
  border-radius: 5px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
}

.filter-buttons button:hover {
  background-color: #e0e0e0;
  box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px)
}

.filter-buttons button.active {
  font-weight: bold;
  background-color: #007bff;
  color: white;
  box-shadow: 0 6px 8px rgba(0, 0, 0, 0.2);
}

.edit-container {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 10px;
}

.edit-input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: border-color 0.3s, box-shadow 0.3s;
}

.edit-input:focus {
  border-color: #007bff;
  box-shadow: 0 2px 6px rgba(0, 0, 255, 0.2);
  outline: none;
}

.edit-button {
  padding: 8px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s, transform 0.2s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.edit-button.confirm {
  background-color: #28a745;
  color: white;
}

.edit-button.confirm:hover {
  background-color: #218838;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
  transform: translateY(-2px);
}

.edit-button.cancel {
  background-color: #dc3545;
  color: white;
}

.edit-button.cancel:hover {
  background-color: #c82333;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
  transform: translateY(-2px);
}
</style>

<template>
  <div>
    <h1>Todo-List✎</h1>
    <div class="todo-container">
      <input type="text" class="todo-input" placeholder="寫下代辦事項" v-model="newTodo"/>
      <button type="button" class="todo-button" @click="addTodo">送出</button>
    </div>
    <div class="todo-list-container">
      <div class="filter-buttons">
        <button :class="{ active: todoStore.filterStatus === 'all' }"  @click="setFilterStatus('all')">全部</button>
        <button :class="{ active: todoStore.filterStatus === 'completed' }" @click="setFilterStatus('completed')">已完成</button>
        <button :class="{ active: todoStore.filterStatus === 'incomplete' }"  @click="setFilterStatus('incomplete')">未完成</button>
      </div>
      <ul class="todo-list">
        <li v-for="todo in todoStore.filteredTodos" :key="todo.id" class="todo-item" :class="{ 'todo-done': todo.done }">
          <span v-if="!todo.isEditing" class="todo-text">{{ todo.text }}</span>
          <div v-else class="edit-container">
            <input type="text" v-model="editedText" placeholder="請輸入新的待辦事項" class="edit-input" />
            <button @click="finishEditing(todo.id)" class="edit-button confirm">送出</button>
            <button @click="cancelEditing(todo.id)" class="edit-button cancel">取消</button>
          </div>
          <span class="todo-list-button">
            <button type="button" title="編輯" class="text-button" style="color:yellowgreen"  @click="todoStore.startEditing(todo.id)">✎</button>
            <button type="button" title="完成" class="text-button" style="color:green" @click="todoStore.toggleTodo(todo.id)">✔</button>
            <button type="button" title="刪除" class="text-button" style="color:red" @click="todoStore.removeTodo(todo.id)">✖</button>
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useTodoStore } from '../stores/useTodoStore.js'

const todoStore = useTodoStore()
// reactive 變數，用來保存用戶當前輸入的待辦事項
const newTodo = ref('')
// 儲存編輯的文字
const editedText = ref('')

// 當newTodo內容不是空值，觸發useTodoStore裡面addTodo函式並帶入參數。
const addTodo = () => {
  if(newTodo.value.trim()){
    todoStore.addTodo(newTodo.value)
    newTodo.value = ''
  }
}

// 變更篩選狀態，並傳給pinia
const setFilterStatus = (status) => {
  todoStore.filterStatus = status
}

// 完成編輯
const finishEditing = (id) => {
  todoStore.finishEditing(id, editedText.value)
  editedText.value = '' // 清空編輯文本
}

// 取消編輯
const cancelEditing = (id) => {
  todoStore.cancelEditing(id)
  editedText.value = ''
}

</script>