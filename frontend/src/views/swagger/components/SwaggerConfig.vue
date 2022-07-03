<template>
  <el-dialog @open="handleOpen" v-model="visible">
    <el-form>
      <el-form-item label="名称">
        <el-input v-model="detailData.name"></el-input>
      </el-form-item>
      <el-form-item label="文档源">
        <el-input v-model="detailData.path"></el-input>
      </el-form-item>
      <el-form-item label="分组">
        <el-input v-model="detailData.tag"></el-input>
      </el-form-item>
    </el-form>
    <div>
      <el-button type="primary" @click="handleConfirm">确认</el-button>
      <el-button @click="visible = false">取消</el-button>
    </div>
  </el-dialog>
</template>
<script lang="ts" setup>
import { computed, ref } from "vue";
import { SwaggerRecord, addSwaggerConfig } from "../../../api/swagger";
const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  id: {
    type: String,
    required: true,
  },
});
const emptyData = {
  name: "",
  path: "",
  tag: "",
};
const detailData = ref<SwaggerRecord>({ ...emptyData });
const emit = defineEmits(["update:modelValue", "success"]);
const visible = computed({
  get: () => props.modelValue,
  set: (v) => emit("update:modelValue", v),
});

const handleOpen = () => {
  detailData.value = {
    ...emptyData,
  };
};
const handleConfirm = () => {
  addSwaggerConfig(detailData.value).then(() => {
    emit("success");
  });
};
</script>
