import {ADD_TODO, DEL_TODO, SET_TODOS} from '@actionTypes/todos';
import {IAddTodoAction, IDelTodoAction, ISetTodosAction} from './interface/todos.i';
import {storeDispatch} from '@storets';

let nextTodoId = 0;

export const addTodo = (text: string): void => {
  const action: IAddTodoAction = {
    id: ++nextTodoId,
    text,
    type: ADD_TODO,
  };
  storeDispatch(action);
};

export const delTodo = (id?: number): void => {
  if (id === undefined) return;
  const action: IDelTodoAction = {
    id,
    type: DEL_TODO
  };
  storeDispatch(action);

};

export const setTodos = (texts: string[]): void  => {
  const todos = [];
  for (const text of texts) {
    todos.push({
      id: ++nextTodoId,
      text,
    });
  }

  const action: ISetTodosAction = {
    todos: todos,
    type: SET_TODOS
  };
  storeDispatch(action);
};