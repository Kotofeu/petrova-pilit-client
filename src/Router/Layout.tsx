import { Outlet } from 'react-router-dom'

import { Header } from '../modules/Header'
import { Footer } from '../modules/Footer'
import { RegistrationModal } from '../modules/RegistrationModal'
import { CookieBanner } from '../modules/CookieBanner'

export const Layout = () => {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
      <RegistrationModal />
      <CookieBanner />

    </>
  )
}
