<template>
  <el-container class="user-manage-list-container add-vh-100" direction="vertical">
    <Header />
    <auth-el-main class="data-container add-important-flex-column">
      <h3>用户管理列表</h3>
      <RecycleScroller
        class="user-list scroller"
        :key="userStore.users.length"
        :items="userStore.users"
        :item-size="50"
        :prerender="10"
        key-field="id"
        v-slot="{ item }"
      >
        <div class="user-item add-flex flex-center" :data-uid="item.id">
          <span class="id">{{ item.id }}</span>
          <span class="username">{{ item.username }}</span>
          <span class="nickname">{{ item.nickname }}</span>
          <span class="password">{{ item.password }}</span>
          <span class="age">{{ item.age }}</span>
          <span class="email">{{ item.email }}</span>
          <span class="operations">
            <el-button type="text" class="operation-btn edit-btn" @click="showEditUserBox(item.id)">编辑</el-button>
            <el-button type="text" class="operation-btn del-btn" @click="handleDelUser(item.id)">删除</el-button>
          </span>
        </div>
      </RecycleScroller>
    </auth-el-main>
  </el-container>
</template>

<script setup>
  import { h } from 'vue'
  import Header from '@views/Header/index.vue';
  import { useUserStore } from '@stores/user.mjs';
  import { RecycleScroller } from 'vue-virtual-scroller';
  import { showMessageBox } from '@helpers/element-plus-helper.mjs';
  import AddOrEditUserForm from '@views/Header/AddOrEditUserForm.vue';

  const userStore = useUserStore();

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

  .user-list {
    .user-item {
      $item-height: 40px;

      height: $item-height;
      margin: 5px 0;

      &>span {
        display: inline-block;
        flex: 3;
        text-align: center;
        height: $item-height;
        line-height: $item-height;
        font-size: 16px;

        &:nth-child(odd) {
          background-color: #bfbcbc;
        }
        &:nth-child(even) {
          background-color: #e6e6e6;
        }

        &.id {
          flex: 1;
        }
        &.id, &.username {
          font-weight: bold;
        }

        &.email {
          color: #007bff;
          text-decoration: underline;
        }
      }
    }
  }
}
</style>