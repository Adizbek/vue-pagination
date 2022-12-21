<template>
  <div ref="container" style="overflow: auto; height: 100%">
    <slot></slot>
  </div>
</template>

<script lang="ts" setup>
import {defineProps, nextTick, onMounted, ref} from "vue";

const props = defineProps({
  triggerLoad: {
    required: true,
    type: Function
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
      return (div.scrollHeight - props.threshold) >= (div.parentElement?.clientHeight ?? 0)
    } else {
      return false;
    }
  }

  function prefilled() {
    if (div) {
      return div.children.length > 0
    }

    return false;
  }

  async function autoLoadToFitContent() {
    async function load() {
      const hasMore = await props.triggerLoad();

      if (hasMore) {
        await nextTick()

        console.log(parentFilled())
        if (!parentFilled())
          await load();
      }
    }

    // We load contents if it's empty container or has items and items doesn't fit parent
    if (!prefilled() || (prefilled() && !parentFilled()))
      await load();
  }

  autoLoadToFitContent();

  div.addEventListener('scroll', (e: Event) => {
    const element = e.target as HTMLElement;

    console.log('Here')
    if (hasReachedEnd(element)) {
      props.triggerLoad()
    }
  });
})
</script>
