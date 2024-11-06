import { $api, $authHost, baseReview, IGetParams, IUserValue } from "..";
import { IImages } from "../../store";

export interface IReviewValue {
    id?: number;
    user?: IUserValue | null;
    comment?: string | null;
    updatedAt?: number | null;
    rating?: number | null;
    reviews_images?: IImages[] | null;
}
export interface IReviewGetParam extends IGetParams {
    reviewId?: number
}
export class ReviewApi {

    getReviews = async (params?: IReviewGetParam) => {
        const { data } = await $api.get(`${baseReview}all`, {
            params
        })
        return data
    }

    getReview = async () => {
        const { data } = await $api.get(`${baseReview}`)
        return data
    }

    getReviewById = async (id: number) => {
        const { data } = await $api.get(`${baseReview}${id}`)
        return data
    }

    addReview = async (
        review: IReviewValue,
        name?: string,
        images?: File[] | null
    ) => {
        const formData = new FormData();
        if (review.comment) {
            formData.append('comment', review.comment);
        }
        if (review.rating) {
            formData.append('rating', `${review.rating}`);
        }
        if (name) {
            formData.append('name', name)
        }
        if (images?.length) {
            images.map(image => {
                formData.append('images', image, image.name)
            })
        }
        const { data } = await $api.post(`${baseReview}`, formData)
        return data
    }

    addAvitoReview = async (
        review: IReviewValue,
        name: string,
        images?: File[] | null,
        userIcon?: File | null,
    ) => {
        const formData = new FormData();
        if (review.comment) {
            formData.append('comment', review.comment);
        }
        if (review.rating) {
            formData.append('rating', `${review.rating}`);
        }
        if (name) {
            formData.append('name', name)
        }
        if (userIcon) {
            formData.append('userIcon', userIcon)
        }
        if (images?.length) {
            images.map(image => {
                formData.append('images', image, image.name)
            })
        }
        const { data } = await $authHost.post(`${baseReview}avito`, formData)
        return data
    }


    changeById = async (
        review: IReviewValue,
        deletedIds?: number[],
        images?: File[] | null
    ) => {
        const formData = new FormData();
        if (review.comment) {
            formData.append('comment', review.comment);
        }
        if (review.rating) {
            formData.append('rating', `${review.rating}`);
        }
        if (images) {
            images.map(image => {
                formData.append('images', image, image.name)
            })
        }
        if (deletedIds && deletedIds.length) {
            deletedIds.map(id => {
                formData.append('deletedIds', `${id}`);
            });
        }

        const { data } = await $api.post(`${baseReview}update`, formData)
        return data
    }

    deleteImageById = async (deletedIds: number[]) => {
        const { data } = await $api.delete(`${baseReview}images`, {
            data: {
                deletedIds: deletedIds
            }
        });
        return data
    }


    deleteImageByIdAdmin = async (deletedIds: number[]) => {
        const { data } = await $authHost.delete(`${baseReview}images-admin`, {
            data: {
                deletedIds: deletedIds
            }
        });
        return data
    }

    delete = async () => {
        const { data } = await $api.delete(`${baseReview}`)
        return data
    }

    deleteById = async (id: number) => {
        const { data } = await $authHost.delete(`${baseReview}${id}`)
        return data
    }

}