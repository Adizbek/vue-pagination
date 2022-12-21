<template>
  <div ref="container">
    <slot></slot>
  </div>
</template>

<script lang="ts" setup>
import {defineProps, onMounted, ref, watch} from "vue";

const props = defineProps({
  triggerLoad: {
    required: true,
    type: Function
  },

  page: {
    required: true,
    type: Number
  },

  reverse: {
    type: Boolean,
    default: false
  },

  threshold: {
    default: 100,
    type: Number,
  }
})

const container = ref<HTMLDivElement | null>(null)

function hasReachedEnd(element: HTMLElement) {
  if (props.reverse) {
    return (element.scrollHeight - element.clientHeight) + element.scrollTop <= props.threshold
  } else {
    return (element.scrollHeight - element.clientHeight) - element.scrollTop <= props.threshold;
  }
}

onMounted(() => {
  if (!container.value) {
    return;
  }

  const div = container.value;

  function parentFilled() {
    if (div) {
      return div?.clientHeight >= (div.parentElement?.clientHeight ?? 0)
    } else {
      return false;
    }
  }

  watch(() => props.page, () => {
    if (!parentFilled()) {
      props.triggerLoad();
    }
  })

  div.addEventListener('scroll', (e: Event) => {
    const element = e.target as HTMLElement;

    if (hasReachedEnd(element)) {
      props.triggerLoad()
    }
  });
})
</script>
