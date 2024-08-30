import { defineStore } from 'pinia'
import { ref,computed  } from 'vue'
import { nanoid } from 'nanoid' // 用來生成唯一ID


export const useTodoStore = defineStore('useTodo',() => {
  // reactive 的陣列，用來存儲所有的待辦事項項目
  const todos = ref([])
  const filterStatus = ref('all')

  // 添加待辦事項的方法
  const addTodo = (todo) => {
    todos.value.push({ id: nanoid(),text:todo,done:false,isEditing:false})
  }

  // 刪除代辦事項的方法(利用filter重組陣列)
  const removeTodo = (id) => {
    todos.value = todos.value.filter(todo => todo.id !== id)
  }

  // 切換代辦事項狀態
  const toggleTodo = (id) => {
    const todo = todos.value.find(todo => todo.id === id)
    if (todo) {
      todo.done = !todo.done
    }
  }

  //計算過濾代辦事項(當filterStatus為completed，回傳todos陣列所有done為true)
  const filteredTodos = computed(() => {
    if (filterStatus.value === 'completed') {
      return todos.value.filter(todo => todo.done);
    } else if (filterStatus.value === 'incomplete') {
      // 當filterStatus為incomplete，回傳todos陣列所有done為false
      return todos.value.filter(todo => !todo.done);
    } else {
      // 回傳todos，不進行過濾
      return todos.value;
    }
  })

  // 開始編輯待辦事項
  const startEditing = (id) => {
    const todo = todos.value.find(todo => todo.id === id)
    if (todo) {
      todo.isEditing = true
      editedText.value = todo.text
    }
  }

  // 完成編輯待辦事項
  const finishEditing = (id, newText) => {
    const todo = todos.value.find(todo => todo.id === id)
    if (todo) {
      todo.text = newText
      todo.isEditing = false
    }
  }

  const cancelEditing = (id) => {
    const todo = todos.value.find(todo => todo.id === id)
    if (todo) {
      todo.isEditing = false
    }
  }

  //返回狀態
  return {
    todos,
    addTodo,
    removeTodo,
    toggleTodo,
    filteredTodos,
    filterStatus,
    startEditing,
    finishEditing,
    cancelEditing
  }
})