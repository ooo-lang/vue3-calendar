<template>
  <div>
    <Calendar />
    <router-view />
  </div>
</template>
<script>
import Calendar from './Calendar.vue'

export default {
  name: 'CalendarView',
  components: {
    Calendar,
  }
}
</script>
<style>

</style>