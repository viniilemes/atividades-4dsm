import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
export interface User {
id: number;
name: string;
age: number;
}
interface UserState {
users: User[];
}
const userSlice = createSlice({
name: "cadastro",
initialState: {
users: [],
} as UserState,
reducers: {
addUser: (state, action: PayloadAction<User>) => {
state.users.push(action.payload);
},
removeUser: (state, action: PayloadAction<number>) => {
// Filtra o array e atualiza o estado
state.users= state.users.filter((user) => action.payload !== user.id);
},
incrementAge: (state, action: PayloadAction<number>) => {
// Filtra o array, mantendo apenas os usuários com id diferente do user.id
const user = state.users.find((user) => action.payload === user.id);
if( user ){
user.age = user.age + 1; // Incrementa a idade no estado
}
}
},
});
export const { addUser, removeUser, incrementAge } = userSlice.actions;
export default userSlice.reducer;