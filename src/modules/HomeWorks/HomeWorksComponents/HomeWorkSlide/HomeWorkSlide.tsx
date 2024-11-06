import { memo, FC, useCallback } from 'react'
import { useNavigate } from 'react-router-dom';

import { WORKS_ROUTE } from '../../../../utils/const/routes';

import { HomeWorkSlideImage } from '../HomeWorkSlideImage/HomeWorkSlideImage';

import classes from './HomeWorkSlide.module.scss'
import { classConnection } from '../../../../utils/function';
import { IWork } from '../../../../store';


interface IHomeWorkSlide {
    className?: string;
    work: IWork;
}
export const HomeWorkSlide: FC<IHomeWorkSlide> = memo((props) => {
    const { className, work } = props
    const {id, imageAfterSrc, imageBeforeSrc, name} = work
    const router = useNavigate()

    const onSlideClick = useCallback((event: React.MouseEvent<HTMLElement>) => {
        event.preventDefault()
        window.scrollTo(0, 0)
        router(`${WORKS_ROUTE}/${id}`)
    }, [id])
    if (!imageAfterSrc && !imageBeforeSrc) return null
    const isSlice: boolean = !!imageAfterSrc && !!imageBeforeSrc
    return (
        <article className={classConnection(classes.homeWorkSlide, className)}>
            <div className={classes.homeWorkSlide__preview}>
                {
                    isSlice ?
                        <>

                            <HomeWorkSlideImage
                                className={classes.homeWorkSlide__image}
                                type='before'
                                imageSrc={imageBeforeSrc}
                                alt={`${name} до работы`}
                            />
                            <HomeWorkSlideImage
                                className={classes.homeWorkSlide__image}
                                type='after'
                                imageSrc={imageAfterSrc}
                                alt={`${name} после работы`}
                            />
                        </>
                        :
                        <HomeWorkSlideImage
                            className={classes.homeWorkSlide__image}
                            imageSrc={imageAfterSrc || imageBeforeSrc}
                            alt={`${name} работа`}
                        />
                }
            </div >
            <div
                className={classes.homeWorkSlide__content}
                onClick={onSlideClick}
            >
                <h6 className={classes.homeWorkSlide__title}>
                    {name}
                </h6>
            </div>
        </article >
    )
})
