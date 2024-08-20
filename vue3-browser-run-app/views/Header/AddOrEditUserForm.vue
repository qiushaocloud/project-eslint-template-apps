<template>
  <el-form class="add-user-form-container" :model="form" :rules="rules" ref="loginForm" label-width="80px" @keydown.enter="handleEnterSubmit">
    <!-- 用户ID -->
    <el-form-item label="ID" prop="id" v-if="actionType === 'Update'">
      <el-input :model-value="updateUserId" placeholder="请输入ID" :disabled="true" readonly />
    </el-form-item>

    <!-- 用户名 -->
    <el-form-item label="用户名" prop="username">
      <el-input v-model="form.username" placeholder="请输入用户名" :disabled="actionType === 'Update'" :readonly="actionType === 'Update'" />
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
      <el-button class="add-user-btn" type="primary" @click="onAddUser" v-if="actionType === 'Add'">添加用户</el-button>
      <el-button class="register-user-btn" type="primary" @click="onAddUser" v-if="actionType === 'Register'">注册用户</el-button>
      <el-button class="update-user-btn" type="primary" @click="onUpdateUser" v-if="actionType === 'Update'">更新用户</el-button>
      <slot></slot>
    </el-form-item>
  </el-form>
</template>

<script>
import { mapActions } from 'vuex';
import { showMsgTip, closeElMessageBox } from '@helpers/element-plus-helper.mjs';
import UserService from '@services/UserService.mjs';

export default {
  name: 'AddOrEditUserForm',
  props: {
    actionType: {
      type: String,
      default: 'Add' // Add or Update or Register
    },
    autoCloseMessageBox: Boolean,
    updateUserId: Number,
    autoFocus: {
      type: Boolean,
      default: true
    },
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
          console.log('onAddUser 表单验证通过', this.form, this.actionType);
          const user = UserService.getUser(this.form.username);
          if (user) {
            showMsgTip(`用户名(${this.form.username})已存在, ${this.actionType === 'Register' ? '注册' : '添加'}失败！`, {type: 'error'});
            this.$emit('onAddUserFail', this.form.username);
            return false;
          }
          this.addUser({...this.form});
          showMsgTip(`${this.actionType === 'Register' ? '注册' : '添加'}用户(${this.form.username})成功！`, {type:'success'});
          this.autoCloseMessageBox && closeElMessageBox();
          this.$emit('onAddUserSuccess', this.form.username);
          return true;
        }

        console.log('onAddUser 表单验证失败', this.form, this.actionType);
        return false;
      });
    },
    onUpdateUser() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          console.log('onUpdateUser 表单验证通过', this.form);
          const updatePayload = {id: this.updateUserId, ...this.form};
          delete updatePayload.username;
          const user = UserService.getUser(this.updateUserId);
          if (!user) {
            showMsgTip(`用户(${this.updateUserId})不存在, 更新失败！`, {type: 'error'});
            this.$emit('onUpdateUserFail', this.updateUserId);
            return false;
          }
          this.updateUser(updatePayload);
          showMsgTip(`更新用户(${this.form.username})成功！`, {type:'success'});
          this.autoCloseMessageBox && closeElMessageBox();
          this.$emit('onUpdateUserSuccess', this.updateUserId);
          return true;
        }

        console.log('onUpdateUser 表单验证失败', this.form);
        return false;
      });
    },
    handleEnterSubmit(event) {
      event.stopPropagation();
      event.preventDefault();
      // 只有必填项都填写后，回车才起效
      let isAllRequiredFilled = true;
      outerLoop: for (let key in this.form) {
        const val = this.form[key];
        if (this.rules[key]) {
          for (const r of this.rules[key]) {
            if (r.required && (val === undefined || val === null || val === '')) {
              isAllRequiredFilled = false;
              break outerLoop;
            }
          }
        }
      }
      if (!isAllRequiredFilled) return false;
      if (this.actionType === 'Update') return this.onUpdateUser();
      return this.onAddUser();
    }
  },
  mounted() {
    if (this.updateUserId !== undefined) {
      delete this.rules.username;
      const user = UserService.getUser(this.updateUserId);
      if (user) {
        this.form = {
          username: user.username,
          password: user.password,
          nickname: user.nickname,
          age: user.age,
          email: user.email
        }
      }
    }

    if (this.autoFocus) {
      setTimeout(() => {
        // 自动焦点到可输入的输入框，即：不是 disabled 和 onlyread 的输入框
        const firstInputField = this.$el && this.$el.querySelector('input:not([disabled]):not([readonly])');
        firstInputField && firstInputField.focus();
      }, 0);
    }
  }
}
</script>

<style scoped>
.add-user-form-container {
  width: 396px;
}
</style>