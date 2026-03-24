import { ContactCTASection } from '../../components/public/ContactCTASection'
import { HeroSection } from '../../components/public/HeroSection'
import { ProjectsSection } from '../../components/public/ProjectsSection'
import { ServicesSection } from '../../components/public/ServicesSection'

export function HomePage() {
  return (
    <div className="home-page">
      <HeroSection />
      <ServicesSection />
      <ProjectsSection />
      <ContactCTASection />
    </div>
  )
}
