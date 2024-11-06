import { observer } from 'mobx-react-lite'
import { Slider } from '../../../../components/Slider'
import { applicationStore } from '../../../../store'

import classes from './HomeMainSlider.module.scss'
import { FC } from 'react'
import { classConnection } from '../../../../utils/function'
import ServerImage from '../../../../UI/ServerImage/ServerImage'

interface IHomeMainSlider {
    isLoading?: boolean
}

export const HomeMainSlider: FC<IHomeMainSlider> = observer(({ isLoading }) => {
    if (isLoading) {
        return (
            <div className={classes.homeMainSlider}>
                <div className={classes.homeMainSlider__slide}>
                    <div className={classes.homeMainSlider__imageBox}>
                        <div className={classConnection(classes.homeMainSlider__loader, 'loading')} />
                    </div>
                </div>
            </div>

        )
    }
    return (
        <Slider
            className={classes.homeMainSlider}
            items={applicationStore.homeSlider.length ? applicationStore.homeSlider : applicationStore.defaultHomeSlider}
            slideClassName={classes.homeMainSlider__slide}
            renderItem={
                (item) => {
                    if (!item.imageSrc) return null
                    return (
                        <div className={classes.homeMainSlider__imageBox}>
                            <ServerImage className={classes.homeMainSlider__image} src={item.imageSrc} alt={item.name || item.imageSrc} />
                        </div>
                    )
                }}
            addArrows
            draggable
            looped
            autoplay
            autoplayDelay={5000}
            slidesToShow={1}
            slidesToScroll={1}
        />
    )
})