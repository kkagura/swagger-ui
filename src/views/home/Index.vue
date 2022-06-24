<template>
  <div class="page-layout">
    <el-container>
      <el-header>Header</el-header>
      <el-container>
        <el-aside width="256px">
          <el-menu @select="onSelect">
            <el-sub-menu
              :index="group.name"
              :key="group.name"
              v-for="group in menus"
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
          <request-panel :path="requestPath" :swagger-request="swaggerRequest"></request-panel>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script lang="ts" setup>
import { provide, ref } from "vue";
import Swagger, { RequestMenu, SwaggerRequest, TagGroupItem } from ".";
import { fetchSwagger } from "../../api";
import { createMenus, splitPathId } from "./utils";
import { swaggerBaseUrlKey } from "./token";
import RequestPanel from "./components/RequestPanel.vue";

// store
const baseURL = ref("");
provide(swaggerBaseUrlKey, baseURL);

const menus = ref<TagGroupItem[]>([]);
const swagger = ref<Swagger>();
const swaggerRequest = ref<SwaggerRequest>();
const requestPath = ref("");
fetchSwagger("").then((data) => {
  swagger.value = data;
  menus.value = createMenus(data);
});

const onSelect = (index: string, indexPath: string[], item: RequestMenu) => {
  const [path, method] = splitPathId(index);
  const request = swagger.value?.paths[path]?.[method];
  if (request) {
    swaggerRequest.value = request;
    requestPath.value = path;
  }
};
</script>
<style scoped lang="less">
.page-layout {
  width: 100vw;
  height: 100vh;
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
