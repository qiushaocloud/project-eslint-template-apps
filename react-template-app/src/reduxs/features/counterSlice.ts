import {createSlice, PayloadAction, createAsyncThunk} from '@reduxjs/toolkit';

interface ICounter {
  count: number;
}

export const COUNTER_FEATURE_KEY = 'counter';

const initialState: ICounter = {
  count: 0
};

export const getCounterAPI = createAsyncThunk('counter/getCounterAPI', () => {
  return new Promise<number>((resolve) => {
    setTimeout(() => {
      resolve(100);
    }, 1000);
  });
});

const {reducer: CounterReducer, actions} = createSlice({
  name: COUNTER_FEATURE_KEY,
  initialState,
  reducers: {
    increment: (state) => {
      state.count++;
    },
    decrement: (state) => {
      state.count--;
    },
    incrBy (state, {payload: increment}: PayloadAction<number>) {
      state.count += increment;
    },
    setCount (state, {payload: count}: PayloadAction<number>) {
      state.count = count;
    }
  },
  extraReducers: (builder) => {
    // 成功fulfilled时执行的操作  pending等待  rejected拒绝
    builder.addCase(getCounterAPI.fulfilled, (state, {payload: count}) => {
      state.count = count;
    });
  }
});

export const {increment, decrement, incrBy, setCount} = actions;
export default CounterReducer;