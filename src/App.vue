<template>
  <DummyEndlessScroll/>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import DummyEndlessScroll from "@/components/DummyEndlessScroll.vue";

export default defineComponent({
  name: 'App',
  components: {
    DummyEndlessScroll,
  }
});
</script>
