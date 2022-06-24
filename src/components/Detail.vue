<template>
  <div></div>
</template>
<script lang="ts" setup>
import { provide, reactive, toRefs } from "vue";
import { detailContextKey } from "../tokens";

const props = defineProps({
  labelWidth: {
    type: String,
    default: "160px",
  },
  inline: {
    type: Boolean,
    default: true,
  },
});
const { labelWidth, inline } = toRefs(props);
provide(detailContextKey, reactive({ labelWidth, inline }));
</script>
