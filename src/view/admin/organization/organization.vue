<!--
  组织机构管理
  组织机构增删改查
  Created by xby on 2019/06/27
  Updated by xby on 2019/07/16
-->

<template>
  <div class="organization-list">
    <Card class="filterCard">
      <!--筛选条件-->
      <Form :label-width="100">
        <Row>
          <i-col span="6" style="min-width:180px;z-index:2">
            <FormItem label="组织编号" :label-width="78">
              <Input size="large" v-model="form.organizeno" placeholder="请输入组织编号" />
            </FormItem>
          </i-col>
          <i-col span="6" style="min-width:180px;z-index:2">
            <FormItem label="组织名称" :label-width="78">
              <Input size="large" v-model="form.organizename" placeholder="请输入组织名称" />
            </FormItem>
          </i-col>
          <i-col>
            <FormItem>
              <Button type="error" size="large" @click="resetForm" style="float: right;">重置</Button>
              <Button
                type="primary"
                size="large"
                @click="requestDeptTreeData"
                style="float: right;margin-right: 20px"
              >查询</Button>
            </FormItem>
          </i-col>
        </Row>
      </Form>
    </Card>
    <Card>
      <div style="margin-bottom: 20px">
        <Button type="primary" size="large" @click="clickAdd" v-if="addBtn()" style="margin-right: 24px">新建</Button>
        <Button type="primary" size="large" @click="toggle">
          <span v-if="toggleFlag">展开</span>
          <span v-else>折叠</span>
        </Button>
      </div>
      <Spin fix v-if="spinShow"></Spin>
      <!--组织树表格一览-->
      <tree-table
        :expand-type="false"
        :selectable="false"
        :is-fold="toggleFlag"
        :columns="deptColumns"
        :data="deptData"
      >
        <template slot="organizestatus" slot-scope="scope">
          <i-switch
            v-if="statusBtn()"
            size="small"
            v-model="scope.row.organizestatus"
            @on-change="changeDeptStatus(scope)"
            :true-value="0"
            :false-value="1"
          ></i-switch>
        </template>
        <template slot="actions" slot-scope="scope">
          <CommonIcon
            type="_iconedit"
            color="#079fff"
            @click.native="clickEdit(scope)"
            v-if="editBtn()&&scope.row.parentid !== '-1'"
            :size="25"
            title="编辑"
            style="margin-right: 10px;cursor:pointer"
          />
          <CommonIcon
            type="_icondelete"
            color="#ff6b4e"
            @click.native="clickDelete(scope)"
            v-if="delBtn()&&scope.row.parentid !== '-1'"
            :size="25"
            title="删除"
            style="margin-right: 10px;cursor:pointer"
          />
        </template>
      </tree-table>
      <!--添加组织机构-->
      <SetModal
        :modalValue="addDeptModal"
        modalTitle="添加组织"
        :modalMask="modalMask"
        :modalLoading="addModalLoading"
        @on-submit-modal="submitNewDept"
        @on-cancel-modal="addDeptModal = false"
      >
        <Form ref="addForm" :model="addFormModel" :rules="addFormRules" :label-width="100">
          <FormItem label="上级组织" prop="parentid">
            <tree-select
              placeholder="请选择"
              :searchable="true"
              :max-height="200"
              :show-count="true"
              :default-expand-level="3"
              :options="deptData"
              v-model="addFormModel.parentid"
            />
          </FormItem>
          <FormItem label="组织编号" prop="organizeno">
            <Input v-model="addFormModel.organizeno" placeholder="请输入组织编号" />
          </FormItem>
          <FormItem label="组织名称" prop="organizename">
            <Input v-model="addFormModel.organizename" placeholder="请输入组织名称" />
          </FormItem>
          <FormItem label="排序号" prop="indexnum">
            <InputNumber v-model="addFormModel.indexnum" placeholder="请输入排序号" ></InputNumber>
          </FormItem>
          <FormItem label="组织描述">
            <Input
              v-model="addFormModel.organizeexplain"
              type="textarea"
              :autosize="{minRows: 4,maxRows: 6}"
              placeholder="请输入组织描述"
            />
          </FormItem>
          <FormItem label="组织状态" prop="organizestatus">
            <i-switch v-model="addFormModel.organizestatus" :true-value="0" :false-value="1"></i-switch>
          </FormItem>
        </Form>
      </SetModal>
      <!--编辑组织机构-->
      <SetModal
        :modalValue="editDeptModal"
        modalTitle="编辑组织"
        :modalMask="modalMask"
        v-model="editFormModel.id"
        :modalLoading="editModalLoading"
        @on-submit-modal="submitEditDept"
        @on-cancel-modal="editDeptModal = false"
      >
        <Form ref="editForm" :model="editFormModel" :rules="editFormRules" :label-width="100">
          <FormItem label="上级组织" prop="parentid">
            <tree-select
              :searchable="true"
              :max-height="200"
              :show-count="true"
              :default-expand-level="3"
              :options="deptData"
              v-model="editFormModel.parentid"
              placeholder="请选择"
            />
          </FormItem>
          <FormItem label="组织编号" prop="organizeno">
            <Input v-model="editFormModel.organizeno" placeholder="请输入组织编号" />
          </FormItem>
          <FormItem label="组织名称" prop="organizename">
            <Input v-model="editFormModel.organizename" placeholder="请输入组织名称" />
          </FormItem>
          <FormItem label="排序号" prop="indexnum">
            <InputNumber v-model="editFormModel.indexnum" placeholder="请输入排序号"></InputNumber>
          </FormItem>
          <FormItem label="组织描述">
            <Input
              v-model="editFormModel.organizeexplain"
              type="textarea"
              :autosize="{minRows: 4,maxRows: 6}"
              placeholder="请输入组织描述"
            />
          </FormItem>
          <FormItem label="组织状态" prop="organizestatus">
            <i-switch v-model="editFormModel.organizestatus" :true-value="0" :false-value="1"></i-switch>
          </FormItem>
        </Form>
      </SetModal>
    </Card>
  </div>
</template>

<script>
import axios from '@/libs/api.request';
import TreeSelect from '@riophae/vue-treeselect';
import '@riophae/vue-treeselect/dist/vue-treeselect.css';
import mixin from '_c/gather/mixin';
import { hasPermission } from '@/libs/util';
// import { hasPermission } from '@/libs/util';
export default {
  name: 'admin-system-organizition',
  mixins: [mixin],
  components: { TreeSelect },

  data () {
    return {
      // 筛选条件
      form: {
        organizeno: null,
        organizename: null
      },
      toggleFlag: false,
      spinShow: false,
      deptColumns: [
        {
          title: '组织名称',
          width: '250px',
          key: 'organizename'
        },
        {
          title: '组织编号',
          width: '100px',
          align: 'center',
          headerAlign: 'center',
          key: 'organizeno'
        },
        {
          title: '排序号',
          width: '200px',
          align: 'center',
          headerAlign: 'center',
          key: 'indexnum'
        },
        {
          title: '组织描述',
          width: '300px',
          align: 'center',
          headerAlign: 'center',
          key: 'organizeexplain'
        },
        {
          title: '状态',
          type: 'template',
          headerAlign: 'center',
          align: 'center',
          width: '100px',
          width: this.statusActions(),
          template: 'organizestatus'
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
      deptData: [],
      // 添加区域变量
      addDeptModal: false,
      addFormModel: {
        parentid: null,
        organizeno: null,
        organizename: null,
        indexnum: 0,
        organizeexplain: null,
        organizestatus: 0
      },
      addFormRules: {
        parentid: [
          { required: true, message: '上级组织不能为空', trigger: 'change' }
        ],
        organizeno: [
          { required: true, message: '组织编号不能为空', trigger: 'blur' }
        ],
        organizename: [
          { required: true, message: '组织名称不能为空', trigger: 'blur' }
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
      editDeptModal: false,
      editFormModel: {
        id: null,
        parentid: null,
        organizeno: null,
        organizename: null,
        indexnum: 0,
        organizeexplain: null,
        organizestatus: 0
      },
      editFormRules: {
        parentid: [
          { required: true, message: '上级组织不能为空', trigger: 'change' }
        ],
        organizeno: [
          { required: true, message: '组织编号不能为空', trigger: 'blur' }
        ],
        organizename: [
          { required: true, message: '组织名称不能为空', trigger: 'blur' }
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
      editModalLoading: false
    };
  },
  computed: {
    modalMask () {
      return this.$store.state.app.modalMask;
    }
  },
  methods: {
    // 新增组织权限
    addBtn () {
      return hasPermission('admin-system-organizition-add');
    },
    // 修改组织权限
    editBtn () {
      return hasPermission('admin-system-organizition-edit');
    },
    // 删除组织权限
    delBtn () {
      return hasPermission('admin-system-organizition-del');
    },
    // 状态组织权限
    statusBtn () {
      return hasPermission('admin-system-organizition-status');
    },
    statusActions () {
      if (hasPermission('admin-system-organizition-status') === false) {
        return '0px';
      }
    },
    operaActions () {
      if (hasPermission('admin-system-organizition-edit') === false) {
        if (hasPermission('admin-system-organizition-del') === false) {
          return '0px';
        } else {
          return '200px';
        }
      } else {
        return '200px';
      }
    },
    // 查询组织机构树
    requestDeptTreeData () {
      this.$data.spinShow = true;
      axios
        .request({
          url: '/core/organize/getOrganizeTree',
          params: {
            organizeno: this.form.organizeno,
            organizename: this.form.organizename
          },
          method: 'post'
        })
        .then(res => {
          this.$data.spinShow = false;
          if (res.data.code === 200) {
            this.recursionTreeData(res.data.data);
            this.deptData = res.data.data;
          } else {
            this.$Modal.error({ title: res.data.message });
          }
        })
        .catch(e => {
          console.log(e);
          this.$data.spinShow = false;
          this.$Notice.error({ title: '请求失败，请重试' });
        });
    },
    // 递归数组，插入新字段
    recursionTreeData (list) {
      for (let i in list) {
        list[i].label = list[i].organizename;
        if (list[i].children && list[i].children.length > 0) {
          this.recursionTreeData(list[i].children);
        } else {
          delete list[i].children;
        }
      }
    },
    // 重置
    resetForm () {
      this.form = {
        deptCode: null,
        deptName: null,
        deptStatus: null
      };
    },
    // 点击切换折叠展开
    toggle () {
      this.toggleFlag = !this.toggleFlag;
    },
    // 点击“添加”
    clickAdd () {
      this.addFormModel = {
        parentid: null,
        organizeno: null,
        organizename: null,
        indexnum: 0,
        organizeexplain: null,
        organizestatus: 0
      };
      this.$refs.addForm.resetFields();
      this.$data.addModalLoading = false;
      this.addDeptModal = true;
    },
    // 点击添加弹出框提交按钮，提交新增数据
    submitNewDept () {
      this.$refs['addForm'].validate(valid => {
        if (valid) {
          this.$data.addModalLoading = true;
          axios
            .request({
              url: 'core/organize/save',
              data: {
                parentid: this.$data.addFormModel.parentid,
                organizeno: this.$data.addFormModel.organizeno,
                organizename: this.$data.addFormModel.organizename,
                indexnum: this.$data.addFormModel.indexnum,
                organizeexplain: this.$data.addFormModel.organizeexplain,
                organizestatus: this.$data.addFormModel.organizestatus,
                delflag: 0
              },
              method: 'post'
            })
            .then(res => {
              if (res.status === 200) {
                this.$data.addDeptModal = false;
                this.$Modal.success({ title: '新增成功' });
                this.requestDeptTreeData();
              } else {
                this.$data.addModalLoading = false;
                this.$Modal.error({ title: '请求失败' });
              }
            })
            .catch(e => {
              console.log(e);
              this.$data.addModalLoading = false;
              this.$Notice.error({ title: '请求失败，请重试' });
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
        parentid: obj.row.parentid,
        organizeno: obj.row.organizeno,
        organizename: obj.row.organizename,
        indexnum: String(obj.row.indexnum),
        organizeexplain: obj.row.organizeexplain,
        organizestatus: obj.row.organizestatus
      };
      this.$data.editModalLoading = false;
      this.editDeptModal = true;
    },
    // 点击编辑弹出框提交按钮，提交修改后的数据
    submitEditDept () {
      this.$refs['editForm'].validate(valid => {
        if (valid) {
          this.$data.editModalLoading = true;
          axios
            .request({
              url: 'core/organize/update',
              data: {
                id: this.$data.editFormModel.id,
                parentid: this.$data.editFormModel.parentid,
                organizeno: this.$data.editFormModel.organizeno,
                organizename: this.$data.editFormModel.organizename,
                indexnum: this.$data.editFormModel.indexnum,
                organizeexplain: this.$data.editFormModel.organizeexplain,
                organizestatus: this.$data.editFormModel.organizestatus
              },
              method: 'put'
            })
            .then(res => {
              if (res.status === 200) {
                this.$data.editDeptModal = false;
                this.$Modal.success({ title: '修改成功' });
                this.requestDeptTreeData();
              } else {
                this.$data.editModalLoading = false;
                this.$Modal.error({ title: '请求失败' });
              }
            })
            .catch(e => {
              console.log(e);
              this.$data.editModalLoading = false;
              this.$Notice.error({ title: '请求失败，请重试' });
            });
        } else {
          this.$Modal.error({ title: '请填写必填项' });
        }
      });
    },
    // 点击“删除”
    clickDelete (obj) {
      this.$Modal.confirm({
        title: '确认要删除该组织吗？',
        loading: true,
        onOk: () => {
          axios
            .request({
              url: 'core/organize/deleteOrganizeById',
              params: {
                id: obj.row.id
              },
              method: 'delete'
            })
            .then(res => {
              if (res.status === 200) {
                this.$Notice.success({ title: '删除成功' });
              } else {
                this.$Notice.error({ title: '删除失败' });
              }
              this.$Modal.remove();
              this.requestDeptTreeData();
            })
            .catch(e => {
              console.log(e);
              this.$Notice.error({ title: '请求失败，请重试' });
            });
        }
      });
    },
    // 点击修改状态
    changeDeptStatus (params) {
      axios
        .request({
          url: 'core/organize/updateOrganizeStatusById',
          params: {
            id: params.row.id,
            status: params.row.organizestatus
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
    this.requestDeptTreeData();
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.requestDeptTreeData();
    });
  }
};
</script>
