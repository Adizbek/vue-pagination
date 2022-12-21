<template>
  <div>
    <div style="height: 400px; width: 400px; background: #333; color: wheat; overflow: auto">
      <ScrollContainer :trigger-load="pag.loadMore" :page="pag.pagination.page">
        <div v-for="it in items" :key="it">
          {{ it }}
        </div>
      </ScrollContainer>
    </div>

    <button @click="pag.loadMore">More</button>
  </div>
</template>

<script lang="ts">
import {defineComponent, ref} from "vue";
import ScrollContainer from "@/lib/ScrollContainer.vue";
import {usePagination} from "@/lib/pagination";

export default defineComponent({
  name: "DummyEndlessScroll",
  components: {ScrollContainer},

  setup() {
    const items = ref<string[]>([]);

    const pag = usePagination({
      async loadData(page: number) {
        if (process.env.NODE_ENV !== 'production')
          console.log('Page', page);

        for (let i = 0; i < 10; i++) {
          items.value.push('' + ((i + (page - 1) * 10) + 1))
        }

        return true;
      }
    })


    return {items, pag};
  }
})
</script>
