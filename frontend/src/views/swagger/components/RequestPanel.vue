<template>
  <div v-if="swaggerRequest" class="request-panel">
    <div class="panel-content">
      <detail>
        <section class="section">
          <h1 class="panel-title">{{ swaggerRequest.summary }}</h1>
          <detail-item title="接口地址" inline>
            <code>{{ url }}</code>
          </detail-item>
          <detail-item title="请求方式" inline>
            <code>{{ method.toUpperCase() }}</code>
          </detail-item>
        </section>
        <section class="section">
          <detail-item title="请求参数" :inline="false">
            <el-table
              border
              default-expand-all
              row-key="name"
              :data="requestParamsData"
            >
              <el-table-column label="参数名称" prop="name"></el-table-column>
              <el-table-column
                label="参数说明"
                prop="description"
              ></el-table-column>
              <el-table-column label="类型" prop="dataType"></el-table-column>
              <el-table-column
                label="schema"
                prop="schemaType"
              ></el-table-column>
            </el-table>
          </detail-item>
        </section>
        <section class="section">
          <detail-item title="响应状态" :inline="false">
            <el-table border :data="responseStatusData">
              <el-table-column label="状态码" prop="status"></el-table-column>
              <el-table-column
                label="说明"
                prop="description"
              ></el-table-column>
              <el-table-column
                label="schema"
                prop="schemaType"
              ></el-table-column>
            </el-table>
          </detail-item>
        </section>
        <section class="section">
          <detail-item title="响应参数" :inline="false">
            <el-table
              border
              default-expand-all
              row-key="name"
              :data="responseParamsData"
            >
              <el-table-column label="参数名称" prop="name"></el-table-column>
              <el-table-column
                label="参数说明"
                prop="description"
              ></el-table-column>
              <el-table-column label="类型" prop="dataType"></el-table-column>
              <el-table-column
                label="schema"
                prop="schemaType"
              ></el-table-column>
            </el-table>
          </detail-item>
        </section>
        <section class="section">
          <detail-item title="参数值类型定义">
            <template #title>
              <div class="flex-title">
                <p>参数值类型定义</p>
                <el-button @click="handleCopyReq" type="primary">
                  复制
                </el-button>
              </div>
            </template>
            <preview-code :code="reqDef"></preview-code>
          </detail-item>
        </section>
        <section class="section">
          <detail-item title="返回值类型定义">
            <template #title>
              <div class="flex-title">
                <p>返回值类型定义</p>
                <el-button @click="handleCopyRes" type="primary">
                  复制
                </el-button>
              </div>
            </template>
            <preview-code :code="resDef"></preview-code>
          </detail-item>
        </section>
      </detail>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed, inject, PropType, toRefs, ref, watch } from "vue";
import { SwaggerRequest } from "..";
import DetailItem from "../../../components/DetailItem.vue";
import Detail from "../../../components/Detail.vue";
import { swaggerContextKey } from "../token";
import {
  createResponseStatusData,
  createResponseParamsData,
  createRequestParamsData,
} from "../utils";
import PreviewCode from "./PreviewCode.vue";
import { generate } from "../swagger/generator";
import { useClipboard } from "@vueuse/core";
import { ElMessage } from "element-plus";

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
const requestParamsData = computed(() =>
  swagger?.value && swaggerRequest?.value
    ? createRequestParamsData(swaggerRequest.value, swagger?.value)
    : []
);
const resDef = ref("");
const reqDef = ref("");
watch([() => path.value, () => method.value], () => {
  if (swagger?.value) {
    const result = generate(
      JSON.parse(JSON.stringify(swagger.value)),
      path.value,
      method.value as any
    );
    reqDef.value = result.reqParams;
    resDef.value = result.resParams;
  }
});
const { copy: copyRes } = useClipboard({ source: resDef });
const handleCopyRes = () => {
  copyRes().then(() => {
    ElMessage.success("复制成功");
  });
};
const { copy: copyReq } = useClipboard({ source: reqDef });
const handleCopyReq = () => {
  copyReq().then(() => {
    ElMessage.success("复制成功");
  });
};
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
    .flex-title {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
}
</style>
