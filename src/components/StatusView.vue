<template>
  <div class="status__circle" :class="{'status__circle_orange': status === 'high', 'status__circle_green': status === 'normal', 'status__circle_blue': status === 'low', 'status__circle_purple': status === 'very-low', 'status__circle_bigger': bigger}">

  </div>
</template>

<script>
export default {
  props: {
    status: String,
    bigger: Boolean
  },
  data() {
    return {
      
    }
  },

  mounted() {
    console.log(status)
  }
  
}
</script>

<style lang="scss">
  .status {
    &__circle {
      width: 9px;
      height: 9px;
      border-radius: 25px;
      background-color: #ED4C5C;
      &_orange {
        background-color: #F8A541;
      }
      &_green {
        background-color: #00A790;
      }
      &_blue {
        background-color: #428BC1;
      }
      &_purple {
        background-color: #8942C1;
      }
      &_bigger {
        width: 14px;
        height: 14px;
      }
    }
  }
</style>