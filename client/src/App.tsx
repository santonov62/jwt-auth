import React, {useContext, useEffect, useState} from 'react';
import LoginForm from "./components/LoginForm";
import {Context} from "./index";
import {observer} from "mobx-react-lite";
import userService from './services/UserService';
import IUser from "./models/IUser";

function App() {

    const {store} = useContext(Context);
    const [users, setUsers] = useState<IUser[]>([]);

    useEffect(() => {
        if (localStorage.getItem('token')) {
            store.checkAuth()
        }
    }, []);

    async function fetchUsers() {
        const response = await userService.fetchUsers();
        setUsers(response.data);
    }

    if (store.isLoading) {
        return (
            <div>Loading...</div>
        )
    }

    if (!store.isAuth) {
        return (
            <>
                <h1>Authorize</h1>
                <LoginForm/>
                <button onClick={fetchUsers}>Get users</button>
            </>
        )
    }

    return (
        <div className="App">
            <h1>{`Пользователь авторизован ${store.user.email}`}</h1>
            <button onClick={() => {store.logout()}}>Logout</button>
            <button onClick={fetchUsers}>Get users</button>
            {users.map( user => <div key={user.email}>{user.email}</div>)}
        </div>
    );
}

export default observer(App);
