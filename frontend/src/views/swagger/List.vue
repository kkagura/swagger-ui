<template>
  <div v-loading="loading" class="swagger-list">
    <div class="search-form section">
      <el-form-item label="文档名称">
        <el-input
          placeholder="请输入"
          clearable
          maxlength="20"
          v-model="searchOptions.nameLike"
        ></el-input>
      </el-form-item>
      <el-form-item label="分组">
        <el-select
          placeholder="请选择"
          clearable
          v-model="searchOptions.groupId"
        >
          <el-option
            v-for="group in groups"
            :label="group.name"
            :value="group.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search">查询</el-button>
      </el-form-item>
    </div>
    <div class="section">
      <div class="buttons" style="text-align: right; margin: 10px 0">
        <el-button type="primary" @click="handleAdd">新增</el-button>
      </div>
      <el-table border :data="tableData.records">
        <el-table-column prop="name" label="文档名"></el-table-column>
        <el-table-column prop="path" label="文档源"></el-table-column>
        <el-table-column prop="groupName" label="分组"></el-table-column>
        <el-table-column label="操作">
          <template #default="{ row }">
            <div class="operate">
              <el-link
                @click="
                  router.push({ params: { id: row.id }, name: 'SwaggerDoc' })
                "
              >
                查看文档
              </el-link>
              <el-link @click="handleEdit(row)"> 编辑 </el-link>
              <el-link @click="handleDelete(row)"> 删除 </el-link>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        :page-size="tableData.pageSize"
        :current-page="tableData.page"
        @update:current-page="handlePageChange"
        :total="tableData.total"
      ></el-pagination>
    </div>
    <SwaggerConfig
      v-model="configPanelContext.visible"
      :id="configPanelContext.id"
      @success="handleSuccess"
    ></SwaggerConfig>
  </div>
</template>
<script lang="ts" setup>
import { ElMessage, ElMessageBox } from "element-plus";
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import {
  fetchSwaggerList,
  PageResult,
  SwaggerRecord,
  deleteSwaggerRecord,
} from "../../api/swagger";
import { fetchSwaggerGroupList } from "../../api/swaggerGroup";
import SwaggerConfig from "./components/SwaggerConfig.vue";
const router = useRouter();
const tableData = ref<PageResult<SwaggerRecord>>({
  total: 0,
  page: 1,
  pageSize: 10,
  records: [],
});
const configPanelContext = reactive({
  visible: false,
  id: "",
});
const searchOptions = reactive({
  nameLike: "",
  groupId: "",
});
const handleSuccess = () => {
  configPanelContext.visible = false;
  tableData.value.page = 1;
  searchOptions.nameLike = "";
  searchOptions.groupId = "";
  fetch();
};

const handleEdit = (row: any) => {
  configPanelContext.id = row.id;
  configPanelContext.visible = true;
};

const handleAdd = () => {
  configPanelContext.id = "";
  configPanelContext.visible = true;
};

const handleDelete = (row: any) => {
  ElMessageBox.confirm("数据删除后无法找回，是否确认删除？", "警告", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
  }).then(() => {
    deleteSwaggerRecord({ id: row.id }).then(() => {
      ElMessage.success("操作成功!");
      tableData.value.page = 1;
      fetch();
    });
  });
};

const loading = ref(false);
const fetch = () => {
  loading.value = true;
  fetchSwaggerList({
    ...searchOptions,
    page: tableData.value.page,
    pageSize: tableData.value.pageSize,
  })
    .then((res) => {
      tableData.value = res;
    })
    .finally(() => {
      loading.value = false;
    });
};

const groups = ref<{ name: string; id: string }[]>([]);
const getGroupList = () => {
  fetchSwaggerGroupList().then((res) => {
    groups.value = res;
  });
};

const handlePageChange = () => {};

const search = () => {
  fetch();
};

const onInit = () => {
  getGroupList();
  fetch();
};
onInit();
</script>
<style lang="less" scoped>
.swagger-list {
  width: 100vw;
  height: 100vh;
  padding: 24px;
  background-color: #f5f7fb;
  .search-form {
    display: flex;
    background-color: #fff;
    .el-form-item {
      margin-bottom: 0;
      margin-right: 14px;
      width: 300px;
    }
    .el-select {
      width: 100%;
    }
  }

  .operate {
    .el-link {
      margin-right: 4px;
      color: var(--el-link-hover-text-color);
    }
  }
}
</style>
