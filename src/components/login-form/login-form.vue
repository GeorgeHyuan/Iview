<template>
  <Form ref="loginForm" :model="form" :rules="rules" @keydown.enter.native="handleSubmit">
    <FormItem prop="loginName">
      <Input v-model="form.loginName" size="large" placeholder="请输入用户名" prefix="ios-person" :autofocus="true" />
    </FormItem>
    <FormItem prop="password" style="margin-bottom: 55px">
      <Input type="password" v-model="form.password" size="large" placeholder="请输入密码" prefix="md-lock" />
    </FormItem>
    <FormItem>
      <Button @click="handleSubmit" :loading="loginLoading" type="primary"  size="large" long>登录</Button>
    </FormItem>
<!--    <p class="login-tip">-->
<!--      <img src="../../assets/images/web/qq.png" alt="qq" />-->
<!--      <img src="../../assets/images/web/vx.png" alt="WeChat" />-->
<!--      <img src="../../assets/images/web/vb.png" alt="Sina Weibo" />-->
<!--    </p>-->
  </Form>
</template>
<script>
export default {
  name: 'LoginForm',
  props: {
    userNameRules: {
      type: Array,
      default: () => {
        return [{ required: true, message: '账号不能为空', trigger: 'blur' }];
      }
    },
    passwordRules: {
      type: Array,
      default: () => {
        return [{ required: true, message: '密码不能为空', trigger: 'blur' }];
      }
    },
    Loading: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      form: {
        loginName: null,
        password: null,
        terminal: 1
      },
      loginLoading: false
    };
  },
  computed: {
    rules () {
      return {
        loginName: this.userNameRules,
        password: this.passwordRules
      };
    }
  },
  methods: {
    handleSubmit () {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.$emit('on-success-valid', {
            loginName: this.form.loginName,
            password: this.form.password,
            terminal: this.form.terminal
          });
        }
      });
    }
  },
  watch: {
    Loading (newValue) {
      this.$data.loginLoading = newValue;
    }
  },
  mounted () {
    this.$data.loginLoading = this.$props.Loading;
  }
};
</script>

<style scoped>
  .login-tip {
    text-align: center;
  }
  .login-tip > img {
    width: 28px;
    margin: 0 20px;
  }
</style>
