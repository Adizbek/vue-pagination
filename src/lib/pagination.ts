import {computed, reactive, Ref, ToRefs, toRefs, UnwrapNestedRefs} from "vue";

type LoadDataFunction<T> = (page: number, payload?: T) => Promise<boolean>;

interface UsePaginationOptions<T = unknown> {
  loadData: LoadDataFunction<T>;
  payload?: T;
}

interface UseMultiPaginationOption<T> extends UsePaginationOptions<T> {
  keyExtractor: (payload: T) => string;
}

interface PaginationData<T> {
  page: number;
  loading: boolean;
  hasMore: boolean;
  loadData: LoadDataFunction<T>;
}

export type Pagination<T> =
  ToRefs<PaginationData<T> extends Ref ? PaginationData<T> : UnwrapNestedRefs<PaginationData<T>>>
  & {
  loadMore:  () => Promise<boolean>;
};

export function usePagination<T>(
  options: UsePaginationOptions<T>
): Pagination<T> {
  const data = reactive<PaginationData<T>>({
    page: 1,
    loading: false,
    hasMore: true,
    loadData: options.loadData,
  });

  const canTrigger = computed(() => {
    return data.hasMore && !data.loading;
  });

  async function loadMore(): Promise<boolean> {
    if (!canTrigger.value) return false;

    data.loading = true;

    try {
      const hasMore = await data.loadData(data.page, options.payload);

      if (hasMore) {
        data.page++;
      } else {
        data.hasMore = false;
      }
    } catch (e) {
      console.warn(e);
      data.hasMore = false;
    }

    data.loading = false;

    return data.hasMore;
  }

  return {
    ...toRefs(data),
    loadMore,
  };
}

export function useMultiPagination<T>(options: UseMultiPaginationOption<T>) {
  const paginations = new Map<string, Pagination<T>>();

  return (payload: T) => {
    const key = options.keyExtractor(payload);

    if (!paginations.has(key)) {
      paginations.set(
        key,
        usePagination({
          ...options,
          payload,
        })
      );
    }

    return paginations.get(key);
  };
}
