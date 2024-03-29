import IUser from '../models/IUser';
import {makeAutoObservable} from "mobx";
import AuthService from "../services/AuthService";
import axios from "axios";
import {AuthResponse} from "../models/response/AuthResponse";
import {API_URL} from "../http";

export default class Store {
    user = {} as IUser;
    isAuth = false;
    isLoading = false;

    constructor() {
        makeAutoObservable(this);
    }

    setAuth(bool: boolean) {
        this.isAuth = bool;
    }

    setUser(user: IUser) {
        this.user = user;
    }

    setLoading(value: boolean) {
        this.isLoading = value;
    }

    async login(email: string, password: string) {
        try {
            const response = await AuthService.login(email, password);
            console.log(response)
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
            console.log(response)
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
            const response = await AuthService.logout();
            console.log(response)
            localStorage.removeItem('token');
            this.setAuth(false);
            this.setUser({} as IUser);
        } catch (e) {
            console.log(e);
        }
    }

    async checkAuth() {
        this.setLoading(true);
        try {
            const response = await axios.get<AuthResponse>(`${API_URL}/refresh`, {withCredentials: true});
            const {data: {user, accessToken}} = response;
            localStorage.setItem('token', accessToken);
            this.setUser(user);
            this.setAuth(true);
        } catch (e) {
            console.log(e)
        } finally {
            this.setLoading(false);
        }
    }
}