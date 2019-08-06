<style lang="less">
// @import "./diary-handle.less";
</style>

<template>
  <!-- 筛选条件 -->
  <div class="menuList">
    <Card class="filterCard">
      <Form :label-width="100">
        <Row>
          <i-col span="6" style="min-width:180px;z-index:2">
            <FormItem label="权限编号" :label-width="78">
              <Input size="large" v-model="form.powerno" placeholder="请输入权限编号" />
            </FormItem>
          </i-col>
          <i-col span="6" style="min-width:180px;z-index:2">
            <FormItem label="权限名称" :label-width="78">
              <Input size="large" v-model="form.powername" placeholder="请输入权限名称" />
            </FormItem>
          </i-col>
          <i-col span="6" style="min-width:180px;z-index:2">
            <FormItem label="权限状态" :label-width="78">
              <Select size="large" v-model="form.powerstatus" placeholder="请选择类型" v-if="!IEFlag">
                <Option
                  v-for="item in operationTypestatus"
                  :key="item.value"
                  :value="item.value"
                >{{item.label}}</Option>
              </Select>
              <select
                class="ieSelect"
                v-model="form.operatortype"
                placeholder="请选择类型"
                v-if="IEFlag"
              >
                <option
                  v-for="item in operationTypestatus"
                  :key="item.value"
                  :value="item.value"
                >{{item.label}}</option>
              </select>
              <p class="triangle" v-if="IEFlag"></p>
            </FormItem>
          </i-col>
          <i-col style="min-width:180px;">
            <FormItem style=" text-align: center;">
              <Button type="error" size="large" style="float: right;" @click="resetClick">重置</Button>
              <Button
                type="primary"
                size="large"
                @click="logQuery"
                style="float: right;margin-right: 20px"
              >查询</Button>
            </FormItem>
          </i-col>
        </Row>
      </Form>
    </Card>
    <Card>
      <div style="margin-bottom: 20px">
        <Button type="primary" size="large" style="margin-right: 24px" v-if="addBtn()" @click="newPermission()">新建</Button>
      </div>
      <Spin fix v-if="spinShow"></Spin>
      <Table :columns="columns1" :data="dataList">
        <template slot-scope="scope" slot="powerstatus">
            <i-switch
              size="small"
              v-if="allotBtn()"
              v-model="scope.row.powerstatus"
              :true-value="0"
              :false-value="1"
              @on-change="changeStatus(scope)"
            ></i-switch>
        </template>
        <template slot-scope="scope" slot="operations">

            <CommonIcon
              type="_iconedit"
              color="#079fff"
              :size="25"
              title="编辑"
              v-if="editBtn()"
              @click.native="editRouter(scope)"
              style="margin-right: 10px;cursor:pointer"
            />
            <CommonIcon
              type="_iconassignroles"
              color="#49C00E"
              :size="25"
              title="详情"
              v-if="allotBtn()"
              @click.native="allotDetails(scope)"
              style="margin-right: 10px;cursor:pointer"
            />
            <CommonIcon
              type="_icondelete"
              color="#ff6b4e"
              :size="25"
              title="删除"
              v-if="delBtn()"
              @click.native="deleteRouter(scope)"
              style="margin-right: 10px;cursor:pointer"
            />
        </template>
      </Table>
      <Page :total="total" show-total @on-change="change" :styles="styles" />
    </Card>
    <SetModal
      :modalValue="addPermissionModal"
      modalTitle="新建"
      :modalMask="modalMask"
      :modalLoading="addModalLoading"
      @on-submit-modal="addModalConfirm"
      @on-cancel-modal="addPermissionModal = false"
    >
      <Form ref="addForm" :model="addFormModel" :rules="addFormRules" :label-width="100">
        <FormItem label="权限编号" prop="powerno">
          <Input v-model="addFormModel.powerno" />
        </FormItem>
        <FormItem label="权限名称" prop="powername">
          <Input v-model="addFormModel.powername" />
        </FormItem>
        <FormItem label="权限描述">
          <Input
            type="textarea"
            :autosize="{minRows: 5,maxRows: 8}"
            v-model="addFormModel.powerexplain"
          />
        </FormItem>
        <FormItem label="权限状态">
          <i-switch v-model="addFormModel.powerstatus" :true-value="0" :false-value="1"></i-switch>
        </FormItem>
      </Form>
    </SetModal>
    <!-- 编辑 -->
    <SetModal
      :modalValue="editPermissionModal"
      modalTitle="编辑"
      :modalMask="modalMask"
      :modalLoading="addModalLoading"
      @on-submit-modal="editModalConfirm"
      @on-cancel-modal="editPermissionModal = false"
    >
      <Form ref="editForm" :model="editFormModel" :rules="editFormRules" :label-width="100">
        <FormItem label="权限编号" prop="powerno">
          <Input v-model="editFormModel.powerno" />
        </FormItem>
        <FormItem label="权限名称" prop="powername">
          <Input v-model="editFormModel.powername" />
        </FormItem>
        <FormItem label="权限描述">
          <Input
            type="textarea"
            :autosize="{minRows: 5,maxRows: 8}"
            v-model="editFormModel.powerexplain"
          />
        </FormItem>
        <FormItem label="权限状态">
          <i-switch v-model="editFormModel.powerstatus" :true-value="0" :false-value="1"></i-switch>
        </FormItem>
      </Form>
    </SetModal>
  </div>
</template>
<script>
import axios from '@/libs/api.request';
import mixin from '_c/gather/mixin';
import { hasPermission } from '@/libs/util';
export default {
  name: 'diary-handle',
  mixins: [mixin],
  components: {},
  data () {
    return {
      nihao: '你好',
      styles: {
        'text-align': 'center',
        'margin-top': ' 20px'
      },
      editPermissionModal: false,
      addModalLoading: false,
      addPermissionModal: false,
      dataValue: '',
      spinShow: false,
      total: 0,
      obj: [],
      form: {
        powerno: null,
        powername: null,
        powerstatus: null
      },
      addFormModel: {
        powerno: null,
        powername: null,
        powerexplain: null,
        powertype: 0,
        powerstatus: 0
      },
      editFormModel: {
        id: null,
        powerno: null,
        powername: null,
        powerexplain: null,
        powertype: 0,
        powerstatus: 0
      },
      addFormRules: {
        powerno: [
          { required: true, message: '权限编号不能为空', trigger: 'blur' }
        ],
        powername: [
          { required: true, message: '权限名称不能为空', trigger: 'blur' }
        ]
      },
      editFormRules: {
        powerno: [
          { required: true, message: '权限编号不能为空', trigger: 'blur' }
        ],
        powername: [
          { required: true, message: '权限名称不能为空', trigger: 'blur' }
        ]
      },

      operationTypestatus: [
        {
          label: '全部',
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
      columns1: [
        {
          title: '序号',
          type: 'index',
          align: 'center',
          width: 70
        },
        {
          title: '权限名称',
          align: 'center',
          key: 'powername'
        },
        {
          title: '权限编号',
          align: 'center',
          key: 'powerno'
        },
        {
          title: '权限描述',
          align: 'center',
          key: 'powerexplain'
        },
        {
          title: '权限状态',
          align: 'center',
          slot: 'powerstatus'
        },
        {
          title: '操作',
          align: 'center',
          slot: 'operations'
        }
      ],
      dataList: []
    };
  },
  created () {
    this.operlogGetAll();
    this.operaActions();
    this.statusActions();
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
    addBtn () {
      return hasPermission('admin-system-permission-add');
    },
    // 修改权限
    editBtn () {
      return hasPermission('admin-system-permission-edit');
    },
    // 删除权限
    delBtn () {
      return hasPermission('admin-system-permission-del');
    },
    // 详情权限
    allotBtn () {
      return hasPermission('admin-system-permission-allot');
    },
    // 修改权限
    statusBtn () {
      return hasPermission('admin-system-permission-status');
    },
    statusActions () {
      if (hasPermission('admin-system-permission-status') === false) {
        this.columns1.splice(4, 1);
      }
    },
    operaActions () {
      if (hasPermission('admin-system-permission-edit') === false && hasPermission('admin-system-permission-del') === false && hasPermission('admin-system-permission-allot') === false) {
        this.columns1.pop();
      }
    },
    allotDetails (obj) {
      this.$router.push({
        name: 'admin-system-permission-allot',
        query: { id: obj.row.id }
      });
    },
    // 加载数据
    operlogGetAll (arr) {
      this.spinShow = true;
      axios
        .request({
          url: 'core/power/getAll',
          data: {
            ...arr
          },
          method: 'post'
        })
        .then(res => {
          this.spinShow = false;
          if (res.data.code === 200) {
            this.dataList = res.data.data.dataList;
            this.total = res.data.data.totalRecord;
          } else {
            this.$Message.error({
              content: res.data.message
            });
          }
        })
        .catch(e => {
          console.log(e);
          this.$Message.error({
            content: '请求失败，请重试'
          });
        });
    },
    // 分页
    change (Page) {
      this.form.currPage = Page;
      this.operlogGetAll(this.form);
    },
    // 查询
    logQuery () {
      this.operlogGetAll(this.form);
    },
    // 重置
    resetClick () {
      this.form = {
        powerno: null,
        powername: null,
        powerstatus: ''
      };
      this.total = 1;
      this.operlogGetAll(this.form);
    },
    // 删除
    deleteRouter (obj) {
      this.$Modal.confirm({
        title: '确定删除此条权限吗？',
        onOk: () => {
          if (obj.row.id !== '') {
            axios
              .request({
                url: 'core/power/delete',
                params: {
                  id: obj.row.id
                },
                method: 'delete'
              })
              .then(res => {
                if (res.data.code === 200) {
                  this.operlogGetAll();
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
                this.$Message.error({
                  content: '请求失败，请重试'
                });
              });
          }
        }
      });
    },
    // 新增
    newPermission () {
      this.$data.addModalLoading = false;
      this.$refs.addForm.resetFields();
      this.addPermissionModal = true;
    },
    addModalConfirm () {
      this.$refs['addForm'].validate(valid => {
        if (valid) {
          this.$data.addModalLoading = true;
          axios
            .request({
              url: 'core/power/save',
              data: this.addFormModel,
              method: 'post'
            })
            .then(res => {
              if (res.data.code === 200) {
                this.operlogGetAll();
                this.$Message.success({
                  content: '新增成功'
                });
                this.addPermissionModal = false;
              } else {
                this.$data.addModalLoading = false;
                this.$Message.success({
                  content: '新增失败'
                });
              }
            })
            .catch(e => {
              this.$Message.error({
                content: '请求失败'
              });
            });
        } else {
          this.$Modal.error({ title: '请填写必填项' });
        }
      });
    },
    // 编辑
    editRouter (obj) {
      this.editPermissionModal = true;
      this.editFormModel = {
        id: obj.row.id,
        powerno: obj.row.powerno,
        powername: obj.row.powername,
        powerexplain: obj.row.powerexplain,
        powerstatus: obj.row.powerstatus,
        powertype: 0
      };
    },
    editModalConfirm () {
      this.$refs['editForm'].validate(valid => {
        if (valid) {
          this.$data.addModalLoading = true;
          axios
            .request({
              url: 'core/power/update',
              data: this.editFormModel,
              method: 'put'
            })
            .then(res => {
              this.editPermissionModal = false;
              this.$data.addModalLoading = false;
              this.operlogGetAll();
              this.$Message.success({
                content: '修改成功'
              });
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
    // 切换状态
    changeStatus (obj) {
      axios
        .request({
          url: 'core/power/updateStatusById',
          params: {
            id: obj.row.id,
            powerstatus: obj.row.powerstatus
          },
          method: 'put'
        })
        .then(res => {
          if (res.data.code === 200) {
            this.$Message.success({
              content: '切换成功'
            });
          } else {
            this.$Message.success({
              content: '切换失败'
            });
          }
        })
        .catch(e => {
          this.$Message.success({
            content: '请求失败，请重试'
          });
        });
    }
  }
};
</script>

<style lang="less">
</style>
