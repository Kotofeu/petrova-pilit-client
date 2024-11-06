import { makeAutoObservable } from 'mobx'
import { IWorksTypeValue, IWorkValue, workApi, workTypeApi } from '../http';
import { AxiosError } from 'axios';

export interface IWorksType extends IWorksTypeValue {
    id: number
}

export interface IWork extends IWorkValue {
    id: number
}

export class WorksStore {

    constructor() {
        makeAutoObservable(this, {}, { deep: true })
    }

    private _workTypes: IWorksType[] = []
    private _works: IWork[] = [];
    private _homeWorks: IWork[] = [];
    private _isLoading: boolean = false;
    private _error: string | null = null;
    private _isWorkCreating: boolean = false

    get works() {
        return this._works;
    }
    get homeWorks() {
        return this._homeWorks;
    }
    get workTypes() {
        return this._workTypes;
    }

    get isWorkCreating() {
        return this._isWorkCreating
    }

    get isLoading() {
        return this._isLoading;
    }

    get error() {
        return this._error;
    }

    async handleWorkAction(action: () => Promise<IWork>): Promise<IWork | IWorksType | undefined> {
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

    setWorks(works: IWork[]) {
        this._works = works
    }

    setHomeWorks(works: IWork[]) {
        this._homeWorks = works
    }

    setIsWorkCreating(isOpen: boolean) {
        this._isWorkCreating = isOpen
    }
    setWorkTypes(workTypes: IWorksType[]) {
        this._workTypes = workTypes
    }

    async addWork(work: IWorkValue, imageAfter?: File | null, imageBefore?: File | null, otherImages?: File[] | null) {
        const createdWork = await this.handleWorkAction(() => workApi.addWork(work, imageAfter, imageBefore, otherImages));
        if (!this._error && createdWork) {
            this._works.unshift(createdWork)
        }
    }

    async changeById(id: number, work: IWorkValue, imageAfter?: File | null, imageBefore?: File | null, otherImages?: File[] | null, deletedIds?: number[]) {
        const createdWork = await this.handleWorkAction(() => workApi.changeById(id, work, imageAfter, imageBefore, otherImages, deletedIds));
        if (!this._error && createdWork) {
            this._homeWorks = this._homeWorks.map((work) => work.id === createdWork.id ? createdWork : work)
            this._works = this._works.map((work) => work.id === createdWork.id ? createdWork : work)
        }
    }

    async deleteWork(id: number) {
        await this.handleWorkAction(() => workApi.deleteWorkById(id))
        if (!this._error) {
            this._works = this._works.filter((work) => work.id !== id)
            this._homeWorks = this._homeWorks.filter((work) => work.id !== id)
        }
    }

    async addWorkType(name: string) {
        const createdWorkType = await this.handleWorkAction(() => workTypeApi.addWorkType(name));
        if (!this._error && createdWorkType) {
            this._workTypes.unshift(createdWorkType)
        }
    }

    async changeWorkTypeById(id: number, name: string) {
        const createdWorkType = await this.handleWorkAction(() => workTypeApi.changeById(id, name));
        if (!this._error && createdWorkType) {
            this._workTypes = this._workTypes.map((workType) => workType.id === createdWorkType.id ? createdWorkType : workType)

        }
    }

    async deleteWorkType(id: number) {
        await this.handleWorkAction(() => workTypeApi.deleteById(id))
        if (!this._error) {
            this._workTypes = this._workTypes.filter((workType) => workType.id !== id)
        }
    }

}
