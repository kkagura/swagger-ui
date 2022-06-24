<template>
  <div v-if="swaggerRequest" class="request-panel">
    <h1 class="panel-title">{{ swaggerRequest.summary }}</h1>
    <div class="panel-content">
      <detail-item title="接口地址">
        {{ url }}
      </detail-item>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed, inject, PropType, toRefs } from "vue";
import { SwaggerRequest } from "..";
import DetailItem from "../../../components/DetailItem.vue";
import { swaggerBaseUrlKey } from "../token";

const props = defineProps({
  swaggerRequest: {
    type: Object as PropType<SwaggerRequest>,
  },
  path: {
    type: String,
    default: "",
  },
});
const { swaggerRequest, path } = toRefs(props);

const baseURL = inject(swaggerBaseUrlKey);

const url = computed(() => `${baseURL?.value ?? ""}${path.value}`);
</script>
<style lang="less" scoped>
.request-panel {
  .panel-title {
    line-height: 36px;
    font-size: 20px;
    font-weight: 600;
  }
}
</style>
