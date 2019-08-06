<!--
  角色设置数据权限子页面
  Created by xby on 2019/06/30
-->

<template>
  <Card class="roleDataPermission">
    <p slot="title">
      <Icon type="md-open" />
      数据权限
    </p>
    <Form ref="dataForm" :model="dataFormModel" :rules="dataFormRules" :label-width="100">
      <Row>
        <i-col span="8" offset="2">
          <!--角色名称-->
          <FormItem label="角色名称" prop="role_name">
            <Input v-model="dataFormModel.role_name" readonly />
          </FormItem>
        </i-col>
        <i-col span="8" offset="2">
          <!--角色编码-->
          <FormItem label="角色编码" prop="role_code">
            <Input v-model="dataFormModel.role_code" readonly />
          </FormItem>
        </i-col>
      </Row>
      <Row>
        <i-col span="10" offset="2">
          <Tree ref="menuTree" :data="menuTreeData" show-checkbox multiple @on-check-change="getCheckedNodes" style="margin: 20px auto"></Tree>
        </i-col>
      </Row>
      <Row>
        <i-col span="10" offset="2">
          <FormItem>
            <!--保存  关闭-->
            <Button type="primary" icon="md-checkmark" :loading="submitLoading" @click="handleSubmit">保存</Button>
            <Button type="default" icon="ios-undo" @click="handleShut" style="margin-left: 8px">关闭</Button>
          </FormItem>
        </i-col>
      </Row>
    </Form>
  </Card>
</template>

<script>
import axios from '@/libs/api.request';
import { mapMutations } from 'vuex';
export default {
  name: 'role-data-permission',
  data () {
    return {
      dataFormModel: {
        role_name: null,
        role_code: null
      },
      dataFormRules: {
        role_name: [
          { required: true, message: '角色名称不能为空', trigger: 'blur' }
        ], // 角色名称不能为空
        role_code: [
          { required: true, message: '角色编码不能为空', trigger: 'blur' }
        ] // 角色编码不能为空
      },
      menuTreeData: [],
      treeSelectData: [],
      menuCodesList: [],
      originalMenuCodes: [],
      submitLoading: false,
      fullMenuList: []
    };
  },
  methods: {
    ...mapMutations([
      'closeTag'
    ]),
    // 点击选择菜单树节点
    getCheckedNodes (data) {
      this.$data.treeSelectData = data;
    },
    // 点击提交
    handleSubmit () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.submitRoleMenuPermission();
        }
      });
    },
    submitRoleMenuPermission () {
      this.$data.submitLoading = true;
      if (this.$data.treeSelectData.length > 0) {
        this.$data.menuCodesList = [];
        for (let i in this.$data.treeSelectData) {
          this.$data.menuCodesList.push({ menuCode: this.$data.treeSelectData[i].menuCode });
        }
        // 去除重复节点，将半选节点插入到notExistNodeIds中
        this.deduplicationAndInsertion(this.$data.treeSelectData);
      }
      console.log(this.$data.menuCodesList);
      axios.request({
        url: 'updateRoleMenu',
        data: {
          roleCode: this.$route.params.codeData,
          roleMenus: this.$data.menuCodesList
        },
        method: 'put'
      }).then(res => {
        console.log(res);
        this.$data.submitLoading = false;
        if (res.status === 200) {
          this.$Modal.success({
            title: '数据权限授予成功',
            onOk: () => {
              this.closeTag(this.$route);
            }
          });
        }
      }).catch((e) => {
        console.log(e);
        this.$data.submitLoading = false;
        this.$Notice.error({ title: '请求失败，请重试' }); // 啊噢，出错了，请重试
      });
    },
    // 点击关闭
    handleShut () {
      this.closeTag(this.$route);
      this.$router.push({ name: 'role-list' });
    },
    // 递归，给每一个子节点加title并设置展开
    regenerateData (data) {
      for (let i in data) {
        if (data[i].menuName) {
          data[i].expand = true;
          data[i].title = data[i].menuName;
        }
        if (data[i].children && data[i].children.length > 0) {
          this.regenerateData(data[i].children);
        }
      }
    },
    mountedMethods () {
      console.log(this.$route);
      this.$data.dataFormModel.role_code = this.$route.query.codeData;
      this.$data.dataFormModel.role_name = this.$route.query.codeName;
      this.getMenuTreeData();
    },
    // 查询菜单树数据
    getMenuTreeData () {
      axios.request({
        url: 'getMenuTree',
        method: 'get'
      }).then(res => {
        // console.log(res);
        if (res.status === 200) {
          this.regenerateData(res.data);
          this.$data.fullMenuList = res.data;
          this.$nextTick(() => {
            this.getRoleMenu();
          });
        } else {
          this.$Modal.warning({ content: res.data.status_msg });
        }
      }).catch((e) => {
        console.log(e);
        this.$Notice.error({ title: '请求失败，请重试' }); // 啊噢，出错了，请重试
      });
    },
    // 查询该角色获取到的菜单数据
    getRoleMenu () {
      axios.request({
        url: 'getRoleMenu',
        params: { roleCode: this.$route.params.codeData },
        method: 'get'
      }).then(res => {
        // console.log(res);
        if (res.status === 200) {
          this.$data.originalMenuCodes = res.data;
          this.$data.originalMenuCodes.filter(o => {
            this.$data.menuCodesList.push({ menuCode: o });
          });
          // 去除重复节点，将半选节点插入到 notExistNodeIds 中
          this.deduplicationAndInsertion(this.$data.originalMenuCodes);
          // 遍历最底层的节点，与 originalMenuCodes 中的 menu_code 比较，相同的设置勾选
          this.regenerateCheckTreeData(this.$data.fullMenuList);
        }
        this.$data.menuTreeData = this.$data.fullMenuList;
      }).catch((e) => {
        console.log(e);
        this.$Notice.error({ title: '请求失败，请重试' }); // 啊噢，出错了，请重试
      });
    },
    // 去除重复节点，将半选节点插入到 notExistNodeIds 中
    deduplicationAndInsertion (list) {
      let notExistNodeIds = [];
      for (let i in list) {
        // 去除重复节点，将半选节点插入到 notExistNodeIds 中
        list[i].treeCodes.split(',').forEach((v, i) => {
          if (v === '0' || v === '' || notExistNodeIds.indexOf(v) !== -1) {
            return true;
          }
          notExistNodeIds.push(v);
          this.$data.menuCodesList.filter(item => {
            if (item.menuCode === v) {
              notExistNodeIds.splice(notExistNodeIds.length - 1, 1);
            }
          });
        });
      }
      // 将 notExistNodeIds 中的数据以 {menuCode: 12345679890}的形式插入到 menuCodesList 中
      for (let i in notExistNodeIds) {
        this.$data.menuCodesList.push({ menuCode: notExistNodeIds[i] });
      }
    },
    // 遍历最底层的节点，与 originalMenuCodes 中的 menuCode 比较，相同的设置勾选
    regenerateCheckTreeData (menuList) {
      for (let i in menuList) {
        this.$data.originalMenuCodes.filter(o => {
          if (o.menuCode === menuList[i].menuCode && (!menuList[i].children || menuList[i].children.length === 0)) {
            menuList[i].checked = true;
          }
        });
        if (menuList[i].children && menuList[i].children.length > 0) {
          this.regenerateCheckTreeData(menuList[i].children);
        }
      }
    }
  },
  mounted () {
    this.mountedMethods();
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      if (vm.$data.dataFormModel.role_code !== vm.$route.query.codeData) {
        vm.mountedMethods();
      }
    });
  }
};
</script>
