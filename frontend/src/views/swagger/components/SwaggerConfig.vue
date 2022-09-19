<template>
  <el-dialog @open="handleOpen" destroy-on-close v-model="visible">
    <el-form
      ref="formRef"
      :model="detailData"
      :rules="rules"
      label-width="100px"
    >
      <el-form-item prop="name" label="名称">
        <el-input v-model="detailData.name"></el-input>
      </el-form-item>
      <el-form-item prop="path" label="文档源">
        <el-input v-model="detailData.path"></el-input>
      </el-form-item>
      <el-form-item prop="groupId" label="分组">
        <div class="flex">
          <el-select v-model="detailData.groupId">
            <el-option
              v-for="group in groups"
              :label="group.name"
              :value="group.id"
            ></el-option>
          </el-select>
          <el-button @click="handleAddGroup" type="primary">增加分组</el-button>
        </div>
      </el-form-item>
    </el-form>
    <div>
      <el-button type="primary" @click="handleConfirm">确认</el-button>
      <el-button @click="visible = false">取消</el-button>
    </div>
  </el-dialog>
</template>
<script lang="ts" setup>
import { ElMessage, ElMessageBox } from "element-plus";
import { computed, ref } from "vue";
import {
  SwaggerRecord,
  addSwaggerConfig,
  getSwaggerDetail,
  updateSwaggerConfig,
} from "../../../api/swagger";
import {
  addSwaggerGroup,
  fetchSwaggerGroupList,
} from "../../../api/swaggerGroup";
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
  groupId: "",
};
const detailData = ref<SwaggerRecord>({ ...emptyData });
const rules = {
  name: [{ required: true, message: "请输入文档名称" }],
  path: [{ required: true, message: "请输入文档源" }],
  groupId: [{ required: true, message: "请选择文档分组" }],
};

const emit = defineEmits(["update:modelValue", "success"]);
const visible = computed({
  get: () => props.modelValue,
  set: (v) => emit("update:modelValue", v),
});

const handleOpen = () => {
  if (props.id) {
    getSwaggerDetail(props.id).then((res) => {
      detailData.value = {
        ...res,
      };
    });
  } else {
    detailData.value = {
      ...emptyData,
    };
  }
};

const formRef = ref();
const handleConfirm = async () => {
  await formRef.value.validate();
  if (props.id) {
    await updateSwaggerConfig(detailData.value);
  } else {
    await addSwaggerConfig(detailData.value);
  }
  ElMessage.success("操作成功");
  emit("success");
};
const groups = ref<{ name: string; id: string }[]>([]);

const handleAddGroup = () => {
  ElMessageBox.prompt("请输入分组名称", "创建分组", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
  })
    .then((data) => {
      addSwaggerGroup({ name: data.value }).then(() => {
        getGroupList();
      });
    })
    .catch(() => {});
};
const getGroupList = () => {
  fetchSwaggerGroupList().then((res) => {
    groups.value = res;
  });
};
getGroupList();
</script>
<style lang="less" scoped>
.flex {
  display: flex;
  width: 100%;
  .el-input {
    flex: 1;
  }
  .el-button {
    margin-left: 4px;
  }
}
</style>
