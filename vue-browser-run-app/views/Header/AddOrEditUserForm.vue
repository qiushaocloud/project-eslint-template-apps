<template>
  <el-form class="add-user-form-container" :model="form" :rules="rules" ref="loginForm" label-width="80px">
    <!-- 用户ID -->
    <el-form-item label="ID" prop="id" v-if="pluginType !== 'Add'">
      <el-input :model-value="updateUserId" placeholder="请输入ID" :disabled="true" readonly />
    </el-form-item>

    <!-- 用户名 -->
    <el-form-item label="用户名" prop="username">
      <el-input v-model="form.username" placeholder="请输入用户名" :disabled="pluginType !== 'Add'" :readonly="pluginType !== 'Add'" />
    </el-form-item>

    <!-- 密码 -->
    <el-form-item label="密码" prop="password">
      <el-input v-model="form.password" placeholder="请输入密码" show-password type="password" />
    </el-form-item>

    <!-- 昵称 -->
    <el-form-item label="昵称" prop="nickname">
      <el-input v-model="form.nickname" placeholder="昵称" />
    </el-form-item>

    <!-- 年龄 -->
    <el-form-item label="年龄" prop="age">
      <el-input v-model.number="form.age" placeholder="请输入年龄" type="number" />
    </el-form-item>

    <!-- 邮箱 -->
    <el-form-item label="邮箱" prop="email">
      <el-input v-model="form.email" placeholder="请输入邮箱" type="email" />
    </el-form-item>

    <el-form-item>
      <!-- 登录按钮 -->
      <el-button class="add-user-btn" type="primary" @click="onAddUser" v-if="pluginType === 'Add'">添加用户</el-button>
      <el-button class="update-user-btn" type="primary" @click="onUpdateUser" v-if="pluginType !== 'Add'">更新用户</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { mapActions } from 'vuex';
import { showMsgTip, closeElMessageBox } from '@js/element-plus-helper.mjs';
import UserService from '@services/UserService.mjs';

export default {
  name: 'AddOrEditUserForm',
  props: {
    pluginType: {
      type: String,
      default: 'Add'
    },
    updateUserId: Number
  },
  data() {
    return {
      // 表单数据
      form: {
        username: '',
        password: '',
        nickname: '',
        age: 10,
        email: ''
      },
      // 验证规则
      rules: {
        username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        nickname: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
        age: [{ required: true, message: '请输入年龄', trigger: 'blur' }, { type: 'number', message: '年龄必须是数字' }],
        email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }, {type: 'email', message: '请输入正确的电子邮件地址', trigger: ['blur', 'change']}],
      },
    };
  },
  methods: {
    ...mapActions('user', ['addUser', 'updateUser']),
    onAddUser(){
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          console.log('onAddUser 表单验证通过', this.form);
          this.addUser({...this.form});
          showMsgTip(`添加用户(${this.form.username})成功！`, {type:'success'});
          return closeElMessageBox();
        }

        console.log('onAddUser 表单验证失败', this.form);
        return false;
      });
    },
    onUpdateUser() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          console.log('onUpdateUser 表单验证通过', this.form);
          this.updateUser({id: this.updateUserId, ...this.form});
          showMsgTip(`更新用户(${this.form.username})成功！`, {type:'success'});
          return closeElMessageBox();
        }

        console.log('onUpdateUser 表单验证失败', this.form);
        return false;
      });
    }
  },
  mounted() {
    if (this.updateUserId !== undefined) {
      delete this.rules.username;
      const user = UserService.getUser(this.updateUserId);
      if (!user) return;
      this.form = {
        username: user.username,
        password: user.password,
        nickname: user.nickname,
        age: user.age,
        email: user.email
      }
    }
  }
}
</script>

<style scoped>
.add-user-form-container {
  width: 396px;
}
</style>