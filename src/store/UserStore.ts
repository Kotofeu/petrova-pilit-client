import { makeAutoObservable } from 'mobx'

import { IUserValue, userApi } from '../http';
import { jwtDecode } from 'jwt-decode';
import { AxiosError } from 'axios';



export interface IUser extends IUserValue {
    id: number;
}


export class UserStore {
    private _user: IUser | null = null;

    private _isLoading: boolean = false;
    private _error: string | null = null;

    constructor() {
        makeAutoObservable(this, {}, { deep: true })
    }

    get isLoading() {
        return this._isLoading;
    }

    get error() {
        return this._error;
    }
    setUser(user: IUser | null) {
        this._user = user
    }

    async handleUserAction(action: () => Promise<IUser>): Promise<IUser | undefined> {
        this._error = '';
        this._isLoading = true;

        try {
            return await action();
        } catch (err) {
            if (err instanceof AxiosError) {
                this._error = err.response?.data.message || err.message;
            } else {
                this._error = `${err}`;
            }
        } finally {
            this._isLoading = false;
        }
    }

    async changeUserById(id: number, user: IUser, image?: File): Promise<IUser | undefined> {
        return await this.handleUserAction(() => userApi.changeUserById(id, user, image));
    }
    async giveRole(id: number, role: 'ADMIN' | 'USER') {
        return await this.handleUserAction(() => userApi.giveRole(id, role));
    }

    async deleteUser() {
        await this.handleUserAction(() => userApi.deleteUser());
        if (!this._error) {
            this.setUser(null)
        }
    }
    async logout() {
        await this.handleUserAction(() => userApi.logout());
        if (!this._error) {
            this.setUser(null)
        }
    }
    async setUserPassword(password: string) {
        await this.handleUserAction(() => userApi.changeUserPassword(password));
    }

    async deleteUserById(id: number) {
        await this.handleUserAction(() => userApi.deleteUserById(id));
    }

    async setUserImage(image: File | null) {
        const user = await this.handleUserAction(() => userApi.changeUserImage(image));

        if (this._user) {
            this._user.imageSrc = image ? user?.imageSrc : undefined
        }
    }

    async setUserName(userName: string) {
        await this.handleUserAction(() => userApi.changeUserName(userName));

        if (this._user) {
            this._user.name = userName
        }
    }

    async setUserPhone(phone: string) {
        await this.handleUserAction(() => userApi.changeUserPhone(phone));
        if (this._user) {
            this._user.phone = phone
        }

    }


    async setUserEmail(email: string) {
        await this.handleUserAction(() => userApi.changeUserEmail(email));
        if (this._user) {
            this._user.email = email
        }
    }

    get isAuth(): boolean {
        if (!this._user) {
            const accessToken = localStorage.getItem('accessToken')
            const user = accessToken ? jwtDecode<IUser>(accessToken) : null
            if (user && user.id) {
                return true
            }
        }
        return this._user !== null
    }

    get isAdmin() {
        if (!this._user) {
            const accessToken = localStorage.getItem('accessToken') || ''
            const user = accessToken ? jwtDecode<IUser>(accessToken) : null
            if (user && user.role) {
                return user.role === "ADMIN" ? true : false
            }
        }
        return this._user?.role === "ADMIN" ? true : false
    }
    get user() {
        return this._user
    }
}