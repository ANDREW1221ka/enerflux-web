import { useEffect } from 'react'

import { ContactCTASection } from '../../components/public/ContactCTASection'
import { HeroSection } from '../../components/public/HeroSection'
import { ProjectsSection } from '../../components/public/ProjectsSection'
import { ServicesSection } from '../../components/public/ServicesSection'

export function HomePage() {
  useEffect(() => {
    const animatedElements = Array.from(document.querySelectorAll<HTMLElement>('.reveal'))

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' },
    )

    animatedElements.forEach((element) => observer.observe(element))

    return () => {
      observer.disconnect()
    }
  }, [])

  return (
    <div className="home-page">
      <HeroSection />
      <ServicesSection />
      <ProjectsSection />
      <ContactCTASection />
    </div>
  )
}
