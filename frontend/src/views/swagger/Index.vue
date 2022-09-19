<template>
  <div v-loading="loading" class="page-layout">
    <el-container>
      <el-header>{{ swagger?.info.title }}</el-header>
      <el-container>
        <el-aside width="256px">
          <div class="tree-search">
            <el-input
              v-model="rawSearchKey"
              placeholder="请输入接口路径或名称"
            ></el-input>
          </div>
          <el-menu @select="onSelect" :default-active="defaultIndex">
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
                <span :title="requestMenu.name" class="path-name">
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
import { getSwaggerDoc } from "../../api/swagger";
import { useRoute } from "vue-router";
const loading = ref(false);
const route = useRoute();

// store
const swagger = ref<Swagger>();
provide(swaggerContextKey, swagger);

const menus = ref<TagGroupItem[]>([]);
const currentSelectContext = reactive<{
  requestData?: SwaggerRequest;
  path?: string;
  method?: string;
}>({});

const onSelect = (index: string) => {
  const [path, method] = splitPathId(index);
  const request = swagger.value?.paths[path]?.[method];
  if (request) {
    currentSelectContext.requestData = request;
    currentSelectContext.method = method;
    currentSelectContext.path = path;
  }
  location.hash = index;
};

const rawSearchKey = ref("");
const searchKey = ref("");
const syncSearchKey = useDebounceFn(() => {
  searchKey.value = rawSearchKey.value;
  console.log(searchKey.value);
}, 200);
watch(() => rawSearchKey.value, syncSearchKey);

const filteredMenus = computed(() => filterMenu(menus.value, searchKey.value));

const fetch = () => {
  loading.value = true;
  return getSwaggerDoc(route.params.id as string)
    .then((data) => {
      swagger.value = data;
      menus.value = createMenus(data);
    })
    .finally(() => {
      loading.value = false;
    });
};
const defaultIndex = ref("");
const onInit = () => {
  fetch().then(() => {
    if (location.hash) {
      onSelect(location.hash.substring(1));
      defaultIndex.value = location.hash.substring(1);
    }
  });
};
onInit();
</script>
<style scoped lang="less">
.page-layout {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background-color: #f5f7fb;
  .el-header {
    background-color: #4887bd;
    line-height: 60px;
    font-size: 20px;
  }
  .el-main {
    height: calc(100vh - 60px);
  }
  .el-aside {
    height: calc(100vh - 60px);
    overflow-y: auto;
    .tree-search {
      padding: 8px 4px;
      background-color: #fff;
    }
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
    .path-name {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      width: calc(100% - 76px);
    }
  }
}
</style>
