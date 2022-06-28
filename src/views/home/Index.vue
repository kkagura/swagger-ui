<template>
  <div class="page-layout">
    <el-container>
      <el-header>Header</el-header>
      <el-container>
        <el-aside width="256px">
          <div class="tree-search">
            <el-input
              v-model="rawSearchKey"
              placeholder="请输入接口路径或名称"
            ></el-input>
          </div>
          <el-menu @select="onSelect">
            <el-sub-menu
              :index="group.name"
              :key="group.name"
              v-for="group in filteredMenus"
            >
              <template #title>
                <span>
                  {{ group.name }}
                </span>
              </template>
              <el-menu-item
                :index="requestMenu.key"
                :key="requestMenu.key"
                v-for="requestMenu in group.children"
              >
                <span :class="`path-method path-method__${requestMenu.method}`">
                  {{ requestMenu.method.toUpperCase() }}
                </span>
                <span>
                  {{ requestMenu.name }}
                </span>
              </el-menu-item>
            </el-sub-menu>
          </el-menu>
        </el-aside>
        <el-main>
          <request-panel
            :path="currentSelectContext.path"
            :swagger-request="currentSelectContext.requestData"
            :method="currentSelectContext.method"
          ></request-panel>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script lang="ts" setup>
import { computed, provide, reactive, ref, watch } from "vue";
import Swagger, { RequestMenu, SwaggerRequest, TagGroupItem } from ".";
import { fetchSwagger } from "../../api";
import { createMenus, splitPathId, filterMenu } from "./utils";
import { swaggerContextKey } from "./token";
import RequestPanel from "./components/RequestPanel.vue";
import { useDebounceFn } from "@vueuse/core";

// store
const swagger = ref<Swagger>();
provide(swaggerContextKey, swagger);

const menus = ref<TagGroupItem[]>([]);
const currentSelectContext = reactive<{
  requestData?: SwaggerRequest;
  path?: string;
  method?: string;
}>({});
fetchSwagger("").then((data) => {
  swagger.value = data;
  menus.value = createMenus(data);
});

const onSelect = (index: string, indexPath: string[], item: RequestMenu) => {
  const [path, method] = splitPathId(index);
  const request = swagger.value?.paths[path]?.[method];
  if (request) {
    currentSelectContext.requestData = request;
    currentSelectContext.method = method;
    currentSelectContext.path = path;
  }
};

const rawSearchKey = ref("");
const searchKey = ref("");
const syncSearchKey = useDebounceFn(() => {
  searchKey.value = rawSearchKey.value;
  console.log(searchKey.value);
}, 200);
watch(() => rawSearchKey.value, syncSearchKey);

const filteredMenus = computed(() => filterMenu(menus.value, searchKey.value));
</script>
<style scoped lang="less">
.page-layout {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  .el-main {
    height: calc(100vh - 60px);
  }
  :deep(.el-menu-item) {
    .path-method {
      width: 52px;
      font-weight: bold;
      color: #61affd;
      font-size: 12px;
      &__get {
        color: #0d5aa7;
      }
      &__post {
        color: #61affd;
      }
      &__delete {
        color: #f93e3e;
      }
    }
  }
}
</style>
