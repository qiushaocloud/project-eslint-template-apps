import {ADD_TODO, DEL_TODO, SET_TODOS} from '@actionTypes/todos';
import {ITodosAction} from '@actions/interface/todos.i';

interface ITodo {
  id: number;
  text: string;
}

const initialState: ITodo[] = [];

const todosReducer = (state = initialState, action: ITodosAction): ITodo[] => {
  switch (action.type) {
    case ADD_TODO: {
      const index = state.findIndex(item => item.id === action.id);
      if (index !== -1) {
        if (state[index].text === action.text) return state;
        const updatedTodos = state.slice(0);
        updatedTodos[index].text = action.text;
        return updatedTodos;
      }

      return [
        ...state,
        {
          id: action.id,
          text: action.text
        }
      ];
    }
    case DEL_TODO: {
      const index = state.findIndex(item => item.id === action.id);
      if (index === -1) return state;

      // 创建一个新的数组，不包含要删除的 todo 对象
      const updatedTodos = [...state.slice(0, index), ...state.slice(index + 1)];
      return updatedTodos;
    }
    case SET_TODOS: {
      const updatedTodos = state.slice(0);
      const todos = action.todos;
      for (const todo of todos) {
        const index = state.findIndex(item => item.id === todo.id);
        if (index !== -1) {
          if (state[index].text === todo.text) continue;
          Object.assign(updatedTodos[index], todo);
          continue;
        }

        updatedTodos.push(todo);
      }
      return updatedTodos;
    }
    default:
      return state;
  }
};

export default todosReducer;