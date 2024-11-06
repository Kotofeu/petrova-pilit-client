import Section from '../../../../components/Section/Section'
import Avatar from '../../../../components/Avatar/Avatar'
import classes from './AboutMainSection.module.scss'
import { applicationStore } from '../../../../store'
import ContactList from '../../../../components/ContactList/ContactList'
import { observer } from 'mobx-react-lite'
import { classConnection } from '../../../../utils/function'

export const AboutMainSection = observer(() => {

  return (
    <Section className={classes.aboutMain}>
      <h1 className={classes.aboutMain__title}>Обо мне</h1>
      <div className={classes.aboutMain__inner}>
        <div className={classes.aboutMain__content}>
          <div className={classes.aboutMain__avatarBox}>
            <Avatar className={classes.aboutMain__avatar} />
            <span className={classConnection(classes.aboutMain__heart, classes.aboutMain__heart_left)} />
            <ContactList
              className={classes.aboutMain__links}
            />
          </div>
        </div>
        <p className={classes.aboutMain__text}>
          {
            applicationStore.aboutMe
              ? <>{applicationStore.aboutMe}</>
              : <span className={classes.aboutMain__text_empty}>
                {
                  [1, 2, 3, 4, 5].map(i => (
                    <span key={i} className={'loading'}></span>
                  ))
                }
              </span>
          }

          <span className={classConnection(classes.aboutMain__heart, classes.aboutMain__heart_right)} />
        </p>
      </div>
    </Section>
  )
})