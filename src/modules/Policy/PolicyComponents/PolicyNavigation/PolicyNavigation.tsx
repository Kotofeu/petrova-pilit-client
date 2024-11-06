import { memo, FC } from 'react'
import Button from '../../../../UI/Button/Button'
import { policy } from '../../policy'

import classes from './PolicyNavigation.module.scss'
interface IPolicyNavigation {
    scrollToSection: (index: number) => void
}
export const PolicyNavigation: FC<IPolicyNavigation> = memo(({ scrollToSection }) => {
    return (
        <nav className={classes.policyNav}>
            <h2 className={classes.policyNav__title}>Содержание</h2>
            <ul className={classes.policyNav__list}>
                {policy.map((section, index) => (
                    <li className={classes.policyNav__item} key={index} >
                        <Button className={classes.policyNav__button} onClick={() => scrollToSection(index)}>
                            {section.title}
                        </Button>
                    </li>
                ))}
            </ul>
        </nav>)
})