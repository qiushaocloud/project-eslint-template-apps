import {createSlice, PayloadAction, createAsyncThunk, createEntityAdapter} from '@reduxjs/toolkit';

interface IUser {
    id: string;
    name: string;
}

export const USERS_FEATURE_KEY = 'users';

export const loadUsersAPI = createAsyncThunk('users/loadUsersAPI', (payload: string) => {
  return new Promise<IUser[]>((resolve) => {
    setTimeout(() => {
      const users: IUser[] = [];
      for (let i = 0; i < 10; i++) {
        users.push({id: `uid_${Date.now()}_${i}`, name: `name_${payload}_${i}`});
      }
      resolve(users);
    }, 1000);
  });
});

const usersAdapter = createEntityAdapter();

const {reducer: UsersReducer, actions} = createSlice({
  name: USERS_FEATURE_KEY,
  initialState: usersAdapter.getInitialState(),
  reducers: {
    addUser (state, {payload: user}: PayloadAction<IUser>) {
      usersAdapter.addOne(state, user);
    },
    setUsers (state, {payload: users}: PayloadAction<IUser[]>) {
      usersAdapter.addMany(state, users);
    },
  },
  extraReducers: (builder) => {
    // 成功fulfilled时执行的操作  pending等待  rejected拒绝
    builder.addCase(loadUsersAPI.fulfilled, (state, {payload: users}) => {
      usersAdapter.addMany(state, users);
    });
  }
});

export const {addUser, setUsers} = actions;
export default UsersReducer;