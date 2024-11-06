import { AxiosError } from 'axios';
import { makeAutoObservable } from 'mobx'

import { IGetAllJSON } from '.';
import { IReviewValue, reviewApi } from '../http';


export interface IReview extends IReviewValue {
    id: number;
}
export interface IReviewAllJSON {
    reviews?: IGetAllJSON<IReview>;
    page?: number;
    found?: boolean;
}
export class ReviewsStore {
    constructor() {
        makeAutoObservable(this, {}, { deep: true })
    }
    private _reviews: IReview[] = []
    private _mainReviews: IReview[] = []
    private _activeReview: number | null = null;

    private _isLoading: boolean = false;
    private _error: string | null = null;

    get activeReview() {
        return this._activeReview;
    }

    get reviews() {
        return this._reviews
    }

    get mainReviews() {
        return this._mainReviews
    }

    get isLoading() {
        return this._isLoading;
    }

    get error() {
        return this._error;
    }

    async handleReviewAction(action: () => Promise<IReview>): Promise<IReview | undefined> {
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

    setReviews(reviews: IReview[]) {
        if (!this._mainReviews.length) {
            this._mainReviews = reviews
        }
        this._reviews = reviews
    }
    setMainReviews(mainReviews: IReview[]) {
        if (!this._reviews.length) {
            this._reviews = mainReviews
        }
        this._mainReviews = mainReviews
    }

    async getReview(id?: number) {
        if (id) {
            return await this.handleReviewAction(() => reviewApi.getReviewById(id));
        }
        else {
            return await this.handleReviewAction(() => reviewApi.getReview());
        }
    }
    async addReview(review: IReviewValue, name?: string, images?: File[]) {
        const createdReview = await this.handleReviewAction(() => reviewApi.addReview(review, name, images));
        if (!this._error && createdReview) {
            this._reviews.unshift(createdReview)
        }
    }

    async addAvitoReview(review: IReviewValue, name: string, images?: File[], userIcon?: File) {
        const createdReview = await this.handleReviewAction(() => reviewApi.addAvitoReview(review, name, images, userIcon));
        if (!this._error && createdReview) {
            this._reviews.unshift(createdReview)
        }
    }

    async changeById(review: IReviewValue, deletedIds?: number[], images?: File[]) {
        const updatedReview = await this.handleReviewAction(() => reviewApi.changeById(review, deletedIds, images));
        if (!this._error && updatedReview) {
            this._reviews = this._reviews.map((review) => review.id === updatedReview.id ? updatedReview : review)
            this._mainReviews = this._mainReviews.map((review) => review.id === updatedReview.id ? updatedReview : review)
        }
    }

    async deleteImagesByIdAdmin(deletedIds: number[]) {
        return await this.handleReviewAction(() => reviewApi.deleteImageByIdAdmin(deletedIds))
    }

    async deleteReview(id?: number, userId?: number) {
        if (id) {
            await this.handleReviewAction(() => reviewApi.deleteById(id))
            if (!this._error) {
                this._reviews = this._reviews.filter((review) => review.id !== id)
                this._mainReviews = this._mainReviews.filter((review) => review.id !== id)
            }
        }
        else {
            await this.handleReviewAction(() => reviewApi.delete())
            if (!this._error && userId) {
                this._reviews = this._reviews.filter((review) => review.user?.id !== userId)
                this._mainReviews = this._mainReviews.filter((review) => review.user?.id !== userId)

            }
        }
    }

}