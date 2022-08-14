<template>
  <div data-cy="activity-empty-state" class="activity__empty-state">
    <PersonEmptyStateVue v-if="imageNumber === 1"></PersonEmptyStateVue>
    <PersonEmptyStateVue2 v-else-if="imageNumber === 2"></PersonEmptyStateVue2>
  </div>
</template>

<script>

import PersonEmptyStateVue from '@/assets/images/PersonEmptyState2.vue';
import PersonEmptyStateVue2 from '@/assets/images/PersonEmptyState3.vue';

export default {
  name: 'ActivityEmptyState',
  props: {
    imageNumber: Number
  },
  components: {
    PersonEmptyStateVue,
    PersonEmptyStateVue2
  },
  data() {
    return {
    }
  }
}

</script>