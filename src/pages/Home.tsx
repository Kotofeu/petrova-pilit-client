import { HomeMainSection } from '../modules/HomeMain'
import { HomeWorksSection } from '../modules/HomeWorks'
import { ServicesSection } from '../modules/Services'
import { AdvantagesSection } from '../modules/Advantages'
import { HowToGetSection } from '../modules/HowToGet'
import { HomeReviewsSection } from '../modules/HomeReviews'

const Home = () => {
  return (
    <main>
      <HomeMainSection />
      <HomeWorksSection />
      <ServicesSection />
      <AdvantagesSection />
      <HowToGetSection/>
      <HomeReviewsSection/>
    </main>
  )
}

export default Home