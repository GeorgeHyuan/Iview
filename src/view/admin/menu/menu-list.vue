<!--
  菜单管理页面
  菜单的增删改查功能
  Created by xby on 2019/06/28
-->
<style lang="less">
/*@import "";*/
</style>

<template>
  <div class="menuList">
    <Card class="filterCard">
      <!--筛选条件-->
      <Form :label-width="100">
        <Row>
          <i-col span="6" style="min-width:180px;z-index:2">
            <FormItem label="菜单编号" :label-width="78">
              <Input size="large" v-model="form.menuCode" placeholder="请输入菜单编号" />
            </FormItem>
          </i-col>
          <i-col span="6" style="min-width:180px;z-index:2">
            <FormItem label="菜单名称" :label-width="78">
              <Input size="large" v-model="form.menuname" placeholder="请输入菜单名称" />
            </FormItem>
          </i-col>
          <i-col span="12">
            <FormItem>
              <Button type="error" size="large" @click="resetForm" style="float: right;">重置</Button>
              <Button
                type="primary"
                size="large"
                @click="requestMenuTreeData"
                style="float: right;margin-right: 20px"
              >查询</Button>
            </FormItem>
          </i-col>
        </Row>
      </Form>
    </Card>
    <Card>
      <div style="margin-bottom: 20px">
        <Button
          type="primary"
          size="large"
          @click="clickAdd"
          style="margin-right: 24px"
          v-if="newBtn()"
        >新建</Button>
        <Button type="primary" size="large" @click="toggle">
          <span v-if="toggleFlag">展开</span>
          <span v-else>折叠</span>
        </Button>
      </div>
      <Spin fix v-if="spinShow"></Spin>
      <!--菜单树表格一览-->
      <tree-table
        :expand-type="false"
        :selectable="false"
        :is-fold="toggleFlag"
        :columns="MenuColumns"
        :data="MenuDataFilter"
      >
        <template slot="menutype" slot-scope="scope">
          <img
            src="../../../assets/images/menuTypeMenu.png"
            alt
            v-if="scope.row.menutype === 0"
            style="display: block;margin: auto"
          />
          <img src="../../../assets/images/menuTypeBtn.png" alt v-else style="display: block;margin: auto" />
        </template>
        <template slot="menustatus" slot-scope="scope">
          <i-switch
            size="small"
            v-model="scope.row.menustatus"
            @on-change="changemenustatus(scope)"
            v-if="statusBtn() && scope.row.routername !== 'sysmenu'"
            :true-value="0"
            :false-value="1"
          ></i-switch>
        </template>
        <template slot="actions" slot-scope="scope">
          <CommonIcon
            type="_iconedit"
            color="#079fff"
            @click.native="clickEdit(scope)"
            v-if="editBtn()&& scope.row.routername !== 'sysmenu'"
            :size="25"
            title="编辑"
            style="margin-right: 10px;cursor:pointer"
          />
          <CommonIcon
            type="_icondelete"
            color="#ff6b4e"
            @click.native="clickDelete(scope)"
            v-if="delBtn()&& scope.row.routername !== 'sysmenu'"
            :size="25"
            title="删除"
            style="margin-right: 10px;cursor:pointer"
          />
        </template>
      </tree-table>
    </Card>
    <!--添加菜单-->
    <SetModal
      :modalValue="addMenuModal"
      modalTitle="添加菜单"
      :modalMask="modalMask"
      :modalLoading="addModalLoading"
      @on-submit-modal="submitNewMenu"
      @on-cancel-modal="addMenuModal = false"
    >
      <Form ref="addForm" :model="addFormModel" :rules="addFormRules" :label-width="100">
        <FormItem label="上级菜单" prop="parentCode">
          <tree-select
            placeholder="请选择"
            :searchable="true"
            :max-height="200"
            :show-count="true"
            :default-expand-level="3"
            :options="MenuDataFilter"
            v-model="addFormModel.parentCode"
          />
        </FormItem>
        <FormItem label="菜单类型" prop="menutype">
          <RadioGroup v-model="addFormModel.menutype">
            <Radio label="0">菜单</Radio>
            <Radio label="1">按钮</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="菜单编号" prop="menuno">
          <Input v-model="addFormModel.menuno" />
        </FormItem>
        <FormItem label="菜单名称" prop="menuname">
          <Input v-model="addFormModel.menuname" />
        </FormItem>
        <FormItem label="路由名称" prop="routername">
          <Input v-model="addFormModel.routername" />
        </FormItem>
        <FormItem label="请求链接" prop="menupath">
          <Input v-model="addFormModel.menupath" />
        </FormItem>
        <FormItem label="菜单图标" prop="menuicon">
          <Input v-model="addFormModel.menuicon" />
        </FormItem>
        <FormItem label="第三方URL" prop="thirdurl">
          <Input v-model="addFormModel.thirdurl" />
        </FormItem>
        <FormItem label="文件地址" prop="target">
          <Input v-model="addFormModel.target" />
        </FormItem>
        <FormItem label="排序号" prop="indexnum">
          <InputNumber v-model="addFormModel.indexnum" ></InputNumber>
        </FormItem>
        <FormItem label="菜单状态" prop="menustatus">
          <RadioGroup v-model="addFormModel.menustatus">
            <Radio label="0">启用</Radio>
            <Radio label="1">停用</Radio>
          </RadioGroup>
        </FormItem>
      </Form>
    </SetModal>
    <!--编辑菜单-->
    <SetModal
      :modalValue="editMenuModal"
      modalTitle="编辑菜单"
      :modalMask="modalMask"
      :modalLoading="editModalLoading"
      v-model="editFormModel.id"
      @on-submit-modal="submitEditMenu"
      @on-cancel-modal="editMenuModal = false"
    >
      <Form ref="editForm" :model="editFormModel" :rules="editFormRules" :label-width="100">
        <FormItem label="上级菜单" prop="parentCode">
          <tree-select
            :searchable="true"
            :max-height="200"
            :show-count="true"
            :default-expand-level="3"
            :options="MenuDataFilter"
            v-model="editFormModel.parentCode"
          />
        </FormItem>
        <FormItem label="菜单类型" prop="menutype">
          <RadioGroup v-model="editFormModel.menutype">
            <Radio label="0">菜单</Radio>
            <Radio label="1">按钮</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="菜单编号" prop="menuno">
          <Input v-model="editFormModel.menuno" />
        </FormItem>
        <FormItem label="菜单名称" prop="menuname">
          <Input v-model="editFormModel.menuname" />
        </FormItem>
        <FormItem label="路由名称" prop="routername">
          <Input v-model="editFormModel.routername" />
        </FormItem>
        <FormItem label="请求连接" prop="menupath">
          <Input v-model="editFormModel.menupath" />
        </FormItem>
        <FormItem label="菜单图标" prop="menuicon">
          <Input v-model="editFormModel.menuicon" />
        </FormItem>
        <FormItem label="第三方URL" prop="thirdurl">
          <Input v-model="editFormModel.thirdurl" />
        </FormItem>
        <FormItem label="文件地址" prop="target">
          <Input v-model="editFormModel.target" />
        </FormItem>
        <FormItem label="排序号" prop="indexnum">
          <InputNumber v-model="editFormModel.indexnum" ></InputNumber>
        </FormItem>
        <FormItem label="菜单状态" prop="menustatus">
          <RadioGroup v-model="editFormModel.menustatus">
            <Radio label="0">启用</Radio>
            <Radio label="1">停用</Radio>
          </RadioGroup>
        </FormItem>
      </Form>
    </SetModal>
  </div>
</template>

<script>
import axios from '@/libs/api.request';
import TreeSelect from '@riophae/vue-treeselect';
import '@riophae/vue-treeselect/dist/vue-treeselect.css';
import mixin from '_c/gather/mixin';
import { hasPermission } from '@/libs/util';
export default {
  name: 'menu-list',
  mixins: [mixin],
  components: { TreeSelect },
  data () {
    return {
      // 筛选条件
      form: {
        menuCode: null,
        menuname: null
      },
      toggleFlag: false,

      MenuColumns: [
        {
          title: '菜单名称',
          width: '200px',
          key: 'menuname'
        },
        {
          title: '菜单编号',
          width: '120px',
          align: 'center',
          headerAlign: 'center',
          key: 'menuno'
        },
        {
          title: '请求链接',
          key: 'menupath',
          align: 'center',
          headerAlign: 'center',
          width: '140px'
        },
        {
          title: '菜单类型',
          key: 'menutype',
          align: 'center',
          headerAlign: 'center',
          width: '100px',
          type: 'template',
          template: 'menutype'
        },
        {
          title: '路由名',
          key: 'routername',
          align: 'center',
          headerAlign: 'center',
          width: '140px'
        },
        {
          title: '状态',
          type: 'template',
          align: 'center',
          headerAlign: 'center',
          width: this.operaMenustatus(),
          template: 'menustatus',
          width: '60px'
        },
        {
          title: '文件地址',
          key: 'target',
          align: 'center',
          headerAlign: 'center',
          width: '200px'
        },
        {
          title: '操作',
          type: 'template',
          align: 'center',
          headerAlign: 'center',
          template: 'actions',
          width: this.operaActions()
        }
      ],

      MenuData: [],
      MenuDataFilter: [],
      // 添加区域变量
      addMenuModal: false,
      addFormModel: {
        parentCode: null,
        menuname: null,
        menutype: null,
        menuno: null,
        indexnum: 0,
        menuicon: null,
        menupath: null,
        routername: null,
        target: null,
        menustatus: '0',
        thirdurl: null
      },
      addFormRules: {
        parentCode: [
          { required: true, message: '上级菜单不能为空', trigger: 'change' }
        ],
        menuno: [
          { required: true, message: '菜单编号不能为空', trigger: 'blur' }
        ],
        menuname: [
          { required: true, message: '菜单名称不能为空', trigger: 'blur' }
        ],
        menutype: [
          { required: true, message: '菜单类型不能为空', trigger: 'blur' }
        ],
        menupath: [
          { required: true, message: '请菜单URL不能为空', trigger: 'blur' }
        ],
        routername: [
          { required: true, message: '路由名称不能为空', trigger: 'blur' }
        ],
        target: [
          { required: true, message: '文件地址不能为空', trigger: 'blur' }
        ],
        indexnum: [
          {
            type: 'number',
            message: '排序号必须为数字',
            trigger: 'blur',
            transform (value) {
              return Number(value);
            }
          }
        ]
      },
      addModalLoading: false,
      // 编辑区域变量
      editMenuModal: false,
      editFormModel: {
        id: null,
        thirdurl: null,
        menuno: null,
        menuCode: null,
        parentCode: null,
        indexnum: 0,
        menuname: null,
        menutype: null,
        menuicon: null,
        menupath: null,
        routername: null,
        target: null,
        isShow: '1',
        menustatus: '0'
      },
      editFormRules: {
        parentCode: [
          { required: true, message: '上级菜单不能为空', trigger: 'change' }
        ],
        menuname: [
          { required: true, message: '菜单名称不能为空', trigger: 'blur' }
        ],
        menutype: [
          { required: true, message: '菜单类型不能为空', trigger: 'change' }
        ],
        menupath: [
          { required: true, message: '请菜单URL不能为空', trigger: 'blur' }
        ],
        routername: [
          { required: true, message: '路由名称不能为空', trigger: 'blur' }
        ],
        target: [
          { required: true, message: '文件地址不能为空', trigger: 'blur' }
        ],
        menustatus: [
          { required: true, message: '状态不能为空', trigger: 'change' }
        ],
        indexnum: [
          {
            type: 'number',
            message: '排序号必须为数字',
            trigger: 'blur',
            transform (value) {
              return Number(value);
            }
          }
        ]
      },
      editModalLoading: false,
      // 删除弹出变量
      deleteMenuModal: false,
      deleteModalLoading: false,
      deleteId: null,
      spinShow: false
    };
  },
  computed: {
    modalMask () {
      return this.$store.state.app.modalMask;
    },
    IEFlag () {
      return this.$store.state.app.IEFlag;
    }
  },
  methods: {
    // 新增权限
    newBtn () {
      return hasPermission('admin-system-menu-add');
    },
    // 修改权限
    editBtn () {
      return hasPermission('admin-system-menu-edit');
    },
    // 删除权限
    delBtn () {
      return hasPermission('admin-system-menu-del');
    },
    // 状态权限
    statusBtn () {
      return hasPermission('admin-system-menu-status');
    },
    operaActions () {
      if (hasPermission('admin-system-menu-edit') === false) {
        if (hasPermission('admin-system-menu-del') === false) {
          return '0px';
        } else {
          return '120px';
        }
      } else {
        return '120px';
      }
    },
    operaMenustatus () {
      if (hasPermission('admin-system-menu-status')) {
        return '120px';
      } else {
        return '0px';
      }
    },
    // 查询组织机构树
    requestMenuTreeData () {
      this.toggleFlag = false;
      this.spinShow = true;
      axios
        .request({
          url: 'core/menu/getMenuTree',
          data: {
            menuname: this.form.menuname,
            menuno: this.form.menuCode,
            menustatus: -1
          },
          method: 'post'
        })
        .then(res => {
          if (res.data.code === 200) {
            this.spinShow = false;
            this.MenuData = res.data.data;
            let newMenuData = JSON.parse(JSON.stringify(res.data.data));
            this.regenerateData(newMenuData);
            this.MenuDataFilter = newMenuData;
          } else {
            this.$Message.error({
              content: res.data.message
            });
          }
        })
        .catch(e => {
          console.log(e);
          this.queryLoading = false;
          this.$Message.error({
            content: '请求失败，请重试'
          });
        });
    },
    // 递归，给每一个子节点加title并设置展开
    regenerateData (data) {
      for (let i in data) {
        if (data[i].menutype === 1) {
          data[i].isDisabled = true;
        }
        if (data[i].menuname) {
          data[i].label = data[i].menuname;
        }
        if (data[i].children && data[i].children.length > 0) {
          this.regenerateData(data[i].children);
        } else {
          delete data[i].children;
        }
      }
    },
    // 重置
    resetForm () {
      this.form = {
        menuCode: null,
        menuname: null,
        menustatus: null
      };
      this.requestMenuTreeData();
    },
    // 点击切换折叠展开
    toggle () {
      this.toggleFlag = !this.toggleFlag;
    },
    // 点击“添加”
    clickAdd () {
      this.$refs.addForm.resetFields();
      this.$data.addModalLoading = false;
      this.addMenuModal = true;
    },
    // 点击添加弹出框提交按钮，提交新增数据
    submitNewMenu () {
      this.$refs['addForm'].validate(valid => {
        if (valid) {
          this.$data.addModalLoading = true;
          axios
            .request({
              url: 'core/menu/save',
              data: {
                parentid: this.$data.addFormModel.parentCode,
                menutype: this.$data.addFormModel.menutype,
                thirdurl: this.$data.addFormModel.thirdurl,
                menuno: this.$data.addFormModel.menuno,
                menuname: this.$data.addFormModel.menuname,
                routername: this.$data.addFormModel.routername,
                menupath: this.$data.addFormModel.menupath,
                menuicon: this.$data.addFormModel.menuicon,
                target: this.$data.addFormModel.target,
                indexnum: this.$data.addFormModel.indexnum,
                menustatus: this.$data.addFormModel.menustatus
              },
              method: 'post'
            })
            .then(res => {
              if (res.status === 200) {
                this.$data.addMenuModal = false;
                this.$Message.success({
                  content: '新增成功'
                });
                this.requestMenuTreeData();
              } else {
                this.$data.addModalLoading = false;
                this.$Message.error({
                  content: '请填写必填项'
                });
              }
            })
            .catch(e => {
              console.log(e);
              this.$data.addModalLoading = false;
              this.$Message.error({
                content: '请求失败，请重试'
              });
            });
        } else {
          this.$Modal.error({ title: '请填写必填项' });
        }
      });
    },
    // 点击“编辑”
    clickEdit (obj) {
      this.editFormModel = {
        id: obj.row.id,
        menuno: obj.row.menuno,
        parentCode: obj.row.parentid,
        menuname: obj.row.menuname,
        indexnum: obj.row.indexnum,
        thirdurl: obj.row.thirdurl,
        menutype: String(obj.row.menutype),
        menuicon: obj.row.menuicon,
        menupath: obj.row.menupath,
        routername: obj.row.routername,
        target: obj.row.target,
        menustatus: String(obj.row.menustatus)
      };
      this.$data.editModalLoading = false;
      this.editMenuModal = true;
    },
    // 点击编辑弹出框提交按钮，提交修改后的数据
    submitEditMenu () {
      this.$refs['editForm'].validate(valid => {
        if (valid) {
          this.$data.editModalLoading = true;
          axios
            .request({
              url: 'core/menu/update',
              data: {
                thirdurl: this.$data.editFormModel.thirdurl,
                id: this.$data.editFormModel.id,
                parentid: this.$data.editFormModel.parentCode,
                menutype: this.$data.editFormModel.menutype,
                menuno: this.$data.editFormModel.menuno,
                menuname: this.$data.editFormModel.menuname,
                routername: this.$data.editFormModel.routername,
                menupath: this.$data.editFormModel.menupath,
                menuicon: this.$data.editFormModel.menuicon,
                target: this.$data.editFormModel.target,
                indexnum: this.$data.editFormModel.indexnum,
                menustatus: this.$data.editFormModel.menustatus
              },
              method: 'put'
            })
            .then(res => {
              if (res.status === 200) {
                this.$data.editMenuModal = false;
                this.$Message.success({
                  content: '修改成功'
                });
                this.requestMenuTreeData();
              } else {
                this.$data.editModalLoading = false;
                this.$Message.error({
                  content: '请求失败'
                });
              }
            })
            .catch(e => {
              console.log(e);
              this.$data.editModalLoading = false;
              this.$Message.error({
                content: '请求失败，请重试'
              });
            });
        } else {
          this.$Message.error({
            content: '请填写必填项'
          });
        }
      });
    },
    clickDelete (obj) {
      this.$Modal.confirm({
        title: '确定删除此条菜单信息吗？',
        onOk: () => {
          if (obj.row.id !== '') {
            axios
              .request({
                url: 'core/menu/deleteMenuById',
                params: {
                  id: obj.row.id
                },
                method: 'delete'
              })
              .then(res => {
                if (res.status === 200) {
                  this.$data.deleteMenuModal = false;
                  this.$data.deleteModalLoading = false;
                  this.requestMenuTreeData();
                  this.$Message.success({
                    content: '删除成功'
                  });
                } else {
                  this.$Message.error({
                    content: '删除失败'
                  });
                }
              })
              .catch(e => {
                console.log(e);
                this.$data.deleteModalLoading = false;
                this.$Message.error({
                  content: '请求失败，请重试'
                });
              });
          }
        }
      });
    },
    // 点击删除弹出框的确认按钮，触发删除数据请求
    submitDeleteMenu () {},
    // 点击切换菜单状态
    changemenustatus (obj) {
      axios
        .request({
          url: 'core/menu/updateMenuStatusById',
          params: {
            id: obj.row.id,
            menustatus: obj.row.menustatus
          },
          method: 'put'
        })
        .then(res => {
          this.$Message.success({
            content: '切换成功'
          });
        })
        .catch(e => {
          console.log(e);
          this.$Message.error({
            content: '切换失败'
          });
        });
    }
  },
  created () {
    this.requestMenuTreeData();
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.requestMenuTreeData();
    });
  }
};
</script>
