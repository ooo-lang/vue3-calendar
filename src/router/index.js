import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'calendar',
      component: () => import('../components/CalendarView.vue'),
      children: [{
        path: 'calendar/:id',
        component: () => import('../components/CalendarDetail.vue'),
        name: 'calendarDetail',
      }]
    },
    // {
    //   path: '/calendar/:id',
    //   name: 'calendarDetail',
    //   component: () => import('../src/components/CalendarDetail.vue'),
    // }
  ]
});

export default router;