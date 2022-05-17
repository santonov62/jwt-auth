import IUser from '../models/IUser';
import {makeAutoObservable} from "mobx";
import {createLegacyArray} from "mobx/dist/types/legacyobservablearray";
import UserService from "../services/UserService";
import AuthService from "../services/AuthService";
import {AxiosResponse} from "axios";

export default class Store {
    user = {} as IUser;
    isAuth = false;

    constructor() {
        makeAutoObservable(this);
    }

    setAuth(bool: boolean) {
        this.isAuth = bool;
    }

    setUser(user: IUser) {
        this.user = user;
    }

    async login(email: string, password: string) {
        try {
            const response = await AuthService.login(email, password);
            const {data: {user, accessToken}} = response;
            localStorage.setItem('token', accessToken);
            this.setAuth(true);
            this.setUser(user);
        } catch (e: any) {
            console.log(e.response?.data?.message);
        }
    }

    async registration(email: string, password: string) {
        try {
            const response = await AuthService.registration(email, password);
            const {data: {user, accessToken}} = response;
            localStorage.setItem('token', accessToken);
            this.setAuth(true);
            this.setUser(user);
        } catch (e) {
            console.log(e);
        }
    }

    async logout() {
        try {
            await AuthService.logout();
            localStorage.removeItem('token');
            this.setAuth(false);
            this.setUser({} as IUser);
        } catch (e) {
            console.log(e);
        }
    }
}