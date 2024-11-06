import { FC, useEffect, useState, useCallback } from 'react'
import { observer } from 'mobx-react-lite';
import { AnimatePresence, motion } from 'framer-motion'

import Loader from '../../UI/Loader/Loader';
import Input from '../../UI/Input/Input';
import Button from '../../UI/Button/Button';

import { useMessage } from '../../modules/MessageContext';
import useDebounce from '../../utils/hooks/useDebounce';
import { classConnection } from '../../utils/function';

import classes from './CodeConfirm.module.scss'
import { emailConfirmStore } from '../../store';

interface ICodeConfirm {
  className?: string;
  onConfirm: (isConfirm: boolean) => void;
  sendCode: () => void
}

const CodeConfirm: FC<ICodeConfirm> = observer(({
  className,
  onConfirm,
  sendCode
}) => {
  const { email, countdown, isLoading, error, jwt } = emailConfirmStore

  const { addMessage } = useMessage();

  const [code, setCode] = useState<string>('');
  const debounceCode = useDebounce(code, 1000)

  useEffect(() => {
    if (jwt) {
      addMessage('Почта подтверждена', 'complete')
      onConfirm(true)
      emailConfirmStore.reset()
    }
  }, [jwt])

  useEffect(() => {
    if (error) {
      addMessage(error, 'error')
    }
  }, [error])

  useEffect(() => {
    if (debounceCode) {
      emailConfirmStore.confirmCode(debounceCode)
    }
  }, [debounceCode,])

  const onCodeSend = useCallback(() => {
    if (email) {
      sendCode()
      setCode('');
      addMessage('Письмо отправлено', 'message')
    }
  }, [email, sendCode])

  return (
    <>
      <Loader className={classes.codeConfirm__loader} isLoading={isLoading} />
      <AnimatePresence>
        {
          email ?
            <motion.div
              initial={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              layout
              className={classConnection(classes.codeConfirm, className)}
            >
              <Input
                className={classes.codeConfirm__input}
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Введите код"
              />

              <Button
                className={classes.codeConfirm__send}
                onClick={onCodeSend}
                disabled={countdown > 0 || isLoading}
              >
                {countdown > 0 ? `Повторно через: ${countdown}с.` : 'Отправить код снова'}
              </Button>
            </motion.div>
            : null
        }

      </AnimatePresence>
    </>

  )
})

export default CodeConfirm