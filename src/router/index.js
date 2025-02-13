import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/HomeComponent.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('../views/DashboardComponent.vue')
  },
  {
    path: '/patient',
    name: 'Patient Management',
    component: () => import('../views/PatientManagement.vue')
  },
  {
    path: '/new',
    name: 'New Patient',
    component: () => import('../views/NewPatient.vue')
  },
  {
    path: '/follow',
    name: 'Follow',
    component: () => import('../views/Follow.vue')
  },
  {
    path: '/old',
    name: 'Old Patient',
    component: () => import('../views/OldPatient.vue')
  },
  {
    path: '/queue',
    name: 'Queue',
    component: () => import('../views/QueueManagement.vue')
  },
  {
    path: '/history',
    name: 'History',
    component: () => import('../views/HistoryComponent.vue')
  },
  {
    path: '/current',
    name: 'Current',
    component: () => import('../views/CurrentPatient.vue')
  },
  {
    path: '/analytics',
    name: 'Analytics',
    component: () => import('../views/AnalyticsComponent.vue')
  },
  {
    path: '/announcement',
    name: 'Announcement',
    component: () => import('../views/AnnounceMent.vue')
  },
  {
    path: '/daily',
    name: 'Daily Reports',
    component: () => import('../views/DailyReports.vue')
  },
  {
    path: '/inventory',
    name: 'Inventory',
    component: () => import('../views/Inventory.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router