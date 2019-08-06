<template>
  <div class="user-avatar-dropdown">
<!--    <Dropdown @on-click="handleClick" v-if="theme !== '主题A'">-->
<!--      <Badge :dot="!!messageUnreadCount">-->
<!--        <Avatar :src="userAvatar"/>-->
<!--      </Badge>-->
<!--      <Icon :size="18" type="md-arrow-dropdown"></Icon>-->
<!--      <DropdownMenu slot="list">-->
<!--        <DropdownItem name="message">-->
<!--          消息中心<Badge style="margin-left: 10px" :count="messageUnreadCount"></Badge>-->
<!--        </DropdownItem>-->
<!--        <DropdownItem name="logout">退出登录</DropdownItem>-->
<!--      </DropdownMenu>-->
<!--    </Dropdown>-->
    <ul class="themeAUl">
      <li>
        <Dropdown @on-click="toOtherSubSystem">
          <p>
            <span class="buttonWord" style="float: left;">{{ toggleSubSystemName }}</span>
            <CommonIcon type="ios-arrow-down" style="margin-left: 10px;float: left;line-height: 26px;"/>
          </p>
          <DropdownMenu slot="list">
            <DropdownItem key="all" name="all" style="border-bottom: 1px solid #C8C7CC;">
              <CommonIcon type="md-arrow-round-back" :size="20" style="margin-right: 5px"/>
              <span>返回门户</span>
            </DropdownItem>
            <DropdownItem v-for="item in firstMenuList" :key="item.id" :name="item.id">{{ item.menuname }}</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </li>
      <li>
        <p @click="message">
          <Badge :count="messageUnreadCount">
            <CommonIcon type="_iconnews" :size="IconSize" />
          </Badge>
          <span class="buttonWord">消息</span>
        </p>
      </li>
      <li>
        <Dropdown @on-click="handleClick">
          <p style="border: none;padding-right: 0">
            <CommonIcon type="_iconadmin" v-if="!userAvatar" :size="IconSize" style="float: left;line-height: 26px;" />
            <Avatar v-else :src="userAvatar"/>
            <span class="buttonWord">{{user}}</span>
          </p>
          <DropdownMenu slot="list">
            <DropdownItem name="password">修改密码</DropdownItem>
            <DropdownItem name="logout">退出系统</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </li>
    </ul>
    <!--修改密码-->
    <SetModal
      :modalValue="changeOwnPasswordModal"
      modalTitle="修改密码"
      :modalMask="ownModalMask"
      :modalLoading="ownPasswordModalLoading"
      @on-submit-modal="submitChangeOwnPassword"
      @on-cancel-modal="changeOwnPasswordModal = false"
    >
      <Form ref="ownPasswordForm" :model="ownPasswordFormModel" :rules="ownPasswordFormRules" :label-width="100">
        <FormItem label="登录账号" prop="loginID">
          <Input v-model="ownPasswordFormModel.loginID" disabled />
        </FormItem>
        <FormItem label="旧密码" prop="oldPassword">
          <Input v-model="ownPasswordFormModel.oldPassword" type="password" />
        </FormItem>
        <FormItem label="新密码" prop="newPassword">
          <Input v-model="ownPasswordFormModel.newPassword" type="password" />
        </FormItem>
        <FormItem label="确认密码" prop="rePassword">
          <Input v-model="ownPasswordFormModel.rePassword" type="password" />
        </FormItem>
      </Form>
    </SetModal>
  </div>
</template>

<script>
import './user.less';
import CommonIcon from '_c/common-icon';
import { mapActions } from 'vuex';
import router from '@/router';
import store from '@/store';
import { initRouter } from '@/libs/util';
import SetModal from '_c/set-modal';
import axios from '@/libs/api.request';
export default {
  name: 'User',
  components: { CommonIcon, SetModal },
  data () {
    const valideOwnRePassword = (rule, value, callback) => {
      if (value !== this.ownPasswordFormModel.newPassword) {
        callback(new Error('两次密码输入不一致'));
      } else {
        callback();
      }
    };
    return {
      user: sessionStorage.getItem('userName'),
      IconSize: 22,
      firstMenuList: JSON.parse(sessionStorage.getItem('originalMenu') || '[]'),
      toggleSubSystemName: sessionStorage.getItem('subSystemName'),
      changeOwnPasswordModal: false,
      ownModalMask: false,
      ownPasswordModalLoading: false,
      ownPasswordFormModel: {
        id: null,
        loginID: null,
        oldPassword: null,
        newPassword: null,
        rePassword: null
      },
      ownPasswordFormRules: {
        oldPassword: [
          { required: true, message: '旧密码不能为空', trigger: 'blur' },
          { type: 'string', min: 6, message: '密码不能少于6位', trigger: 'blur' }
        ],
        newPassword: [
          { required: true, message: '新密码不能为空', trigger: 'blur' },
          { type: 'string', min: 6, message: '密码不能少于6位', trigger: 'blur' }
        ],
        rePassword: [
          { required: true, message: '请再次输入新密码', trigger: 'blur' },
          { validator: valideOwnRePassword, trigger: 'blur' }
        ]
      }
    };
  },
  props: {
    theme: String,
    userAvatar: {
      type: String,
      default: ''
    },
    messageUnreadCount: {
      type: Number,
      default: 0
    }
  },
  methods: {
    ...mapActions([
      'handleLogOut'
    ]),
    logout () {
      this.handleLogOut();
    },
    message () {
      this.$router.push({
        name: 'message_page'
      });
    },
    toNavigation () {
      this.$router.push({ name: 'navigation' });
    },
    handleClick (name) {
      switch (name) {
        case 'logout': this.logout();
          break;
        case 'message': this.message();
          break;
        case 'password': this.changePassword();
          break;
      }
    },
    toOtherSubSystem (name) {
      if (name === 'all') {
        this.toNavigation();
      } else if (sessionStorage.getItem('subSystemID') !== name) {
        for (let i in this.$data.firstMenuList) {
          if (this.$data.firstMenuList[i].id === name) {
            sessionStorage.removeItem('tagNaveList');
            sessionStorage.setItem('menu', JSON.stringify(this.$data.firstMenuList[i].children));
            initRouter(router, store);
            sessionStorage.setItem('subSystemID', name);
            sessionStorage.setItem('subSystemName', this.$data.firstMenuList[i].menuname);
            this.$data.toggleSubSystemName = this.$data.firstMenuList[i].menuname;
            this.$router.push({ name: this.$data.firstMenuList[i].children[0].children[0].name });
          }
        }
      }
    },
    // 点击修改密码
    changePassword () {
      this.$data.ownPasswordFormModel = {
        id: sessionStorage.getItem('userId'),
        loginID: sessionStorage.getItem('loginID'),
        oldPassword: null,
        newPassword: null,
        rePassword: null
      };
      this.$data.changeOwnPasswordModal = true;
    },
    // 点击修改密码弹出框提交按钮
    submitChangeOwnPassword () {
      this.$refs['ownPasswordForm'].validate((valid) => {
        if (valid) {
          this.$data.ownPasswordModalLoading = true;
          axios.request({
            url: '/core/user/updatePassWord',
            data: {
              userId: this.$data.ownPasswordFormModel.id,
              oldPassword: this.$data.ownPasswordFormModel.oldPassword,
              newPassword: this.$data.ownPasswordFormModel.newPassword
            },
            method: 'post'
          }).then(res => {
            this.$data.ownPasswordModalLoading = false;
            if (res.data.code === 200) {
              this.$data.changeOwnPasswordModal = false;
              this.$Message.success({ content: '密码修改成功' });
            } else {
              this.$Message.error({ content: res.data.message });
            }
          }).catch(e => {
            console.log(e);
            this.$data.ownPasswordModalLoading = false;
            this.$Message.error({ content: '请求失败，请重试' });
          });
        }
      });
    }
  }
};
</script>
