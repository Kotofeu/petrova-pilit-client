import { FC, memo, ReactNode } from 'react'
import { NavLink } from 'react-router-dom'

import { ILink } from '../../../../store'
import classes from './HeaderLinks.module.scss'
import ActiveLine from '../../../../UI/ActiveLine/ActiveLine'
import { classConnection } from '../../../../utils/function'

export enum LinkType {
    underline = 'underline',
    none = 'none'

}
interface IHeaderLink extends ILink {
    className?: string,
    children?: ReactNode,
    onClick?: React.MouseEventHandler<HTMLAnchorElement>
    type?: LinkType,
}

export const HeaderLink: FC<IHeaderLink> = memo((props) => {
    const { className, children, onClick, type = LinkType.none, name, link } = props
    if (!link || !name) return null
    return (
        <NavLink
            className={
                ({ isActive }) =>
                    classConnection(classes.headerLink, isActive ? classes.headerLink_active : '', className)
            }
            to={link}
            onClick={onClick}
        >
            {({ isActive }) =>
                <>
                    {name}
                    {children}
                    <ActiveLine
                        className={classes.headerLink__activeLine}
                        layoutId='headerActiveLine'
                        isActive={isActive && type === LinkType.underline}
                    />
                </>

            }


        </NavLink>
    )
})
