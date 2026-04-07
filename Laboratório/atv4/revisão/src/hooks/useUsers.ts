import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../store/store';
import { addUser as addUserAction, removeUser as removeUserAction } from '../store/userSlice';

export const useUsers = () => {
  const dispatch = useDispatch<AppDispatch>();
  const users = useSelector((state: RootState) => state.users.users);

  const addUser = (name: string) => {
    dispatch(addUserAction({ id: Date.now().toString(), name }));
  };

  const removeUser = (id: string) => {
    dispatch(removeUserAction(id));
  };

  return { users, addUser, removeUser };
};