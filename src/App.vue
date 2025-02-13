<script>
import Sidebar from '@/components/sidebar/SidebarComponent'
import { sidebarWidth } from '@/components/sidebar/state'
import HeaderComponent from '@/components/HeaderComponent';

export default {

  components: { Sidebar, HeaderComponent },
  setup() {
    return { sidebarWidth }
  },
  computed: {
      isLoginPage() {
        // Check if the current route is the login page
        return this.$route.path === '/';
      },
    },
}
</script>
<template>
  <template v-if="!isLoginPage"> <!-- Only render sidebar if not on login page -->
  <HeaderComponent />
  <Sidebar />
  <div :style="{ 'margin-left': sidebarWidth }">
  <router-view />
  </div>
  </template>
    <template v-else>
    <router-view />
</template>
</template>

<style>
body{
  margin: 0;
}
#app {
  overflow-x: hidden;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>