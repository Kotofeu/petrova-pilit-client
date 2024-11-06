import { FC, useState } from 'react'

import classes from './AboutAdvantages.module.scss'
import { Slider } from '../../../../components/Slider'
import { observer } from 'mobx-react-lite'
import { applicationStore } from '../../../../store'
import Section from '../../../../components/Section/Section'
import ActiveLine from '../../../../UI/ActiveLine/ActiveLine'
import { classConnection } from '../../../../utils/function'
import ServerImage from '../../../../UI/ServerImage/ServerImage'
export const AboutAdvantages: FC = observer(() => {
    const [selectedAdvantage, setSelectedAdvantage] = useState<number>(0)
    return (
        <Section className={classes.aboutAdvantages}>
            <h2 className={classes.aboutAdvantages__title}>Главные качества</h2>
            <div className={classes.aboutAdvantages__inner}>
                <Slider
                    className={classes.aboutAdvantages__slider}
                    slideClassName={classes.aboutAdvantages__slide}
                    items={applicationStore.advantages}
                    renderItem={advantages => (
                        <div
                            className={classes.aboutAdvantages__imageBox}
                            key={advantages.id}
                        >
                            <ServerImage
                                className={classes.aboutAdvantages__image}
                                src={advantages.imageSrc || ''}
                                alt={advantages.name || ''}
                            />
                        </div>
                    )}
                    initialSlide={selectedAdvantage}
                    getCurrentSlide={(slide) => setSelectedAdvantage(slide)}
                    looped
                    addDots
                    autoplay
                    autoplayDelay={3000}
                    draggable
                />
                <div className={classes.aboutAdvantages__list}>
                    {
                        applicationStore.advantages.map((advantage, index) => (
                            <div
                                className={
                                    classConnection(
                                        classes.aboutAdvantages__advantage,
                                        index === selectedAdvantage
                                            ? classes.aboutAdvantages__advantage_selected
                                            : ''
                                    )
                                }
                                key={advantage.id}
                            >
                                <h6
                                    className={classes.aboutAdvantages__advantageTitle}
                                >
                                    {advantage.name}
                                </h6>
                                <p
                                    className={classes.aboutAdvantages__advantageDesc}
                                >
                                    {advantage.description}
                                </p>
                                <ActiveLine
                                    className={classes.aboutAdvantages__activeLine}
                                    isActive={index === selectedAdvantage}
                                    layoutId='selectedAdvantage'
                                />
                            </div>
                        ))
                    }
                </div>

            </div>
        </Section>
    )
})