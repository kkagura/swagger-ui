<template>
  <div :class="detailItemClasses">
    <div :class="ns.e('title')">
      <slot name="title">
        {{ title }}
      </slot>
    </div>
    <div :class="ns.e('content')">
      <slot></slot>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed, inject } from "vue";
import { useNamespace } from "../hooks";
import { detailContextKey } from "../tokens";
import { isDef } from "../utils";
const props = defineProps({
  inline: {
    type: Boolean,
  },
  title: {
    type: String,
    default: "",
  },
});

const detailContext = inject(detailContextKey);

const ns = useNamespace("detail-item");
const isInline = computed(() =>
  isDef(props.inline)
    ? props.inline
    : isDef(detailContext?.inline)
    ? detailContext?.inline
    : true
);
const detailItemClasses = computed(() => {
  ns.b();
  ns.is("inline", isInline.value);
});
const styles = computed(() => {});
</script>
<style lang="less" scoped></style>
