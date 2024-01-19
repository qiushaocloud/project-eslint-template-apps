import {ADD_TODO, DEL_TODO, SET_TODOS} from '@actionTypes/todos';

export interface IAddTodoAction {
    id: number;
    text: string;
    type: ADD_TODO;
}

export interface IDelTodoAction {
    id: number;
    type: DEL_TODO;
}

export interface ISetTodosAction {
    todos: {id: number, text: string}[],
    type: SET_TODOS;
}

export type ITodosAction = IAddTodoAction | IDelTodoAction | ISetTodosAction;
