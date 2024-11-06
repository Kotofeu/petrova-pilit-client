import { FC, ReactNode } from 'react'
import classes from './Section.module.scss'
import { classConnection } from '../../utils/function';
interface IContainer {
  className?: string;
  children?: ReactNode | ReactNode[];
  isUnderline?: boolean;
  backgroundImage?: string;
}

const Section: FC<IContainer> = (props) => {
  return (
    <section className={classConnection(classes.section, props.className)}>
      {
        props.backgroundImage
          ? <img
            className={classes.section__background}
            src={props.backgroundImage}
            alt='Задний фон'
          />
          : null
      }
      {
        props.isUnderline
        && <div className={classes.section__underline} />
      }
      <div className={classes.section__container}>
        {props.children}
      </div>

    </section>
  )
}

export default Section