import React, {useContext, useEffect} from 'react';
import LoginForm from "./components/LoginForm";
import {Context} from "./index";
import {observer} from "mobx-react-lite";

function App() {

    const {store} = useContext(Context);

    useEffect(() => {
        if (localStorage.getItem('token')) {
            store.checkAuth()
        }
    }, []);
    return (
        <div className="App">
            <h1>{store.isAuth ? `Пользователь авторизован ${store.user.email}` : `Авторизуйтесь`}</h1>
            <LoginForm/>
        </div>
    );
}

export default observer(App);
