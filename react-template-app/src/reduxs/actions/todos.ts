import {ADD_TODO, DEL_TODO, SET_TODOS} from '@actionTypes/todos';
import {IAddTodoAction, IDelTodoAction, ISetTodosAction} from './interface/todos.i';

let nextTodoId = 0;

export const addTodo = (text: string): IAddTodoAction => {
  return {
    id: ++nextTodoId,
    text,
    type: ADD_TODO,
  };
};

export const delTodo = (id: number): IDelTodoAction => {
  return {
    id,
    type: DEL_TODO
  };
};

export const setTodos = (texts: string[]): ISetTodosAction => {
  const todos = [];
  for (const text of texts) {
    todos.push({
      id: ++nextTodoId,
      text,
    });
  }

  return {
    todos: todos,
    type: SET_TODOS
  };
};