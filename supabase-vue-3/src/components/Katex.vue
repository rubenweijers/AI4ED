<template>
  <span ref="katex" />
</template>

<script>
import katex from 'katex';

export default {
  props: {
    expression: {
      type: String,
      required: true,
    },
  },
  mounted() {
    katex.render(this.expression, this.$refs.katex, {
      throwOnError: false,
      displayMode: false, // Use inline rendering
    });
  },
};
</script>
