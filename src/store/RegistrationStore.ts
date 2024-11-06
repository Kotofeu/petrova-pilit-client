import { makeAutoObservable } from 'mobx'
import { AuthResponse, ILoginParams, userApi } from '../http';
import { AxiosError } from 'axios';

export const REGISTRATION = 'registration';
export const AUTHORIZATION = 'authorization';
export const PASSWORD_RECOVERY = 'passwordRecovery';

type ActionType = typeof REGISTRATION | typeof AUTHORIZATION | typeof PASSWORD_RECOVERY;

export class RegistrationStore {
    private _isOpen: boolean = false;
    private _actionType: ActionType = AUTHORIZATION; 
    private _isLoading: boolean = false;
    private _error: string | null = null;

    constructor() {
        makeAutoObservable(this, {}, { deep: true })
    }
    get isOpen() {
        return this._isOpen;
    }

    get actionType() {
        return this._actionType;
    }
    get isLoading() {
        return this._isLoading;
    }

    get error() {
        return this._error;
    }

    async handleRegistrationAction(action: () => Promise<AuthResponse>): Promise<AuthResponse | undefined> {
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
    
    async registration(password: string): Promise<AuthResponse | undefined> {
        return this.handleRegistrationAction(() => userApi.registration(password));
    }
    
    async recoverUser(password: string): Promise<AuthResponse | undefined> {
        return this.handleRegistrationAction(() => userApi.recoverUser(password));
    }
    
    async login(params: ILoginParams): Promise<AuthResponse | undefined> {
        return this.handleRegistrationAction(() => userApi.login(params));
    }

    setIsOpen(isOpen: boolean) {
        this._isOpen = isOpen
    }

    setActionType(actionType: ActionType) {
        this._actionType = actionType
    }

}