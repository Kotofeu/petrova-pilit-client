import { AxiosError } from 'axios';
import { makeAutoObservable } from 'mobx'

import { IGetAllJSON } from '.';
import { IServiceValue, serviceApi } from '../http';

export interface IService extends IServiceValue {
    id: number;
}


export class ServicesStore {
    constructor() {
        makeAutoObservable(this, {}, { deep: true })
    }
    private _services: IService[] = []
    private _isLoading: boolean = false;
    private _error: string = ''


    get services() {
        return this._services
    }

    get isLoading() {
        return this._isLoading
    }
    get error() {
        return this._error
    }

    async handleServiceAction<T>(action: () => Promise<T>): Promise<T | undefined> {
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

    setServices(services: IService[]) {
        this._services = services
    }
    async changeService(service: IService) {
        const updatedService = await this.handleServiceAction<IService>(() => serviceApi.changeServiceById(service.id, service));
        if (!this._error && updatedService) {
            this._services = this._services.map((service) => service.id === updatedService.id ? updatedService : service)
        }
    }

    async addService(contactLink: IServiceValue) {
        const createdService = await this.handleServiceAction<IService>(() => serviceApi.addService(contactLink));
        if (!this._error && createdService) {
            this._services.push(createdService)
        }
    }

    async deleteService(id: number) {
        await this.handleServiceAction(() => serviceApi.deleteServiceById(id))
        if (!this._error) {
            this._services = this._services.filter((service) => service.id !== id)
        }
    }
    private setIsLoading(isLoading: boolean) {
        this._isLoading = isLoading
    }

    private setError(error: string) {
        this._error = error
    }
}