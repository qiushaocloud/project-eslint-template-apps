import CounterReducer, {COUNTER_FEATURE_KEY} from './counterSlice';
import UsersReducer, {USERS_FEATURE_KEY} from './usersSlice';

export const sliceReducers = {
  [COUNTER_FEATURE_KEY]: CounterReducer,
  [USERS_FEATURE_KEY]: UsersReducer,
};