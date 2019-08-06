<!--
  角色管理页面
  角色的增删改查
  Created by xby on 2019/06/30
  Updated by xby on 2019/07/22
-->

<template>
  <div class="roleList">
    <Card class="filterCard">
      <!--筛选条件-->
      <Form :label-width="100">
        <Row>
          <i-col span="6" style="min-width:180px;">
            <FormItem label="角色编号" :label-width="78">
              <Input size="large" v-model="form.roleno" placeholder="请输入角色编号" />
            </FormItem>
          </i-col>
          <i-col span="6" style="min-width:180px;">
            <FormItem label="角色名称" :label-width="78">
              <Input size="large" v-model="form.rolename" placeholder="请输入角色名称" />
            </FormItem>
          </i-col>
          <i-col span="6" style="min-width:180px;">
            <FormItem label="角色状态" :label-width="78">
              <Select v-model="form.rolestatus" size="large" v-if="!IEFlag">
                <Option v-for="item in statusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
              <select class="ieSelect" v-model="form.rolestatus" v-if="IEFlag">
                <option v-for="item in statusList" :value="item.value" :key="item.value">{{ item.label }}</option>
              </select>
              <p class="triangle" v-if="IEFlag"></p>
            </FormItem>
          </i-col>
          <i-col span="6">
            <FormItem>
              <Button type="error" size="large" @click="resetForm" style="float: right;">重置</Button>
              <Button type="primary" size="large" @click="clickQuery" style="float: right;margin-right: 20px;">查询</Button>
            </FormItem>
          </i-col>
        </Row>
      </Form>
    </Card>
    <Card>
      <div style="margin-bottom: 20px">
        <Button type="primary" size="large" :loading="clickAddLoading" @click="clickAdd" v-if="addPermission()">新建</Button>
      </div>
      <!--一览表格-->
      <Table :columns="roleListColumns" :data="roleListData" :loading="tableLoading">
        <template slot-scope="{ row }" slot="action">
          <CommonIcon type="_iconedit" color="#079fff" :size="25" @click.native="editTableData(row)" v-if="editPermission()" title="编辑" style="margin-right: 10px;cursor:pointer" />
          <CommonIcon type="_iconassignroles" color="#49C00E" :size="25" @click.native="assignUser(row)" v-if="assignPermission()" title="分配用户" style="margin-right: 10px;cursor:pointer" />
        </template>
      </Table>
      <Page :total="totalFromData" :current="pageNum" @on-change="changePage" :styles="pageStyles" show-total />
      <!--添加角色-->
      <SetModal
        :modalValue="addRoleModal"
        modalTitle="创建"
        :modalMask="modalMask"
        :modalLoading="addModalLoading"
        @on-submit-modal="submitNewRole"
        @on-cancel-modal="addRoleModal = false"
      >
        <Form ref="addForm" :model="addFormModel" :rules="addFormRules" :label-width="100">
          <FormItem label="角色编号" prop="roleCode">
            <Input v-model="addFormModel.roleCode" placeholder="请输入角色编号" />
          </FormItem>
          <FormItem label="角色名称" prop="roleName">
            <Input v-model="addFormModel.roleName" placeholder="请输入角色名称" />
          </FormItem>
          <FormItem label="角色状态" prop="roleStatus">
            <i-switch v-model="addFormModel.roleStatus" :true-value="0" :false-value="1"></i-switch>
          </FormItem>
          <FormItem label="角色描述" prop="description">
            <Input v-model="addFormModel.description" type="textarea" :rows="4" placeholder="请输入角色描述" />
          </FormItem>
          <FormItem label="系统权限" prop="privilege">
            <CheckboxGroup v-model="addFormModel.privilege">
              <Checkbox v-for="item in privilegeList" :label="item.id" :key="item.id">{{ item.powername }}</Checkbox>
            </CheckboxGroup>
          </FormItem>
          <FormItem label="菜单权限" prop="menu">
            <div class="menuTreeArea" :list="addFormModel.menu">
              <Tree ref="addFormTree" :data="addMenuTreeData" show-checkbox multiple></Tree>
            </div>
          </FormItem>
        </Form>
      </SetModal>
      <!--编辑菜单-->
      <SetModal
        :modalValue="editRoleModal"
        modalTitle="编辑"
        :modalMask="modalMask"
        :modalLoading="editModalLoading"
        @on-submit-modal="submitEditRole"
        @on-cancel-modal="editRoleModal = false"
      >
        <Form ref="editForm" :model="editFormModel" :rules="editFormRules" :label-width="100">
          <FormItem label="角色编号" prop="roleCode">
            <Input v-model="editFormModel.roleCode" placeholder="请输入角色编号" />
          </FormItem>
          <FormItem label="角色名称" prop="roleName">
            <Input v-model="editFormModel.roleName" placeholder="请输入角色名称" />
          </FormItem>
          <FormItem label="角色状态" prop="roleStatus">
            <i-switch v-model="editFormModel.roleStatus" :true-value="0" :false-value="1"></i-switch>
          </FormItem>
          <FormItem label="角色描述" prop="description">
            <Input v-model="editFormModel.description" type="textarea" :rows="4" placeholder="请输入角色描述" />
          </FormItem>
          <FormItem label="系统权限" prop="privilege">
            <CheckboxGroup v-model="editFormModel.privilege">
              <Checkbox v-for="item in privilegeList" :label="item.id" :key="item.id">{{ item.powername }}</Checkbox>
            </CheckboxGroup>
          </FormItem>
          <FormItem label="菜单权限" prop="menu">
            <div class="menuTreeArea" :list="editFormModel.menu">
              <Tree ref="editFormTree" :data="editMenuTreeData" show-checkbox multiple></Tree>
            </div>
          </FormItem>
        </Form>
      </SetModal>
    </Card>
  </div>
</template>

<script>
import axios from '@/libs/api.request';
import mixin from '_c/gather/mixin';
import { hasPermission } from '@/libs/util';

export default {
  name: 'admin-system-role',
  mixins: [mixin],
  data () {
    return {
      form: {
        rolename: null,
        roleno: null,
        rolestatus: null
      },
      statusList: [
        {
          label: '所有',
          value: ''
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
      roleListColumns: [
        {
          title: '序号',
          align: 'center',
          type: 'index'
        },
        {
          title: '角色名称',
          align: 'center',
          key: 'rolename'
        },
        {
          title: '角色编号',
          align: 'center',
          key: 'roleno'
        },
        {
          title: '角色描述',
          align: 'center',
          key: 'roleexplain'
        },
        {
          title: '角色状态',
          align: 'center',
          render: (h, params) => {
            return h('i-switch', {
              props: {
                value: params.row.rolestatus,
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
                  params.row.rolestatus = value;
                  this.changeRoleStatus(params, value);
                }
              }
            });
          }
        },
        {
          title: '操作',
          align: 'center',
          slot: 'action'
        }
      ],
      roleListData: [],
      tableLoading: false,
      totalFromData: null,
      pageNum: 1,
      pageSize: 10,
      privilegeList: [],
      menuTreeData: [],
      // 添加区域变量
      clickAddLoading: false,
      addMenuTreeData: [],
      addRoleModal: false,
      addFormModel: {
        roleCode: null,
        roleName: null,
        roleStatus: 0,
        description: null,
        privilege: [],
        menu: []
      },
      addFormRules: {
        roleCode: [
          { required: true, message: '角色编码不能为空', trigger: 'blur' }
        ],
        roleName: [
          { required: true, message: '角色名称不能为空', trigger: 'blur' }
        ],
        roleStatus: [
          { required: true, type: 'number', message: '状态不能为空', trigger: 'change' }
        ],
        privilege: [
          { required: true, type: 'array', message: '系统权限不能为空', trigger: 'change' }
        ]
      },
      addModalLoading: false,
      // 编辑区域变量
      editMenuTreeData: [],
      editRoleGetPowerList: [],
      editRoleModal: false,
      editFormModel: {
        id: null,
        roleCode: null,
        roleName: null,
        roleStatus: 0,
        description: null,
        privilege: [],
        menu: []
      },
      editFormRules: {
        roleCode: [
          { required: true, message: '角色编码不能为空', trigger: 'blur' }
        ],
        roleName: [
          { required: true, message: '角色名称不能为空', trigger: 'blur' }
        ],
        roleStatus: [
          { required: true, type: 'number', message: '状态不能为空', trigger: 'change' }
        ],
        privilege: [
          { required: true, type: 'array', message: '系统权限不能为空', trigger: 'change' }
        ]
      },
      editModalLoading: false
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
    // 点击查询
    clickQuery () {
      this.$data.pageNum = 1;
      this.$data.tableLoading = true;
      this.requestRoleList();
    },
    // 查询角色列表
    requestRoleList () {
      let postDataMap = {
        currPage: this.$data.pageNum,
        pageLength: this.$data.pageSize
      };
      for (let key in this.$data.form) {
        if (this.$data.form[key] !== null && this.$data.form[key] !== '') {
          postDataMap[key] = this.$data.form[key];
        }
      }
      axios.request({
        url: '/core/role/getAll',
        data: postDataMap,
        method: 'post'
      }).then(res => {
        // console.log(res);
        this.$data.tableLoading = false;
        if (res.data.code === 200) {
          this.$data.roleListData = res.data.data.dataList;
          this.$data.totalFromData = res.data.data.totalRecord;
        } else {
          this.$Message.error({ content: res.data.message });
        }
      }).catch(e => {
        console.log(e);
        this.$data.tableLoading = false;
        this.$Message.error({ content: '请求失败，请重试' });
      });
    },
    // 点击重置
    resetForm () {
      this.$data.form = {
        rolename: null,
        roleno: null,
        rolestatus: null
      };
    },
    // 点击下一页
    changePage (page) {
      this.$data.pageNum = page;
      this.$data.tableLoading = true;
      this.requestRoleList();
    },
    // 点击切换角色状态
    changeRoleStatus (params, status) {
      axios.request({
        url: '/core/role/updateStatusById',
        data: {
          id: params.row.id,
          rolestatus: status
        },
        method: 'put'
      }).then(res => {
        // console.log(res);
        if (res.data.code === 200) {
          this.$Message.success({ content: '状态修改成功' });
        } else {
          this.$Message.error({ content: res.data.message });
        }
        this.requestRoleList();
      }).catch(e => {
        console.log(e);
        this.$Message.error({ content: '请求失败，请重试' });
      });
    },
    // 请求系统权限列表
    requestSystemPower () {
      axios.request({
        url: '/core/role/getSystemPower',
        method: 'get'
      }).then(res => {
        if (res.data.code === 200) {
          this.$data.privilegeList = res.data.data;
        } else {
          this.$Message.error({ content: res.data.message });
        }
      }).catch(e => {
        console.log(e);
        this.$Message.error({ content: '请求失败，请重试' });
      });
    },
    // 点击新建请求菜单树
    requestMenuTreeData () {
      return new Promise((resolve, reject) => {
        axios.request({
          url: '/core/role/getResourcePowerTree',
          method: 'get'
        }).then(res => {
          if (res.data.code === 200) {
            this.regenerateData(res.data.data);
            this.$data.menuTreeData = res.data.data;
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
    // 递归，给每一个子节点加title并设置展开
    regenerateData (data) {
      for (let i in data) {
        if (data[i].menuname) {
          data[i].title = data[i].menuname;
          data[i].expand = true;
        }
        if (data[i].children && data[i].children.length > 0) {
          this.regenerateData(data[i].children);
        } else {
          delete data[i].children;
        }
      }
    },
    // 点击添加
    clickAdd () {
      this.$data.clickAddLoading = true;
      this.requestMenuTreeData().then(() => {
        this.$data.clickAddLoading = false;
        this.$data.addModalLoading = false;
        this.$data.addMenuTreeData = this.$data.menuTreeData;
        this.$data.addFormModel = {
          roleCode: null,
          roleName: null,
          roleStatus: 0,
          description: null,
          privilege: [],
          menu: []
        };
        this.$data.addRoleModal = true;
      });
    },
    // 点击添加弹出框提交按钮，提交新增数据
    submitNewRole () {
      this.$refs['addForm'].validate((valid) => {
        if (valid) {
          let SelectedMenuData = this.$refs['addFormTree'].getCheckedAndIndeterminateNodes();
          this.$data.addFormModel.menu = SelectedMenuData.map(item => {
            return item.id;
          });
          if (this.$data.addFormModel.menu.length > 0) {
            this.$data.addModalLoading = true;
            axios.request({
              url: '/core/role/save',
              data: {
                roleno: this.$data.addFormModel.roleCode,
                rolename: this.$data.addFormModel.roleName,
                rolestatus: this.$data.addFormModel.roleStatus,
                roleexplain: this.$data.addFormModel.description,
                systemList: this.$data.addFormModel.privilege,
                resouceList: this.$data.addFormModel.menu
              },
              method: 'post'
            }).then(res => {
              // console.log(res);
              if (res.data.code === 200) {
                this.$data.addRoleModal = false;
                this.$Message.success({ content: '新增成功' });
                this.requestRoleList();
              } else {
                this.$data.addModalLoading = false;
                this.$Message.error({ content: res.data.message });
              }
            }).catch(e => {
              console.log(e);
              this.$data.addModalLoading = false;
              this.$Message.error({ content: '请求失败，请重试' });
            });
          } else {
            this.$Message.error({ content: '请选择菜单权限' });
          }
        }
      });
    },
    // 点击编辑
    editTableData (params) {
      this.$data.tableLoading = true;
      axios.request({
        url: '/core/role/get',
        params: { id: params.id },
        method: 'get'
      }).then(res => {
        this.$data.tableLoading = false;
        this.$data.editModalLoading = false;
        if (res.data.code === 200) {
          this.$data.editRoleGetPowerList = [];
          if (res.data.data.systemList && res.data.data.systemList.length > 0) {
            res.data.data.systemList.forEach(item => {
              if (item.checkFlag) {
                this.$data.editRoleGetPowerList.push(item.id);
              }
            });
          }
          this.regenerateEditData(res.data.data.resouceList);
          this.$data.editMenuTreeData = res.data.data.resouceList;
          this.$data.editFormModel = {
            id: res.data.data.id,
            roleCode: res.data.data.roleno,
            roleName: res.data.data.rolename,
            roleStatus: res.data.data.rolestatus,
            description: res.data.data.roleexplain,
            privilege: this.$data.editRoleGetPowerList
          };
          this.$data.editRoleModal = true;
        } else {
          this.$Message.error({ content: res.data.message });
        }
      }).catch(e => {
        console.log(e);
        this.$data.tableLoading = false;
        this.$Message.error({ content: '请求失败，请重试' });
      });
    },
    // 递归，checkFlag为true的且没有子节点的选中
    regenerateEditData (tree) {
      for (let i in tree) {
        if (tree[i].menuname) {
          tree[i].title = tree[i].menuname;
          tree[i].expand = true;
        }
        if (tree[i].checkFlag && tree[i].children.length === 0) {
          tree[i].checked = true;
        }
        if (tree[i].children && tree[i].children.length > 0) {
          this.regenerateEditData(tree[i].children);
        }
      }
    },
    // 点击编辑弹出框提交按钮，提交修改后的数据
    submitEditRole () {
      this.$refs['editForm'].validate((valid) => {
        if (valid) {
          let SelectedMenuData = this.$refs['editFormTree'].getCheckedAndIndeterminateNodes();
          this.$data.editFormModel.menu = SelectedMenuData.map(item => {
            return item.id;
          });
          if (this.$data.editFormModel.menu.length > 0) {
            this.$data.editModalLoading = true;
            axios.request({
              url: '/core/role/update',
              data: {
                id: this.$data.editFormModel.id,
                roleno: this.$data.editFormModel.roleCode,
                rolename: this.$data.editFormModel.roleName,
                rolestatus: this.$data.editFormModel.roleStatus,
                roleexplain: this.$data.editFormModel.description,
                systemList: this.$data.editFormModel.privilege,
                resouceList: this.$data.editFormModel.menu
              },
              method: 'put'
            }).then(res => {
              // console.log(res);
              if (res.data.code === 200) {
                this.$data.editRoleModal = false;
                this.$Message.success({ content: '修改成功' });
                this.requestRoleList();
              } else {
                this.$data.editModalLoading = false;
                this.$Message.error({ content: res.data.message });
              }
            }).catch(e => {
              console.log(e);
              this.$data.editModalLoading = false;
              this.$Message.error({ content: '请求失败，请重试' });
            });
          } else {
            this.$Message.error({ content: '请选择菜单权限' });
          }
        }
      });
    },
    // 点击修改数据权限
    assignUser (params) {
      this.$router.push({
        name: 'admin-system-role-assign-user',
        query: { id: params.id }
      });
    },
    // 新建权限
    addPermission () {
      return hasPermission('admin-system-role-add');
    },
    // 编辑权限
    editPermission () {
      return hasPermission('admin-system-role-edit');
    },
    // 分配用户权限
    assignPermission () {
      return hasPermission('admin-system-role-assign-user');
    },
    // 修改状态权限
    statusPermission () {
      return hasPermission('admin-system-role-status');
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.requestSystemPower();
      vm.requestRoleList();
    });
  }
};
</script>
