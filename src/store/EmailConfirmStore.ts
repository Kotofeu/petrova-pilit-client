import { AxiosError } from 'axios';
import { makeAutoObservable } from 'mobx'
import { userApi } from '../http';

export class EmailConfirmStore {

    private _email: string = '';
    private _countdown: number = 0;
    private _intervalId: NodeJS.Timeout | null = null;
    private _isLoading: boolean = false;
    private _error: string | null = null;
    private _jwt: string | null = null
    private _isCodeSent: boolean = false;

    constructor() {
        makeAutoObservable(this, {}, { deep: true })
    }
    get email() {
        return this._email;
    }

    get isCodeSent() {
        return this._isCodeSent;
    }

    get countdown() {
        return this._countdown;
    }

    get isLoading() {
        return this._isLoading;
    }

    get error() {
        return this._error;
    }

    get jwt() {
        return this._jwt
    }

    private set isLoading(isLoading: boolean) {
        this._isLoading = isLoading
    }

    private set countdown(countdown: number) {
        this._countdown = countdown
    }

    private set isCodeSent(isCodeSent: boolean) {
        this._isCodeSent = isCodeSent;
    }

    private set jwt(jwt: string | null) {
        this._jwt = jwt;
    }

    private set intervalId(intervalId: NodeJS.Timeout | null) {
        this._intervalId = intervalId;
    }

    private set email(email: string) {
        this._email = email;
    }

    setEmail(email: string) {
        if (email !== this._email) {
            this.reset()
            this._email = email;
            this.startCounting()
        }
    }
    startCounting() {
        this.countdownReset()
        this.countdown = 40;
        this.intervalId = setInterval(() => {
            this.countdown -= 1;
            if (this.countdown <= 0) {
                this.countdownReset();
            }
        }, 1000);
    }

    private isCanSend(): boolean {
        this._error = null
        if (this.isCodeSent) {
            this._error = 'Письмо уже отправлено'
            return false
        };
        if (!this.email) {
            this._error = 'Почта не задана'
            return false
        }
        this.isLoading = true
        this.startCounting()
        return true
    }
    async createSendCode() {
        this.isCanSend()
        try {
            await userApi.newUserSendCode(this._email);
        }
        catch (err) {
            if (err instanceof AxiosError) {
                this._error = err.response?.data.message || err.message;
            } else {
                this._error = `${err}`;
            }
        }
        finally {
            this.isLoading = false;
        }
    }
    async changeSendCode(newEmail: string) {
        this.isCanSend()
        try {
            await userApi.changeEmailSendCode(newEmail);
        }
        catch (err) {
            if (err instanceof AxiosError) {
                this._error = err.response?.data.message || err.message;
            } else {
                this._error = `${err}`;
            }
        }
        finally {
            this.isLoading = false;
        }
    }
    async recoverSendCode() {
        this.isCanSend()
        try {
            await userApi.recoverUserSendCode(this._email);
        }
        catch (err) {
            if (err instanceof AxiosError) {
                this._error = err.response?.data.message || err.message;
            } else {
                this._error = `${err}`;
            }
        }
        finally {
            this.isLoading = false;
        }
    }

    async confirmCode(code: string) {
        this.isLoading = true;
        this._error = null
        try {
            const response = await userApi.activate(this._email, code);
            this.jwt = response;
        }
        catch (err) {
            if (err instanceof AxiosError) {
                this._error = err.response?.data.message || err.message;
            } else {
                this._error = `${err}`;
            }
        }
        finally {
            this.isLoading = false;
        }
    }

    countdownReset() {
        if (this._intervalId) {
            clearInterval(this._intervalId);
            this.intervalId = null;

        }
        this.countdown = 0;
        this.isCodeSent = false;
    }
    reset() {
        this.email = '';
        this.isLoading = false;
        this.jwt = null
        this._error = null
        this.countdownReset()
    }
}