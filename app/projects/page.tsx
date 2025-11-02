'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import ProjectCard from '@/components/ProjectCard'

export const dynamic = 'force-dynamic'

type TabType = 'websites' | 'apps' | 'workflows'

const projectsData = {
  websites: [
    {
      title: 'E-Commerce Platform',
      description: 'A modern, fully-featured e-commerce platform built with Next.js and Stripe integration. Features include product catalog, shopping cart, payment processing, and admin dashboard.',
      tags: ['Next.js', 'Stripe', 'TypeScript', 'Tailwind CSS'],
      imageUrl: 'https://images.unsplash.com/photo-1556740758-90de374c12ad?w=800&h=600&fit=crop',
      liveUrl: 'https://example.com',
      githubUrl: 'https://github.com/example',
    },
    {
      title: 'Portfolio Website',
      description: 'A stunning portfolio website showcasing creative work with smooth animations, responsive design, and optimized performance. Built with modern web technologies.',
      tags: ['React', 'Framer Motion', 'CSS3'],
      imageUrl: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&h=600&fit=crop',
      liveUrl: 'https://example.com',
      githubUrl: 'https://github.com/example',
    },
    {
      title: 'Corporate Dashboard',
      description: 'An enterprise-level dashboard for managing business operations. Includes analytics, reporting, user management, and real-time data visualization.',
      tags: ['Next.js', 'Prisma', 'PostgreSQL', 'Chart.js'],
      imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop',
      liveUrl: 'https://example.com',
      githubUrl: 'https://github.com/example',
    },
  ],
  apps: [
    {
      title: 'Task Management App',
      description: 'A productivity app for managing tasks and projects. Features include task creation, team collaboration, file sharing, and progress tracking with beautiful UI.',
      tags: ['React Native', 'Firebase', 'Redux'],
      imageUrl: 'https://images.unsplash.com/photo-1611224923853-80b023f02d1a?w=800&h=600&fit=crop',
      liveUrl: 'https://example.com',
      githubUrl: 'https://github.com/example',
    },
    {
      title: 'Weather Forecast App',
      description: 'A beautiful weather app providing accurate forecasts, hourly predictions, and weather alerts. Features location-based weather data and interactive maps.',
      tags: ['Flutter', 'OpenWeather API', 'Dart'],
      imageUrl: 'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=800&h=600&fit=crop',
      liveUrl: 'https://example.com',
      githubUrl: 'https://github.com/example',
    },
    {
      title: 'Fitness Tracker',
      description: 'A comprehensive fitness tracking app with workout plans, nutrition logging, progress charts, and social features. Helps users achieve their fitness goals.',
      tags: ['React Native', 'GraphQL', 'MongoDB'],
      imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=600&fit=crop',
      liveUrl: 'https://example.com',
      githubUrl: 'https://github.com/example',
    },
  ],
  workflows: [
    {
      title: 'Automated Email Marketing',
      description: 'An n8n workflow that automates email marketing campaigns. Sends personalized emails based on user behavior, triggers from CRM updates, and generates analytics reports.',
      tags: ['n8n', 'Email Marketing', 'Automation'],
      imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
      liveUrl: 'https://example.com/blog/email-marketing-automation',
      githubUrl: undefined,
    },
    {
      title: 'Data Synchronization Workflow',
      description: 'A complex n8n workflow that syncs data between multiple platforms including databases, APIs, and cloud services. Ensures data consistency across systems.',
      tags: ['n8n', 'Data Sync', 'API Integration'],
      imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=600&fit=crop',
      liveUrl: 'https://example.com/blog/data-sync-workflow',
      githubUrl: undefined,
    },
    {
      title: 'Customer Onboarding Automation',
      description: 'Automated customer onboarding workflow using n8n. Handles new user registration, sends welcome emails, creates accounts in various services, and tracks onboarding progress.',
      tags: ['n8n', 'Customer Onboarding', 'Automation'],
      imageUrl: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&h=600&fit=crop',
      liveUrl: 'https://example.com/blog/customer-onboarding',
      githubUrl: undefined,
    },
  ],
}

function ProjectsPageContent() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const tabQuery = searchParams.get('tab')
  
  const [activeTab, setActiveTab] = useState<TabType>(
    (tabQuery && ['websites', 'apps', 'workflows', 'softwares'].includes(tabQuery)) 
      ? (tabQuery === 'softwares' ? 'workflows' : tabQuery as TabType)
      : 'websites'
  )

  // Keep state in sync with URL query parameter when navigating with browser buttons
  useEffect(() => {
    if (tabQuery && ['websites', 'apps', 'workflows', 'softwares'].includes(tabQuery)) {
      const mappedTab = tabQuery === 'softwares' ? 'workflows' : tabQuery as TabType
      if (mappedTab !== activeTab) {
        setActiveTab(mappedTab)
      }
    }
  }, [tabQuery, activeTab])

  const handleTabClick = (tab: TabType) => {
    setActiveTab(tab)
    router.push(`${pathname}?tab=${tab}`, { scroll: false })
  }

  return (
    <section className="flex flex-col items-center justify-center min-h-screen py-12 px-4">
      <div className="w-full max-w-7xl">
        {/* Title */}
        <h1 className="text-5xl font-bold text-white tracking-tight text-center mb-12 drop-shadow-lg">
          My Projects
        </h1>

        {/* Tabs */}
        <div className="flex justify-center gap-2 md:gap-4 mb-8 md:mb-12 flex-wrap px-4">
          <button
            onClick={() => handleTabClick('websites')}
            className={`px-4 md:px-6 py-2 md:py-3 rounded-lg text-sm md:text-base font-semibold transition-all duration-200 active:scale-95 ${
              activeTab === 'websites'
                ? 'bg-white text-gray-900 shadow-md'
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            Websites
          </button>
          <button
            onClick={() => handleTabClick('apps')}
            className={`px-4 md:px-6 py-2 md:py-3 rounded-lg text-sm md:text-base font-semibold transition-all duration-200 active:scale-95 ${
              activeTab === 'apps'
                ? 'bg-white text-gray-900 shadow-md'
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            Apps
          </button>
          <button
            onClick={() => handleTabClick('workflows')}
            className={`px-4 md:px-6 py-2 md:py-3 rounded-lg text-sm md:text-base font-semibold transition-all duration-200 active:scale-95 ${
              activeTab === 'workflows'
                ? 'bg-white text-gray-900 shadow-md'
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            n8n Workflows
          </button>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {projectsData[activeTab].map((project, index) => (
            <ProjectCard
              key={index}
              title={project.title}
              description={project.description}
              tags={project.tags}
              imageUrl={project.imageUrl}
              liveUrl={project.liveUrl}
              githubUrl={'githubUrl' in project ? project.githubUrl : undefined}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default function ProjectsPage() {
  return (
    <Suspense fallback={
      <section className="flex items-center justify-center min-h-screen">
        <div className="text-white">Loading...</div>
      </section>
    }>
      <ProjectsPageContent />
    </Suspense>
  )
}
