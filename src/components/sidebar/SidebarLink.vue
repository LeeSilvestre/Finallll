<script>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { collapsed } from './state'

export default {
  props: {
    to: { type: String, required: true },
    icon: { type: String, required: true }
  },
  setup(props) {
    const route = useRoute()
    const isActive = computed(() => route.path === props.to)
    return { isActive, collapsed }
  }
}
</script>

<template>
  <router-link :to="to" class="link" :class="{ active: isActive }">
    <i class="icon" :class="icon" />
    <transition name="fade">
      <span v-if="!collapsed">
        <slot />
      </span>
    </transition>
  </router-link>
</template>

<style scoped>
.link {
  display: flex;
  align-items: center;
  cursor: pointer;
  position: relative;
  font-weight: 400;
  user-select: none;
  margin: 0.1em 0;
  padding: 0.4em;
  border-radius: 0.25em;
  height: 1.5em;
  color: white;
  text-decoration: none;
  transition: transform 0.3s ease-in-out;
}

 .link::before {
  content: "";
  position: absolute;
  left: 0;
  width: 5px; /* Adjust width as needed */
  height: 100%;
  background-color: white;
  transform: scaleY(0); /* Start hidden */
  transition: transform 0.3s ease-in-out;
}
.link:hover::before {
  transform: scaleY(1); /* Expand vertically on hover */
}

.link:hover {
  transform: scale(1.1); /* Zoom effect on link */
}

.link.active::before {
  transform: scaleY(1); /* Keep hover effect for active links */
}

.link .icon {
  flex-shrink: 0;
  width: 25px;
  margin-right: 10px;
}
</style>
