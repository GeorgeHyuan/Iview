<!--
  用户管理页面
  用户的增删改查
  Created by xby on 2019/06/29
  Updated by xby on 2019/07/19
-->
<style lang="less">
  @import "../../../../src/components/common/common.less";
  @import "./style/user-list";
</style>

<template>
  <div class="user-list">
    <Card class="filterCard">
      <!--筛选条件-->
      <Form :label-width="100">
        <Row>
          <i-col span="5">
            <FormItem label="登录账号" :label-width="78">
              <Input size="large" v-model="form.loginname" placeholder="请输入登录账号" />
            </FormItem>
          </i-col>
          <i-col span="5">
            <FormItem label="用户名称" :label-width="78">
              <Input size="large" v-model="form.username" placeholder="请输入用户名称" />
            </FormItem>
          </i-col>
          <i-col span="5">
            <FormItem label="手机号码" :label-width="78">
              <Input size="large" v-model="form.mobile" placeholder="请输入手机号码" />
            </FormItem>
          </i-col>
          <i-col span="5">
            <FormItem label="用户状态" :label-width="78">
              <Select v-model="form.status" size="large" v-if="!IEFlag">
                <Option v-for="item in userStatusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
              <select class="ieSelect" v-model="form.status" v-if="IEFlag">
                <option v-for="item in userStatusList" :value="item.value" :key="item.value">{{ item.label }}</option>
              </select>
              <p class="triangle" v-if="IEFlag"></p>
            </FormItem>
          </i-col>
          <i-col span="4">
            <FormItem :label-width="0">
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
    <Layout>
      <Sider
        class="userSlide"
        hide-trigger
        v-show="slideWidth"
        :width="220"
        :style="{
        IESiderStyle,
        maxHeight: (clientHeight - 256) + 'px'
        }">
        <Card style="height: 100%;" :bordered="false" dis-hover>
          <p class="deptTreeTitle">组织结构</p>
          <Tree :data="treeData" @on-select-change="getSelectedNodes"></Tree>
        </Card>
      </Sider>
      <Content :style="IEContentStyle" style="box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);">
        <Card style="height: 100%;box-shadow: none" :bordered="false" dis-hover>
          <div style="margin-bottom: 20px" v-if="addPermission()">
            <Button type="primary" size="large" :loading="clickAddLoading" @click="addNewUser">新建</Button>
          </div>
          <Table :columns="userTableColumn" :data="userTableData" :loading="tableLoading">
            <template slot-scope="{ row }" slot="action">
              <CommonIcon type="_iconedit" color="#079fff" :size="25" @click.native="editTableData(row)" title="编辑" v-if="editPermission()" style="margin-right: 10px;cursor:pointer" />
              <CommonIcon type="_iconpassword" color="#49C00E" :size="25" @click.native="clickChangePassword(row)" title="修改密码" v-if="passwordPermission()" style="margin-right: 10px;cursor:pointer" />
              <CommonIcon type="_icondelete" color="#ff6b4e" :size="25" @click.native="deleteTableData(row)" title="删除" v-if="deletePermission()" style="margin-right: 10px;cursor:pointer" />
            </template>
          </Table>
          <Page :total="totalFromData" :current="pageNum" @on-change="changePage" :styles="pageStyles" show-total />
          <!--添加用户-->
          <SetModal
            :modalValue="addUserModal"
            modalTitle="新建"
            :modalMask="modalMask"
            :modalLoading="addModalLoading"
            @on-submit-modal="submitNewUser"
            @on-cancel-modal="addUserModal = false"
          >
            <Form ref="addForm" :model="addFormModel" :rules="addFormRules" :label-width="100">
              <FormItem label="组织机构" prop="organizeId">
                <tree-select
                  :searchable="true"
                  :max-height="200"
                  :show-count="true"
                  :default-expand-level="3"
                  :options="treeData"
                  v-model="addFormModel.organizeId"
                  placeholder="请选择"
                />
              </FormItem>
              <FormItem label="用户姓名" prop="userName">
                <Input v-model="addFormModel.userName" placeholder="请输入用户姓名" />
              </FormItem>
              <FormItem label="登录账号" prop="loginID">
                <Input v-model="addFormModel.loginID" placeholder="由字母和数字组成" />
              </FormItem>
              <FormItem label="登录密码" prop="password">
                <Input v-model="addFormModel.password" type="password" placeholder="由6位以上数字组成" />
              </FormItem>
              <FormItem label="性 别" prop="sex">
                <Select v-model="addFormModel.sex">
                  <Option v-for="item in sexList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
              </FormItem>
              <FormItem label="状 态" prop="userStatus">
                <i-switch v-model="addFormModel.userStatus" :true-value="0" :false-value="1"></i-switch>
              </FormItem>
              <FormItem label="手机号码" prop="phone">
                <Input v-model="addFormModel.phone" placeholder="请输入手机号码" />
              </FormItem>
              <FormItem label="电子邮箱" prop="email">
                <Input v-model="addFormModel.email" placeholder="请输入邮箱" />
              </FormItem>
              <FormItem label="排序号" prop="sort">
                <InputNumber v-model="addFormModel.sort" placeholder="请输入排序号"></InputNumber>
              </FormItem>
              <FormItem label="角 色" prop="role">
                <CheckboxGroup v-model="addFormModel.role">
                  <Checkbox v-for="item in roleList" :label="item.id" :key="item.id">{{ item.rolename }}</Checkbox>
                </CheckboxGroup>
              </FormItem>
            </Form>
          </SetModal>
          <!--编辑用户-->
          <SetModal
            :modalValue="editUserModal"
            modalTitle="编辑"
            :modalMask="modalMask"
            :modalLoading="editModalLoading"
            @on-submit-modal="submitEditUser"
            @on-cancel-modal="editUserModal = false"
          >
            <Form ref="editForm" :model="editFormModel" :rules="editFormRules" :label-width="100">
              <FormItem label="组织机构" prop="organizeId">
                <tree-select
                  :searchable="true"
                  :max-height="200"
                  :show-count="true"
                  :default-expand-level="3"
                  :options="treeData"
                  v-model="editFormModel.organizeId"
                  placeholder="请选择"
                />
              </FormItem>
              <FormItem label="用户姓名" prop="userName">
                <Input v-model="editFormModel.userName" placeholder="请输入用户姓名" />
              </FormItem>
              <FormItem label="登录账号" prop="loginID">
                <Input v-model="editFormModel.loginID" placeholder="由字母和数字组成" disabled />
              </FormItem>
              <FormItem label="性 别" prop="sex">
                <Select v-model="editFormModel.sex">
                  <Option v-for="item in sexList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
              </FormItem>
              <FormItem label="状 态" prop="userStatus">
                <i-switch v-model="editFormModel.userStatus" :true-value="0" :false-value="1"></i-switch>
              </FormItem>
              <FormItem label="手机号码" prop="phone">
                <Input v-model="editFormModel.phone" placeholder="请输入手机号码" />
              </FormItem>
              <FormItem label="电子邮箱" prop="email">
                <Input v-model="editFormModel.email" placeholder="请输入邮箱" />
              </FormItem>
              <FormItem label="排序号" prop="sort">
                <InputNumber v-model="editFormModel.sort" placeholder="请输入排序号"></InputNumber>
              </FormItem>
              <FormItem label="角 色" prop="role">
                <CheckboxGroup v-model="editFormModel.role">
                  <Checkbox v-for="item in roleList" :label="item.id" :key="item.id">{{ item.rolename }}</Checkbox>
                </CheckboxGroup>
              </FormItem>
            </Form>
          </SetModal>
          <!--修改密码-->
          <SetModal
            :modalValue="changePasswordModal"
            modalTitle="修改密码"
            :modalMask="modalMask"
            :modalLoading="passwordModalLoading"
            @on-submit-modal="submitChangePassword"
            @on-cancel-modal="changePasswordModal = false"
          >
            <Form ref="passwordForm" :model="passwordFormModel" :rules="passwordFormRules" :label-width="100">
              <FormItem label="登录账号" prop="loginID">
                <Input v-model="passwordFormModel.loginID" disabled />
              </FormItem>
              <FormItem label="旧密码" prop="oldPassword">
                <Input v-model="passwordFormModel.oldPassword" type="password" />
              </FormItem>
              <FormItem label="新密码" prop="newPassword">
                <Input v-model="passwordFormModel.newPassword" type="password" />
              </FormItem>
              <FormItem label="确认密码" prop="rePassword">
                <Input v-model="passwordFormModel.rePassword" type="password" />
              </FormItem>
            </Form>
          </SetModal>
        </Card>
      </Content>
    </Layout>
  </div>
</template>

<script>
import axios from '@/libs/api.request';
import TreeSelect from '@riophae/vue-treeselect';
import '@riophae/vue-treeselect/dist/vue-treeselect.css';
import mixin from '_c/gather/mixin';
import { hasPermission } from '@/libs/util';

export default {
  name: 'admin-system-user',
  mixins: [mixin],
  components: { TreeSelect },
  data () {
    const loginIdRules = (rule, value, callback) => {
      axios.request({
        url: '/core/user/getExistUserLoginName',
        data: { loginname: value },
        method: 'post'
      }).then(res => {
        if (res.data.code === 200) {
          callback();
        } else if (res.data.code === 20007) {
          callback(new Error('账号已被占用'));
        } else {
          callback(new Error(res.data.message));
        }
      }).catch(e => {
        console.log(e);
        callback(new Error('校验失败，请重试'));
      });
    };
    const valideRePassword = (rule, value, callback) => {
      if (value !== this.passwordFormModel.newPassword) {
        callback(new Error('两次密码输入不一致'));
      } else {
        callback();
      }
    };
    return {
      slideWidth: true,
      treeData: [],
      formTreeData: [],
      form: {
        organizeId: null,
        loginname: null,
        username: null,
        mobile: null,
        status: -1
      },
      userStatusList: [
        {
          label: '所有',
          value: -1
        },
        {
          label: '启用',
          value: 0
        },
        {
          label: '停用',
          value: 1
        }
      ],
      queryLoading: false,
      clickAddLoading: false,
      userTableColumn: [
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
          title: '性别', // 性别
          align: 'center',
          width: 80,
          key: 'sex',
          render: (h, params) => {
            params.row.sexWord = null;
            switch (params.row.sex) {
              case 0: params.row.sexWord = '未知'; break;
              case 1: params.row.sexWord = '男'; break;
              case 2: params.row.sexWord = '女'; break;
            }
            return h('span', params.row.sexWord);
          }
        },
        {
          title: '创建时间', // 创建时间
          align: 'center',
          width: 220,
          key: 'createtime'
        },
        {
          title: '状态', // 状态
          align: 'center',
          width: 100,
          render: (h, params) => {
            return h('i-switch', {
              props: {
                value: params.row.status,
                trueValue: 0,
                falseValue: 1,
                size: 'small'
              },
              style: {
                display: this.statusPermission() ? 'block' : 'none',
                margin: '0 auto'
              },
              on: {
                'on-change': (value) => {
                  params.row.status = value;
                  this.changeUserStatus(params, value);
                }
              }
            });
          }
        },
        {
          title: '操作', // 操作
          align: 'center',
          width: 150,
          slot: 'action'
        }
      ],
      userTableData: [],
      tableLoading: false,
      totalFromData: null,
      pageNum: 1,
      pageSize: 10,
      formTreeOfficeCode: null,
      formTreeOfficeName: null,
      sexList: [
        {
          label: '未知',
          value: 0
        },
        {
          label: '男',
          value: 1
        },
        {
          label: '女',
          value: 2
        }
      ],
      // 添加区域变量
      addUserModal: false,
      addFormModel: {
        organizeId: null,
        userName: null,
        loginID: null,
        password: null,
        sex: 1,
        userStatus: 0,
        phone: null,
        email: null,
        sort: 0,
        role: []
      },
      addFormRules: {
        organizeId: [
          { required: true, message: '组织机构不能为空', trigger: 'change' }
        ],
        userName: [
          { required: true, message: '用户姓名不能为空', trigger: 'blur' }
        ],
        loginID: [
          { required: true, message: '登录账号不能为空', trigger: 'blur' },
          { validator: loginIdRules, trigger: 'blur' }
        ],
        password: [
          { required: true, message: '登录密码不能为空', trigger: 'blur' },
          { type: 'string', min: 6, message: '登录密码不能少于6位', trigger: 'blur' }
        ],
        role: [
          { required: true, type: 'array', message: '角色不能为空', trigger: 'change' }
        ]
      },
      addModalLoading: false,
      // 编辑区域变量
      editUserModal: false,
      editFormModel: {
        id: null,
        organizeId: null,
        userName: null,
        password: '',
        sex: 1,
        userStatus: 0,
        phone: null,
        email: null,
        sort: 0,
        role: []
      },
      editFormRules: {
        organizeId: [
          { required: true, message: '组织机构不能为空', trigger: 'change' }
        ],
        userName: [
          { required: true, message: '用户姓名不能为空', trigger: 'blur' }
        ],
        role: [
          { required: true, type: 'array', message: '角色不能为空', trigger: 'change' }
        ]
      },
      editModalLoading: false,
      roleList: [],
      // 修改密码区域变量
      changePasswordModal: false,
      passwordModalLoading: false,
      passwordFormModel: {
        id: null,
        loginID: null,
        oldPassword: null,
        newPassword: null,
        rePassword: null
      },
      passwordFormRules: {
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
          { validator: valideRePassword, trigger: 'blur' }
        ]
      },
      IESiderStyle: null,
      IEContentStyle: null,
      clientHeight: document.documentElement.clientHeight
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
    // 请求组织树数据
    reFreshTree () {
      axios.request({
        url: '/core/user/getOrganizeTree',
        method: 'post'
      }).then(res => {
        // console.log(res);
        if (res.data.code === 200) {
          this.recursionTreeData(res.data.data);
          this.$data.treeData = res.data.data;
        } else {
          this.$Message.error({ content: res.data.message });
        }
      }).catch(e => {
        console.log(e);
        this.$Message.error({ content: '请求失败，请重试' });
      });
    },
    // 递归数组，插入新字段
    recursionTreeData (list) {
      for (let i in list) {
        list[i].label = list[i].organizename;
        list[i].title = list[i].organizename;
        list[i].expand = true;
        if (list[i].children && list[i].children.length > 0) {
          this.recursionTreeData(list[i].children);
        } else {
          delete list[i].children;
        }
      }
    },
    // 请求角色列表数据
    getRoleList () {
      return new Promise((resolve, reject) => {
        axios.request({
          url: '/core/user/getRoleListByUserId',
          method: 'get'
        }).then(res => {
          // console.log(res);
          if (res.data.code === 200) {
            this.$data.roleList = res.data.data;
          } else {
            this.$Message.error({ content: res.data.message });
          }
          resolve();
        }).catch(e => {
          console.log(e);
          this.$Message.error({ content: '请求失败，请重试' });
          reject(e);
        });
      });
    },
    // 选中组织树节点
    getSelectedNodes (arr) {
      if (arr.length > 0) {
        if (arr[0].parentid !== '-1') {
          this.$data.form.organizeId = arr[0].id;
          this.$data.pageNum = 1;
          this.$data.tableLoading = true;
          this.requestUserInfo();
        }
      }
    },
    // 点击查询
    clickQuery () {
      this.$data.pageNum = 1;
      this.$data.tableLoading = true;
      this.requestUserInfo();
    },
    // 请求查询用户列表信息
    requestUserInfo () {
      let postDataMap = {
        currPage: this.$data.pageNum,
        pageLength: 10
      };
      for (let key in this.$data.form) {
        if (this.$data.form[key] !== null && this.$data.form[key] !== '') {
          postDataMap[key] = this.$data.form[key];
        }
      }
      axios.request({
        url: '/core/user/getAllByPage',
        data: postDataMap,
        method: 'post'
      }).then(res => {
        console.log(res);
        this.$data.queryLoading = false;
        this.$data.tableLoading = false;
        if (res.data.code === 200) {
          this.userTableData = res.data.data.dataList;
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
        organizeId: null,
        loginname: null,
        username: null,
        mobile: null,
        status: -1
      };
    },
    // 点击新增
    addNewUser () {
      this.$data.clickAddLoading = true;
      this.getRoleList().then(() => {
        this.$data.clickAddLoading = false;
        this.$data.addModalLoading = false;
        this.$refs['addForm'].resetFields();
        this.$data.addUserModal = true;
      });
    },
    // 点击添加用户弹出框的提交按钮
    submitNewUser () {
      this.$refs['addForm'].validate((valid) => {
        if (valid) {
          this.$data.addModalLoading = true;
          axios.request({
            url: '/core/user/save',
            data: {
              organizeId: this.$data.addFormModel.organizeId,
              username: this.$data.addFormModel.userName,
              loginname: this.$data.addFormModel.loginID,
              password: this.$data.addFormModel.password,
              sex: this.$data.addFormModel.sex,
              status: this.$data.addFormModel.userStatus,
              mobile: this.$data.addFormModel.phone,
              email: this.$data.addFormModel.email,
              indexnum: this.$data.addFormModel.sort,
              roleIdList: this.$data.addFormModel.role
            },
            method: 'post'
          }).then(res => {
            // console.log(res);
            if (res.data.code === 200) {
              this.$data.addUserModal = false;
              this.$Message.success({ content: '新增成功' });
              this.requestUserInfo();
            } else {
              this.$data.addModalLoading = false;
              this.$Message.error({ content: res.data.message });
            }
          }).catch(e => {
            console.log(e);
            this.$data.addModalLoading = false;
            this.$Message.error({ content: '请求失败，请重试' });
          });
        }
      });
    },
    // 点击下一页
    changePage (page) {
      this.$data.pageNum = page;
      this.$data.tableLoading = true;
      this.requestUserInfo();
    },
    // 点击切换用户状态
    changeUserStatus (params, status) {
      axios.request({
        url: '/core/user/updateStatus',
        params: {
          id: params.row.id,
          status: status
        },
        method: 'put'
      }).then(res => {
        // console.log(res);
        if (res.data.code === 200) {
          this.$Message.success({ content: '状态修改成功' });
        } else {
          this.$Message.error({ content: res.data.message });
        }
        this.requestUserInfo();
      }).catch(e => {
        console.log(e);
        this.$Message.error({ content: '请求失败，请重试' });
      });
    },
    // 点击编辑
    editTableData (params) {
      this.$refs['editForm'].resetFields();
      this.$data.editModalLoading = false;
      this.getRoleList().then(() => {
        axios.request({
          url: '/core/user/getUserInfByUserId',
          params: { id: params.id },
          method: 'get'
        }).then(res => {
          if (res.data.code === 200) {
            this.$data.editFormModel = {
              organizeId: res.data.data.organizeId,
              id: params.id,
              userName: params.username,
              loginID: params.loginname,
              sex: params.sex,
              userStatus: params.status,
              phone: params.mobile,
              email: params.email,
              sort: params.indexnum,
              role: [...res.data.data.roleIdList]
            };
          } else {
            this.$data.editFormModel = {
              organizeId: null,
              id: params.id,
              userName: params.username,
              loginID: params.loginname,
              sex: params.sex,
              userStatus: params.status,
              phone: params.mobile,
              email: params.email,
              sort: params.indexnum,
              role: []
            };
          }
          this.$data.editUserModal = true;
        }).catch(e => {
          console.log(e);
          this.$Message.error({ content: '获取用户信息失败，请重试' });
        });
      });
    },
    // 点击编辑用户弹出框的提交按钮
    submitEditUser () {
      this.$refs['editForm'].validate((valid) => {
        if (valid) {
          this.$data.editModalLoading = true;
          axios.request({
            url: '/core/user/update',
            data: {
              id: this.$data.editFormModel.id,
              organizeId: this.$data.editFormModel.organizeId,
              username: this.$data.editFormModel.userName,
              sex: this.$data.editFormModel.sex,
              status: this.$data.editFormModel.userStatus,
              mobile: this.$data.editFormModel.phone,
              email: this.$data.editFormModel.email,
              indexnum: this.$data.editFormModel.sort,
              roleIdList: this.$data.editFormModel.role
            },
            method: 'put'
          }).then(res => {
            // console.log(res);
            if (res.data.code === 200) {
              this.$data.editUserModal = false;
              this.$Message.success({ content: '修改成功' });
              this.requestUserInfo();
            } else {
              this.$data.editModalLoading = false;
              this.$Message.error({ content: res.data.message });
            }
          }).catch(e => {
            console.log(e);
            this.$data.editModalLoading = false;
            this.$Message.error({ content: '请求失败，请重试' });
          });
        }
      });
    },
    // 点击删除
    deleteTableData (params) {
      this.$Modal.confirm({
        title: '确定删除该条用户数据吗？',
        loading: true,
        onOk: () => {
          axios.request({
            url: '/core/user/delete',
            params: { id: params.id },
            method: 'delete'
          }).then(res => {
            // console.log(res);
            if (res.data.code === 200) {
              this.$Message.success({ content: '删除成功' });
            } else {
              this.$Message.error({ content: res.data.message });
            }
            this.$Modal.remove();
            this.requestUserInfo();
          }).catch(e => {
            console.log(e);
            this.$Message.error({ content: '请求失败，请重试' });
          });
        }
      });
    },
    // 点击修改密码
    clickChangePassword (params) {
      this.$data.passwordFormModel = {
        id: params.id,
        loginID: params.loginname,
        oldPassword: null,
        newPassword: null,
        rePassword: null
      };
      this.$data.passwordModalLoading = false;
      this.$data.changePasswordModal = true;
    },
    // 点击修改密码弹出框提交按钮，提交数据
    submitChangePassword () {
      this.$refs['passwordForm'].validate((valid) => {
        if (valid) {
          this.$data.passwordModalLoading = true;
          axios.request({
            url: '/core/user/updatePassWord',
            data: {
              userId: this.$data.passwordFormModel.id,
              oldPassword: this.$data.passwordFormModel.oldPassword,
              newPassword: this.$data.passwordFormModel.newPassword
            },
            method: 'post'
          }).then(res => {
            if (res.data.code === 200) {
              this.$data.changePasswordModal = false;
              this.$Message.success({ content: '密码修改成功' });
            } else {
              this.$data.passwordModalLoading = false;
              this.$Message.error({ content: res.data.message });
            }
          }).catch(e => {
            console.log(e);
            this.$data.passwordModalLoading = false;
            this.$Message.error({ content: '请求失败，请重试' });
          });
        }
      });
    },
    // 添加权限
    addPermission () {
      return hasPermission('admin-system-user-add');
    },
    // 编辑权限
    editPermission () {
      return hasPermission('admin-system-user-edit');
    },
    // 删除权限
    deletePermission () {
      return hasPermission('admin-system-user-del');
    },
    // 状态修改权限
    statusPermission () {
      return hasPermission('admin-system-user-status');
    },
    // 修改密码权限
    passwordPermission () {
      return hasPermission('admin-system-user-password');
    }
  },
  mounted () {
    const userAgent = navigator.userAgent;
    if (userAgent.indexOf('MSIE 10.0') > -1) {
      this.$data.IEContentStyle = {
        width: document.documentElement.clientWidth - 550 + 'px'
      };
    } else if (userAgent.indexOf('MSIE 9.0') > -1) {
      this.$data.IESiderStyle = {
        float: 'left'
      };
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.reFreshTree();
      vm.clickQuery();
    });
  }
};
</script>
