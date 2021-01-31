<template>
  <h2>{{ text }}</h2>
</template>

<script>
export default {
  name: 'BaseSubtitle',

  props: {
    text: {
      type: String,
      required: true,
      default: '',
    },
  },
}
</script>

<style lang="scss" scoped>
h2 {
  font-weight: 700;
  font-size: 38px;
  line-height: 1.5;
  color: #2b4754;
  letter-spacing: 2px;
  text-align: center;
}
</style>
