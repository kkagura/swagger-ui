<template>
  <div class="buttons" style="text-align: right; margin: 10px 0">
    <el-button type="primary" @click="configPanelContext.visible = true"
      >新增</el-button
    >
  </div>
  <el-table border :data="tableData.records">
    <el-table-column prop="name" label="文档名"></el-table-column>
    <el-table-column prop="name" label="文档源"></el-table-column>
    <el-table-column prop="name" label="标签"></el-table-column>
    <el-table-column label="操作">
      <template #default="{ row }">
        <a
          @click="router.push({ params: { id: row.id }, name: 'SwaggerDoc' })"
          href="javascript:;"
        >
          查看文档
        </a>
      </template>
    </el-table-column>
  </el-table>
  <SwaggerConfig
    v-model="configPanelContext.visible"
    :id="configPanelContext.id"
    @success="handleSuccess"
  ></SwaggerConfig>
</template>
<script lang="ts" setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { fetchSwaggerList, PageResult, SwaggerRecord } from "../../api/swagger";
import SwaggerConfig from "./components/SwaggerConfig.vue";
const router = useRouter();
const tableData = ref<PageResult<SwaggerRecord>>({
  total: 0,
  page: 0,
  pageSize: 10,
  records: [],
});
const configPanelContext = reactive({
  visible: false,
  id: "",
});
const handleSuccess = () => {
  configPanelContext.visible = false;
  fetch();
};
const fetch = () => {
  fetchSwaggerList().then((res) => {
    console.log(res);
    tableData.value = res;
  });
};
fetch();
</script>
