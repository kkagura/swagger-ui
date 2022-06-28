<template>
  <div :class="detailItemClasses">
    <div :style="labelWidthStyle" :class="ns.e('title')">
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
  labelWidth: {
    type: String,
  },
});

const DEFAULT_LABEL_WIDTH = "80px";

const detailContext = inject(detailContextKey);

const ns = useNamespace("detail-item");
const isInline = computed(() =>
  isDef(props.inline)
    ? props.inline
    : isDef(detailContext?.inline)
    ? detailContext?.inline
    : true
);
const labelWidth = computed(() =>
  isDef(props.labelWidth)
    ? props.labelWidth
    : isDef(detailContext?.labelWidth)
    ? detailContext?.labelWidth
    : DEFAULT_LABEL_WIDTH
);
const detailItemClasses = computed(() => [
  ns.b(),
  ns.is("inline", isInline.value),
]);
const labelWidthStyle = computed(() => {
  const res: Record<string, any> = {};
  if (isInline.value) {
    res["width"] = labelWidth.value ?? DEFAULT_LABEL_WIDTH;
  }
  console.log(res, "xx");
  return res;
});
</script>
<style lang="less" scoped>
.detail-item {
  margin-bottom: 24px;
  &__title {
    line-height: 28px;
  }
  &.is-inline {
    display: flex;
    align-items: center;
    .detail-item__content {
      margin-left: 8px;
    }
  }
  &:not(.is-inline) {
    .detail-item__title {
      margin-bottom: 8px;
    }
  }
}
</style>
