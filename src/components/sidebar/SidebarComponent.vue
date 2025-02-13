<script>
import SidebarLink from './SidebarLink'
import { collapsed, toggleSidebar, sidebarWidth } from './state'

export default {
  components: { SidebarLink },
  setup() {
    return { collapsed, toggleSidebar, sidebarWidth }
  }
}
</script>

<template>
  <div class="sidebar" :style="{ width: sidebarWidth }">
    <!-- Top Section: Logo -->
    <div class="logo-container" :style="{ width: collapsed ? '50px' : '200px' }">
      <img src="@/assets/rabguardlogo.png" alt="Logo" class="logo" :style="{ width: collapsed ? '40px' : '150px' }">
    </div>
    <div class="separator"></div>
    <!-- End Top Section -->
    <!-- Middle Section: Router Links -->
    <div class="links">
  <SidebarLink to="/dashboard" icon="fas fa-tachometer-alt">Dashboard</SidebarLink>
  <SidebarLink to="/patient" icon="fas fa-users">Patient Accounts</SidebarLink>
  <SidebarLink to="/inventory" icon="fas fa-user-alt-slash">Inventory</SidebarLink>
  <!-- <SidebarLink to="/new" icon="fas fa-user-alt-slash">No Dosage / Booster</SidebarLink> -->
  <SidebarLink to="/old" icon="fas fa-syringe">Scheduled Today</SidebarLink>
  <!-- <SidebarLink to="/current" icon="fas fa-calendar-check">Scheduled</SidebarLink> -->
  <SidebarLink to="/follow" icon="fas fa-procedures">Other Schedules</SidebarLink>
  <SidebarLink to="/queue" icon="fas fa-list-ul">Queues</SidebarLink>
  <SidebarLink to="/history" icon="fas fa-history">History</SidebarLink>
  <SidebarLink to="/daily" icon="fas fa-chart-pie">Daily Report</SidebarLink>
  <SidebarLink to="/analytics" icon="fas fa-chart-pie">Accomplishment Report</SidebarLink>
  <SidebarLink to="/announcement" icon="fas fa-bullhorn">Announcements</SidebarLink>
</div>

    <div class="separator"></div>
    <!-- End Middle Section -->

    <!-- Bottom Section: Logout Link and Collapse Button -->
    <div class="bottom-section">
      <SidebarLink to="/" icon="fas fa-sign-out-alt"></SidebarLink>
      <span
        class="collapse-icon"
        :class="{ 'rotate-180': collapsed }"
        @click="toggleSidebar"
      >
        <i class="fas fa-angle-double-left"></i>
      </span>
    </div>
    <!-- End Bottom Section -->
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap');

:root {
  --sidebar-bg-color: #188754;
  --sidebar-item-hover: #157347;
  --sidebar-item-active: #145c3d;
  --font-family: 'Montserrat', sans-serif;
}

.sidebar {
  color: white;
  background-color: var(--sidebar-bg-color);
  position: fixed;
  z-index: 1;
  top: 0;
  left: 0;
  bottom: 0;
  padding: 1em 0.5em;
  transition: width 0.5s ease;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow-y: hidden;
  overflow-x: hidden;
  font-family: var(--font-family);
  /* border-top-right-radius: 15px ;
  border-bottom-right-radius: 15px; */
  
}

.logo-container {
  text-align: center;
  margin-bottom: 1rem;
  transition: width 0.5s ease;
}

.logo {
  height: auto;
  transition: width 0.5s ease;
}

.links {
  flex-grow: 1;
}

.separator {
  height: 2px;
  background-color: rgba(255, 255, 255, 0.2);
  margin: .5rem 0;
}

.sidebar-link {
  display: flex;
  align-items: center;
  padding: 10px;
  text-decoration: none;
  color: white;
  transition: background-color 0.5s;
  font-family: var(--font-family);
}

.sidebar-link:hover {
  background-color: var(--sidebar-item-hover);
}

.link.active {
  background-color: var(--sidebar-item-active);
}

.bottom-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 1rem;
}

.collapse-icon {
  margin-top: 1rem;
  padding: 0.75em;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  transition: transform 0.5s linear;
}

.rotate-180 {
  transform: rotate(180deg);
}

/* Media Queries for Responsive Design */
@media (max-width: 768px) {
  .sidebar {
    width: 60px;
  }
  .logo-container {
    text-align: center;
    margin-bottom: 1rem;
    display: flex;
    justify-content: center;
  }

  .logo {
    height: auto;
    border-radius: 50%; /* Make it circular */
    transition: width 0.5s ease;
  }
  .sidebar-link {
    justify-content: center;
  }
  .sidebar-link span {
    display: none;
  }
}
</style>
