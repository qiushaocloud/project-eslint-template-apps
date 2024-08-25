<template>
  <el-container class="user-manage-list-container add-vh-100" direction="vertical">
    <Header />
    <auth-el-main class="page-main-container add-important-flex-column">
      <h3>用户管理表格</h3>
      <div class="user-table-container flex-1">
        <el-auto-resizer>
          <template #default="{ height, width }">
            <el-table-v2
              :columns="columns"
              :data="userStore.users"
              :width="width"
              :height="height"
              fixed
            />
          </template>
        </el-auto-resizer>
      </div>
    </auth-el-main>
  </el-container>
</template>

<script setup>
  import { h } from 'vue'
  import Header from '@views/Header/index.vue';
  import { useUserStore } from '@stores/user.mjs';
  import { showMessageBox } from '@helpers/element-plus-helper.mjs';
  import AddOrEditUserForm from '@views/Header/AddOrEditUserForm.vue';

  const userStore = useUserStore();
  const columns = [
    {dataKey: "id", key: "id", title: "ID", width: 100},
    {dataKey: "username", key: "username", title: "Username", width: 250},
    {dataKey: "password", key: "password", title: "Password", width: 250},
    {dataKey: "nickname", key: "nickname", title: "Nickname", width: 250},
    {dataKey: "age", key: "age", title: "Age", width: 60},
    {dataKey: "email", key: "email", title: "Email", width: 300},
    {
      key: "operations",
      title: "Operations",
      width: 150,
      cellRenderer: ({ rowData }) => h('div', [
        h('el-button', { type: 'text', class: 'operation-btn edit-btn' , onClick: () => showEditUserBox(rowData.id) }, '编辑'),
        h('el-button', { type: 'text', class: 'operation-btn del-btn', onClick: () =>  handleDelUser(rowData.id) }, '删除')
      ])
    }
  ];

  const showEditUserBox = (updateUserId) => {
    showMessageBox(() => h(AddOrEditUserForm, {actionType: 'Update', updateUserId, autoCloseMessageBox: true}), {
      class: 'edit-user-box',
      title: '用户编辑框',
      showConfirmButton: false,
      customStyle: {
        width: '100%'
      }
    });
  }

  const handleDelUser = (delUserId) => {
    showMessageBox('是否确定删除用户?').then(() => {
      userStore.delUser(delUserId);
    })
  }
</script>

<style scoped lang="scss">
.user-manage-list-container {
  height: 100vh;
  background-color: #f0f2f5;

  /deep/ .el-table-v2__row {
    .el-table-v2__row-cell {
      &:nth-child(1), &:nth-child(2) {
        font-weight: bold;
      }

      .operation-btn {
        cursor: pointer;
        padding: 4px 8px;
        color: rgb(29, 128, 194);
      }
    }
  }
}
</style>