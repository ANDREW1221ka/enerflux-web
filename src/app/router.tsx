import { createBrowserRouter } from 'react-router-dom'
import { AppLayout } from '../layouts/AppLayout'
import { PublicLayout } from '../layouts/PublicLayout'
import { DashboardPage } from '../pages/app/DashboardPage'
import { ContactPage } from '../pages/public/ContactPage'
import { HomePage } from '../pages/public/HomePage'
import { LoginPage } from '../pages/public/LoginPage'
import { ServicesPage } from '../pages/public/ServicesPage'

export const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/servicios', element: <ServicesPage /> },
      { path: '/contacto', element: <ContactPage /> },
      { path: '/login', element: <LoginPage /> },
    ],
  },
  {
    path: '/app',
    element: <AppLayout />,
    children: [{ index: true, element: <DashboardPage /> }],
  },
])
