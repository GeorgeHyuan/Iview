<!--
  角色分配用户子页面
  Created by xby on 2019/07/23
-->

<template>
  <div>
    <Card class="filterCard">
      <!--筛选条件-->
      <Form :label-width="100">
        <Row>
          <i-col span="6" style="min-width:180px;">
            <FormItem label="登录账号" :label-width="78">
              <Input size="large" v-model="form.loginname" placeholder="请输入登录账号" />
            </FormItem>
          </i-col>
          <i-col span="6" style="min-width:180px;">
            <FormItem label="用户名称" :label-width="78">
              <Input size="large" v-model="form.username" placeholder="请输入用户名称" />
            </FormItem>
          </i-col>
          <i-col span="6" style="min-width:180px;">
            <FormItem label="手机号码" :label-width="78">
              <Input size="large" v-model="form.mobile" placeholder="请输入手机号码" />
            </FormItem>
          </i-col>
          <i-col span="6">
            <FormItem>
              <Button type="error" size="large" @click="resetForm" style="float: right;">重置</Button>
              <Button
                type="primary"
                size="large"
                @click="clickQuery"
                style="float: right;margin-right: 20px"
              >查询</Button>
            </FormItem>
          </i-col>
        </Row>
      </Form>
    </Card>
    <Card>
      <div style="margin-bottom: 20px">
        <Button type="primary" size="large" @click="addAssignUser" style="margin-right: 20px">添加</Button>
        <Button type="primary" size="large" @click="goBack" style="margin-right: 20px">返回</Button>
        <Button type="error" size="large" @click="deleteAllData">解绑绑定</Button>
      </div>
      <Table :columns="assignUserTableColumn" :data="assignUserTableData" :loading="tableLoading" @on-selection-change="roleUserChangeSelection">
        <template slot-scope="{ row }" slot="action">
          <CommonIcon type="_icondelete" color="#ff6b4e" :size="25" @click.native="deleteTableData(row)" title="删除" style="margin-right: 10px;cursor:pointer" />
        </template>
      </Table>
      <Page :total="totalFromData" :current="pageNum" @on-change="changePage" :styles="pageStyles" show-total />
      <SetModal
        :modalValue="addAssignUserModal"
        modalTitle="添加用户"
        :modalMask="modalMask"
        :modalWidth="1000"
        :modalLoading="assignUserModalLoading"
        @on-submit-modal="submitAssignUser"
        @on-cancel-modal="addAssignUserModal = false"
      >
        <div>
          <Form :label-width="90">
            <Row>
              <i-col span="6">
                <FormItem label="登录账号">
                  <Input v-model="addAssignUserForm.loginname" placeholder="请输入登录账号" />
                </FormItem>
              </i-col>
              <i-col span="6">
                <FormItem label="用户名称">
                  <Input v-model="addAssignUserForm.username" placeholder="请输入用户名称" />
                </FormItem>
              </i-col>
              <i-col span="6">
                <FormItem label="手机号码">
                  <Input v-model="addAssignUserForm.mobile" placeholder="请输入手机号码" />
                </FormItem>
              </i-col>
              <i-col span="6">
                <FormItem :label-width="0">
                  <Button type="error" @click="resetModalQueryForm" style="float: right;">重置</Button>
                  <Button type="primary" @click="clickModalQuery" style="float: right;margin-right: 20px">查询</Button>
                </FormItem>
              </i-col>
            </Row>
          </Form>
          <Card>
            <Table :columns="userListColumns" :data="userListData" :loading="userTableLoading" @on-selection-change="roleModalUserChangeSelection"></Table>
            <div style="margin: 10px;overflow: hidden">
              <div style="float: right;">
                <Page :total="modalTableTotal" :current="modalTablePageNum" @on-change="changeModalTablePage"></Page>
              </div>
            </div>
          </Card>
        </div>
      </SetModal>
    </Card>
  </div>
</template>

<script>
import axios from '@/libs/api.request';
import mixin from '_c/gather/mixin';
import { mapMutations } from 'vuex';
export default {
  name: 'admin-system-role-assign-user',
  mixins: [mixin],
  data () {
    return {
      id: null,
      form: {
        loginname: null,
        username: null,
        mobile: null,
        status: 0
      },
      queryLoading: false,
      assignUserTableColumn: [
        {
          type: 'selection',
          width: 80,
          align: 'center'
        },
        {
          title: '序号',
          type: 'index',
          align: 'center',
          width: 80
        },
        {
          title: '登录账号', // 登录账号
          align: 'center',
          key: 'loginname'
        },
        {
          title: '用户名称', // 用户名称
          align: 'center',
          key: 'username'
        },
        {
          title: '手机号码', // 手机号码
          align: 'center',
          key: 'mobile'
        },
        {
          title: '创建时间', // 创建时间
          align: 'center',
          key: 'createtime'
        },
        {
          title: '操作', // 操作
          align: 'center',
          slot: 'action'
        }
      ],
      assignUserTableData: [],
      tableLoading: false,
      totalFromData: null,
      pageNum: 1,
      pageSize: 10,
      needUnbindArray: [],
      // 添加分配用户区域变量
      addAssignUserModal: false,
      assignUserModalLoading: false,
      addAssignUserForm: {
        loginname: null,
        username: null,
        mobile: null
      },
      userListColumns: [
        {
          type: 'selection',
          width: 80,
          align: 'center'
        },
        {
          title: '登录账号', // 登录账号
          align: 'center',
          key: 'loginname'
        },
        {
          title: '用户名称', // 用户名称
          align: 'center',
          key: 'username'
        },
        {
          title: '手机号码', // 手机号码
          align: 'center',
          key: 'mobile'
        },
        {
          title: '创建时间', // 创建时间
          align: 'center',
          key: 'createtime'
        }
      ],
      userListData: [],
      modalTableTotal: null,
      modalTablePageNum: 1,
      userTableLoading: false,
      modalNeedToBindArray: []
    };
  },
  computed: {
    modalMask () {
      return this.$store.state.app.modalMask;
    },
    pageStyles () {
      return this.$store.state.app.pageStyles;
    },
    IEFlag () {
      return this.$store.state.app.IEFlag;
    }
  },
  methods: {
    ...mapMutations([
      'closeTag'
    ]),
    // 点击查询
    clickQuery () {
      this.$data.pageNum = 1;
      this.$data.tableLoading = true;
      this.requestUserInfo();
    },
    // 请求查询已分配的用户列表信息
    requestUserInfo () {
      let postDataMap = {
        roleId: this.$data.id,
        organizeId: sessionStorage.getItem('organizeId'),
        currPage: this.$data.pageNum,
        pageLength: this.$data.pageSize
      };
      for (let key in this.$data.form) {
        if (this.$data.form[key] !== null && this.$data.form[key] !== '') {
          postDataMap[key] = this.$data.form[key];
        }
      }
      axios.request({
        url: '/core/role/getPageUserByRoleId',
        data: postDataMap,
        method: 'post'
      }).then(res => {
        console.log(res);
        this.$data.queryLoading = false;
        this.$data.tableLoading = false;
        if (res.data.code === 200) {
          this.assignUserTableData = res.data.data.dataList;
          this.totalFromData = res.data.data.totalRecord;
        } else {
          this.$Message.error({ content: res.data.message });
        }
      }).catch(e => {
        console.log(e);
        this.$data.queryLoading = false;
        this.$data.tableLoading = false;
        this.$Message.error({ content: '请求失败，请重试' });
      });
    },
    // 点击重置
    resetForm () {
      this.$data.form = {
        loginname: null,
        username: null,
        mobile: null,
        status: 0
      };
    },
    // 点击下一页
    changePage (page) {
      this.$data.pageNum = page;
      this.$data.tableLoading = true;
      this.requestUserInfo();
    },
    // 点击返回
    goBack () {
      this.closeTag(this.$route);
      this.$router.push({ name: 'admin-system-role' });
    },
    // 点击单个删除按钮
    deleteTableData (params) {
      this.$Modal.confirm({
        title: '确定要解绑该用户吗？',
        loading: true,
        onOk: () => this.requestDeleteUserRole([params.id])
      });
    },
    // 点击删除全部
    deleteAllData () {
      if (this.$data.needUnbindArray && this.$data.needUnbindArray.length > 0) {
        this.$Modal.confirm({
          title: '确定要解绑用户吗？',
          loading: true,
          onOk: () => this.requestDeleteUserRole(this.$data.needUnbindArray)
        });
      }
    },
    // 触发勾选，选中的值发生变化
    roleUserChangeSelection (selection) {
      this.$data.needUnbindArray = selection.map(item => {
        return item.id;
      });
    },
    // 请求解除绑定用户与角色
    requestDeleteUserRole (array) {
      axios.request({
        url: '/core/role/deleteUserLimitRole',
        data: {
          roleId: this.$data.id,
          userIdList: array
        },
        method: 'delete'
      }).then(res => {
        // console.log(res);
        if (res.data.code === 200) {
          this.$Message.success({ content: '解除成功' });
        } else {
          this.$Message.error({ content: res.data.message });
        }
        this.$Modal.remove();
        this.requestUserInfo();
        this.$data.needUnbindArray = [];
      }).catch(e => {
        console.log(e);
        this.$Message.error({ content: '请求失败，请重试' });
      });
    },
    // 点击新增
    addAssignUser () {
      this.$data.assignUserModalLoading = false;
      this.$data.addAssignUserModal = true;
      this.$data.modalNeedToBindArray = [];
      this.clickModalQuery();
    },
    // 点击弹出框中的重置
    resetModalQueryForm () {
      this.$data.addAssignUserForm = {
        loginname: null,
        username: null,
        mobile: null
      };
    },
    // 点击弹出框中的查询
    clickModalQuery () {
      this.$data.modalTablePageNum = 1;
      this.requestUserWithoutThisRole();
    },
    // 请求未绑定该角色的用户数据
    requestUserWithoutThisRole () {
      this.$data.userTableLoading = true;
      let modalPostData = {
        roleId: this.$data.id,
        organizeId: sessionStorage.getItem('organizeId'),
        currPage: this.$data.modalTablePageNum,
        pageLength: this.$data.pageSize
      };
      for (let key in this.$data.addAssignUserForm) {
        if (this.$data.addAssignUserForm[key] !== null && this.$data.addAssignUserForm[key] !== '') {
          modalPostData[key] = this.$data.addAssignUserForm[key];
        }
      }
      axios.request({
        url: '/core/role/getPageNoLimitUserByRoleId',
        data: modalPostData,
        method: 'post'
      }).then(res => {
        console.log(res);
        this.$data.userTableLoading = false;
        if (res.data.code === 200) {
          this.$data.userListData = res.data.data.dataList;
          this.$data.modalTableTotal = res.data.data.totalRecord;
        } else {
          this.$Message.error({ content: res.data.message });
        }
      }).catch(e => {
        console.log(e);
        this.$data.userTableLoading = false;
        this.$Message.error({ content: '请求失败，请重试' });
      });
    },
    // 点击弹出框中的分页器
    changeModalTablePage (page) {
      this.$data.modalTablePageNum = page;
      this.requestUserWithoutThisRole();
    },
    roleModalUserChangeSelection (selection) {
      this.$data.modalNeedToBindArray = selection.map(item => {
        return item.id;
      });
    },
    // 点击添加分配用户弹出框提交按钮，提交数据
    submitAssignUser () {
      if (this.$data.modalNeedToBindArray && this.$data.modalNeedToBindArray.length > 0) {
        this.$data.assignUserModalLoading = true;
        axios.request({
          url: '/core/role/saveUserLimitRole',
          data: {
            roleId: this.$data.id,
            userIdList: this.$data.modalNeedToBindArray
          },
          method: 'post'
        }).then(res => {
          console.log(res);
          if (res.data.code === 200) {
            this.$Message.success({ content: '添加成功' });
            this.$data.addAssignUserModal = false;
            this.clickQuery();
          } else {
            this.$Message.error({ content: res.data.message });
            this.$data.assignUserModalLoading = false;
          }
        }).catch(e => {
          console.log(e);
          this.$data.assignUserModalLoading = false;
          this.$Message.error({ content: '请求失败，请重试' });
        });
      } else {
        this.$Modal.error({ title: '您没有选择任何用户,不能提交' });
      }
    },
    mountedMethods () {
      this.$data.id = this.$route.query.id;
      this.clickQuery();
    }
  },
  mounted () {
    this.mountedMethods();
  },
  watch: {
    '$route.query.id' () {
      this.mountedMethods();
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      if (vm.$data.id !== vm.$route.query.id) {
        vm.mountedMethods();
      }
    });
  }
};
</script>
