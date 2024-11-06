import { FC, memo } from 'react'
import classes from './ServicesDescription.module.scss'
import { classConnection } from '../../../../utils/function';

interface IServicesDescription {
  className?: string;
  description?: string;
}
export const ServicesDescription: FC<IServicesDescription> = memo(({
  className,
  description,
}) => {
  return (
    <div className={classConnection(classes.servicesDescription, className)}>
      <p className={classes.servicesDescription__text}>
        {description}
      </p>
    </div>
  )
})