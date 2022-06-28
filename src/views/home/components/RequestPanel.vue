<template>
  <div v-if="swaggerRequest" class="request-panel">
    <h1 class="panel-title">{{ swaggerRequest.summary }}</h1>
    <div class="panel-content">
      <detail>
        <detail-item title="接口地址" inline>
          <code>{{ url }}</code>
        </detail-item>
        <detail-item title="请求方式" inline>
          <code>{{ method.toUpperCase() }}</code>
        </detail-item>
        <detail-item title="响应状态" :inline="false">
          <el-table border :data="responseStatusData">
            <el-table-column label="状态码" prop="status"></el-table-column>
            <el-table-column label="说明" prop="description"></el-table-column>
            <el-table-column label="schema" prop="schemaType"></el-table-column>
          </el-table>
        </detail-item>
        <detail-item title="响应参数" :inline="false">
          <el-table border default-expand-all row-key="name" :data="responseParamsData">
            <el-table-column label="参数名称" prop="name"></el-table-column>
            <el-table-column label="参数说明" prop="description"></el-table-column>
            <el-table-column label="类型" prop="dataType"></el-table-column>
            <el-table-column label="schema" prop="schemaType"></el-table-column>
          </el-table>
        </detail-item>
      </detail>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed, inject, PropType, toRefs } from "vue";
import { SwaggerRequest } from "..";
import DetailItem from "../../../components/DetailItem.vue";
import Detail from "../../../components/Detail.vue";
import { swaggerContextKey } from "../token";
import { createResponseStatusData, createResponseParamsData } from "../utils";

const props = defineProps({
  swaggerRequest: {
    type: Object as PropType<SwaggerRequest>,
  },
  path: {
    type: String,
    default: "",
  },
  method: {
    type: String,
    default: "",
  },
});
const { swaggerRequest, path, method } = toRefs(props);

const swagger = inject(swaggerContextKey);

const url = computed(() => `${swagger?.value?.basePath ?? ""}${path.value}`);
const responseStatusData = computed(() =>
  swaggerRequest?.value ? createResponseStatusData(swaggerRequest.value) : []
);
const responseParamsData = computed(() =>
  swagger?.value && swaggerRequest?.value
    ? createResponseParamsData(swaggerRequest.value, swagger?.value)
    : []
);
</script>
<style lang="less" scoped>
.request-panel {
  .panel-title {
    line-height: 36px;
    font-size: 20px;
    font-weight: 600;
  }
  .panel-content {
    code {
      color: #ab0f3a;
    }
  }
}
</style>
