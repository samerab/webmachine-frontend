import { createAction, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';

import { User } from './user.model';

export const loginUser = createAction(
  '[User/API] Login User',
  props<{ user: User }>()
);

export const loginUserSuccess = createAction(
  '[User/API] Login User Success',
  props<{ user: User }>()
);

export const logoutUser = createAction(
  '[User/API] Logout User',
);

export const logoutUserSuccess = createAction(
  '[User/API] Logout User Success',
);

export const loadUser = createAction(
  '[User/API] Load User', 
  props<{ id: string }>() 
);

export const loadUserSuccess = createAction(
  '[User/API] Load User Success',
  props<{ user: User }>() 
);

export const loadUsers = createAction(
  '[User/API] Load Users', 
  props<{ users: User[] }>()
);

export const addUser = createAction(
  '[User/API] Add User',
  props<{ user: User }>()
);

export const addUserSuccess = createAction(
  '[User] Add User Success',
  props<{ user: User }>()
);

export const upsertUser = createAction(
  '[User/API] Upsert User',
  props<{ user: User }>()
);

export const addUsers = createAction(
  '[User/API] Add Users',
  props<{ users: User[] }>()
);

export const upsertUsers = createAction(
  '[User/API] Upsert Users',
  props<{ users: User[] }>()
);

export const updateUser = createAction(
  '[User/API] Update User',
  props<{ user: Update<User> }>()
);

export const updateUsers = createAction(
  '[User/API] Update Users',
  props<{ users: Update<User>[] }>()
);

export const deleteUser = createAction(
  '[User/API] Delete User',
  props<{ id: string }>()
);

export const deleteUsers = createAction(
  '[User/API] Delete Users',
  props<{ ids: string[] }>()
);

export const clearUsers = createAction(
  '[User/API] Clear Users'
);
