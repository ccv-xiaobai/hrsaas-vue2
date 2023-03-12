<template>
  <el-card class="page-tools">
    <!-- 卡片 -->
    <el-row type="flex" justify="space-between" align="middle">
      <el-col>
        <div v-if="showBefore" class="before">
          <!-- 这里要放置一个图标 因为所有的用组件的地方都有图标-->
          <!-- 队首-插槽 -->
          <i class="el-icon-info" />
          <slot name="before" />
        </div>

      </el-col>
      <el-col>
        <el-row type="flex" justify="end">
          <!-- 队尾-插槽 -->
          <slot name="after" />
        </el-row>
      </el-col>

    </el-row>
  </el-card>
</template>

<script>
export default {
  props: {
    showBefore: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss">
 .page-tools {
    margin: 10px 0;
    .before {
      line-height: 34px;
    i {
      margin-right: 5px;
      color: #409eff;
    }
    display: inline-block;
    padding: 0px 10px;
    border-radius: 3px;
    border: 1px solid rgba(145, 213, 255, 1);
    background: rgba(230, 247, 255, 1);
  }
 }
</style>
