<template>
  <div class="code-preview">
    <h2 class="file-name" v-if="name">
      {{ name }}
    </h2>
    <pre
      :class="cls"
      class="code-panel"
    ><code :class="cls" v-html="html"></code></pre>
  </div>
</template>
<script lang="ts" setup>
import { toRefs, computed } from "vue";
import Prism from "prismjs";

const props = withDefaults(
  defineProps<{
    code: string;
    lang?: string;
    name?: string;
  }>(),
  {
    lang: "javascript",
  }
);
const { code, lang, name } = toRefs(props);
const cls = computed(() => [`language-${lang.value}`]);
const html = computed(() =>
  Prism.highlight(code.value ?? "", Prism.languages[lang.value], lang.value)
);
</script>
<style lang="less" scoped>
.code-preview {
  border: 1px solid #cdcdcd;
  overflow: hidden;
  .file-name {
    background-color: #f9f9fb;
    line-height: 28px;
    padding-left: 12px;
  }
  .code-panel {
    padding: 0 12px;
    margin: 0;
  }
}
</style>
