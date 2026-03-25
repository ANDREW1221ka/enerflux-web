import { createBrowserRouter } from 'react-router-dom'
import { ProtectedRoute } from '../components/auth/ProtectedRoute'
import { RoleGuard } from '../components/auth/RoleGuard'
import { AppLayout } from '../layouts/AppLayout'
import { PublicLayout } from '../layouts/PublicLayout'
import { AdminPage } from '../pages/app/AdminPage'
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
    element: <ProtectedRoute />,
    children: [
      {
        path: '/app',
        element: <AppLayout />,
        children: [
          { index: true, element: <DashboardPage /> },
          {
            element: <RoleGuard allowedRoles={['platform_admin']} />,
            children: [{ path: 'admin', element: <AdminPage /> }],
          },
        ],
      },
    ],
  },
])
