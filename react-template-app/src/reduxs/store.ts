import {configureStore} from '@reduxjs/toolkit';
import {combineReducers} from 'redux';
import logger from 'redux-logger';
import {useDispatch, useSelector, TypedUseSelectorHook} from 'react-redux';
import {sliceReducers} from './features';
import {standardReducers} from './reducers';

export const rootReducer = combineReducers({
  ...sliceReducers,
  ...standardReducers
});

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV === 'development',
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore middleware
  middleware: process.env.NODE_ENV === 'development' ? (getDefaultMiddleware) => {
    // logger： 使用了日志的中间件,可以追踪到哪个页面在哪个时候使用了该reducer,并且可以显示调用前的数据状态和调用后的数据状态
    return getDefaultMiddleware().concat(logger);
  } : undefined,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// 主要解决在每次使用 useSelector 和 useDispatch 都要去重新定义 TS 类型的问题
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;