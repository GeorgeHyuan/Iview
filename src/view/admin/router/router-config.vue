<template>
  <!-- 筛选条件 -->
  <div class="menuList">
    <Card class="filterCard">
      <Form :label-width="100">
        <Row>
          <i-col span="6" style="min-width:180px;z-index:2">
            <FormItem label="路由名称" :label-width="78">
              <Input size="large" v-model="form.routename" placeholder="请输入路由名称" />
            </FormItem>
          </i-col>

          <i-col span="6" style="min-width:180px;z-index:2">
            <FormItem label="是否启用" :label-width="78">
              <Select size="large" v-model="form.status" placeholder="请选择状态" v-if="!IEFlag">
                <Option
                  v-for="item in domestatusList"
                  :value="item.value"
                  :key="item.value"
                >{{item.label}}</Option>
              </Select>
              <select class="ieSelect" v-model="form.status" placeholder="请选择状态" v-if="IEFlag">
                <option
                  v-for="item in domestatusList"
                  :value="item.value"
                  :key="item.value"
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
                @click="routerQuery"
                style="float: right;margin-right: 20px"
              >查询</Button>
            </FormItem>
          </i-col>
        </Row>
      </Form>
    </Card>

    <Card>
      <div style="margin-bottom: 20px">
        <Button type="primary" size="large" style="margin-right: 24px" @click="newRouter()" v-if="addBtn()">新建</Button>
      </div>
      <Spin fix v-if="spinShow"></Spin>
      <Table :columns="columns1" :data="dataList">
        <template slot-scope="scope" slot="stripPrefix">
          <strong>{{scope.row.stripPrefix==false?'否':'是'}}</strong>
        </template>
        <template slot-scope="scope" slot="retryable">
          <strong>{{scope.row.retryable==false?'否':'是'}}</strong>
        </template>
        <template slot-scope="scope" slot="customSensitiveHeaders">
          <strong>{{scope.row.customSensitiveHeaders==false?'否':'是'}}</strong>
        </template>
        <template slot="enabled" slot-scope="scope">
          <i-switch
            v-if="statusBtn()"
            @on-change="changeEnabledStatus(scope)"
            size="small"
            v-model="scope.row.enabled"
          ></i-switch>
        </template>
        <template slot="operations" slot-scope="scope">
          <!-- @click.native="clickEdit(scope)"    @click.native="clickDelete(scope)" -->
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
            v-if="editBtn()"
            type="_icondelete"
            color="#ff6b4e"
            :size="25"
            title="删除"
            @click.native="deleteRouter(scope)"
            style="margin-right: 10px;cursor:pointer"
          />
        </template>
      </Table>
      <Page :total="total" show-total @on-change="change" :styles="styles" />
    </Card>
    <!--添加-->
    <SetModal
      :modalValue="addRouterModal"
      modalTitle="新建"
      :modalMask="modalMask"
      :modalLoading="addModalLoading"
      @on-submit-modal="addModalConfirm"
      @on-cancel-modal="addRouterModal = false"
    >
      <Form ref="addForm" :model="addFormModel" :rules="addFormRules" :label-width="100">
        <FormItem label="服务主键" prop="id">
          <Input v-model="addFormModel.id" />
        </FormItem>
        <FormItem label="服务ID" prop="serviceId">
          <Input v-model="addFormModel.serviceId" />
        </FormItem>
        <FormItem label="路由地址" prop="path">
          <Input v-model="addFormModel.path" />
        </FormItem>
        <FormItem label="是否启用">
          <i-switch v-model="addFormModel.enabled"></i-switch>
        </FormItem>
        <FormItem label="路由名称" prop="routename">
          <Input v-model="addFormModel.routename" />
        </FormItem>
        <FormItem label="是否去前缀">
          <RadioGroup v-model="addFormModel.stripPrefix">
            <Radio label="true">是</Radio>
            <Radio label="false">否</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="敏感请求头">
          <RadioGroup v-model="addFormModel.retryable">
            <Radio label="true">是</Radio>
            <Radio label="false">否</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="是否重试" prop="menutype">
          <RadioGroup v-model="addFormModel.customSensitiveHeaders">
            <Radio label="true">是</Radio>
            <Radio label="false">否</Radio>
          </RadioGroup>
        </FormItem>
      </Form>
    </SetModal>
    <!--编辑-->
    <SetModal
      :modalValue="editRouterModal"
      modalTitle="编辑"
      :modalMask="modalMask"
      :modalLoading="addModalLoading"
      @on-submit-modal="editModalConfirm"
      @on-cancel-modal="editRouterModal = false"
    >
      <Form ref="editForm" :model="editFormModel" :rules="editFormRules" :label-width="100">
        <FormItem label="服务主键" prop="id">
          <Input v-model="editFormModel.id" disabled />
        </FormItem>
        <FormItem label="服务ID" prop="serviceId">
          <Input v-model="editFormModel.serviceId" />
        </FormItem>
        <FormItem label="路由地址" prop="path">
          <Input v-model="editFormModel.path" />
        </FormItem>
        <FormItem label="是否启用">
          <i-switch v-model="editFormModel.enabled"></i-switch>
        </FormItem>
        <FormItem label="路由名称" prop="routename">
          <Input v-model="editFormModel.routename" />
        </FormItem>
        <FormItem label="是否去前缀">
          <RadioGroup v-model="editFormModel.stripPrefix">
            <Radio label="true">是</Radio>
            <Radio label="false">否</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="敏感请求头">
          <RadioGroup v-model="editFormModel.retryable">
            <Radio label="true">是</Radio>
            <Radio label="false">否</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="是否重试" prop="menutype">
          <RadioGroup v-model="editFormModel.customSensitiveHeaders">
            <Radio label="true">是</Radio>
            <Radio label="false">否</Radio>
          </RadioGroup>
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
    // 新增服务id验证
    const valiServiceId = (rule, value, callback) => {
      if (value === '' || value === null) {
        callback(new Error('服务ID不能为空'));
      } else {
        axios
          .request({
            url: 'core/routeconfig/getExistRouteServiceId',
            data: {
              serviceId: value
            },
            method: 'post'
          })
          .then(res => {
            if (res.data.code === 200) {
              callback();
            } else {
              callback(new Error(res.data.message));
            }
          })
          .catch(e => {
            console.log(e);
            callback(new Error('校验失败，请重试'));
          });
      }
    };
    // 新增服务地址验证
    const valiServicePath = (rule, value, callback) => {
      if (value === '' || value === null) {
        callback(new Error('服务地址不能为空'));
      } else {
        axios
          .request({
            url: 'core/routeconfig/getExistRoutePath',
            data: {
              path: value
            },
            method: 'post'
          })
          .then(res => {
            if (res.data.code === 200) {
              callback();
            } else {
              callback(new Error(res.data.message));
            }
          })
          .catch(e => {
            console.log(e);
            callback(new Error('校验失败，请重试'));
          });
      }
    };
    // 修改服务id验证
    const valiServiceEditId = (rule, value, callback) => {
      if (value === '' || value === null) {
        callback(new Error('服务ID不能为空'));
      } else {
        axios
          .request({
            url: 'core/routeconfig/getExistRouteServiceId',
            data: {
              id: this.editFormModel.id,
              serviceId: value
            },
            method: 'post'
          })
          .then(res => {
            if (res.data.code === 200) {
              callback();
            } else {
              callback(new Error(res.data.message));
            }
          })
          .catch(e => {
            console.log(e);
            callback(new Error('校验失败，请重试'));
          });
      }
    };
    // 修改服务地址验证
    const valiServiceEditPath = (rule, value, callback) => {
      if (value === '' || value === null) {
        callback(new Error('服务地址不能为空'));
      } else {
        axios
          .request({
            url: 'core/routeconfig/getExistRoutePath',
            data: {
              id: this.editFormModel.id,
              path: value
            },
            method: 'post'
          })
          .then(res => {
            if (res.data.code === 200) {
              callback();
            } else {
              callback(new Error(res.data.message));
            }
          })
          .catch(e => {
            console.log(e);
            callback(new Error('校验失败，请重试'));
          });
      }
    };
    return {
      dataList: [],
      editRouterModal: false,
      addModalLoading: false,
      addRouterModal: false,
      dataValue: '',
      spinShow: false,
      total: 0,
      form: {
        routename: null,
        status: 'all'
      },
      styles: {
        'text-align': 'center',
        'margin-top': ' 20px'
      },
      // 状态列表
      domestatusList: [
        {
          label: '全部',
          value: 'all'
        },
        {
          label: '启用',
          value: 'yes'
        },
        {
          label: '停用',
          value: 'no'
        }
      ],
      editFormModel: {
        id: null,
        serviceId: null,
        path: null,
        enabled: 0,
        routename: null,
        stripPrefix: 'true',
        retryable: 'true',
        customSensitiveHeaders: 'true'
      },
      addFormModel: {
        id: null,
        serviceId: null,
        path: null,
        enabled: 0,
        routename: null,
        stripPrefix: 'true',
        retryable: 'true',
        customSensitiveHeaders: 'true'
      },
      addFormRules: {
        id: [
          { required: true, message: '服务主键不能为空', trigger: 'change' }
        ],
        serviceId: [
          { required: true, validator: valiServiceId, trigger: 'blur' }
        ],
        path: [{ required: true, validator: valiServicePath, trigger: 'blur' }],
        routename: [
          { required: true, message: '路由名称不能为空', trigger: 'change' }
        ]
      },
      editFormRules: {
        id: [
          { required: true, message: '服务主键不能为空', trigger: 'change' }
        ],
        serviceId: [
          { required: true, validator: valiServiceEditId, trigger: 'blur' }
        ],
        path: [
          { required: true, validator: valiServiceEditPath, trigger: 'blur' }
        ],
        routename: [
          { required: true, message: '路由名称不能为空', trigger: 'change' }
        ]
      },

      columns1: [
        {
          title: '序号',
          type: 'index',
          align: 'center',
          width: 70
        },
        {
          title: '服务器主键',
          align: 'center',
          key: 'id',
          width: 250
        },
        {
          title: '服务ID',
          align: 'center',
          key: 'serviceId',
          width: 250
        },
        {
          title: '路由地址',
          align: 'center',
          key: 'path'
        },
        {
          title: '是否启用',
          align: 'center',
          slot: 'enabled'
        },
        {
          title: '路由名称',
          align: 'center',
          key: 'routename'
        },
        {
          title: '是否去掉前缀',
          align: 'center',
          slot: 'stripPrefix',
          width: 120
        },
        {
          title: '是否重试',
          align: 'center',
          slot: 'retryable'
        },
        {
          title: '敏感请求头',
          align: 'center',
          width: 110,
          slot: 'customSensitiveHeaders'
        },
        {
          title: '操作',
          align: 'center',
          slot: 'operations'
        }
      ]
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
  created () {
    this.operlogGetAll();
    this.operaActions();
    this.statueActions();
  },
  methods: {
    // 新增权限
    addBtn () {
      return hasPermission('admin-router-config-add');
    },
    // 修改权限
    editBtn () {
      return hasPermission('admin-router-config-edit');
    },
    // 删除权限
    delBtn () {
      return hasPermission('admin-router-config-del');
    },
    // 状态权限
    statusBtn () {
      return hasPermission('admin-router-config-status');
    },
    statueActions () {
      if (hasPermission('admin-router-config-status') === false) {
        this.columns1.splice(4, 1);
      }
    },
    operaActions () {
      if (hasPermission('admin-system-dictionary-del') === false && hasPermission('admin-system-dictionary-edit') === false) {
        this.columns1.pop();
      }
    },
    // 新增
    newRouter () {
      this.$data.addModalLoading = false;
      this.$refs.addForm.resetFields();
      this.addRouterModal = true;
    },
    addModalConfirm () {
      this.$refs['addForm'].validate(valid => {
        if (valid) {
          this.$data.addModalLoading = true;
          axios
            .request({
              url: 'core/routeconfig/save',
              data: this.addFormModel,
              method: 'post'
            })
            .then(res => {
              this.addRouterModal = false;
              this.$Message.success({
                content: '新增成功'
              });
              this.operlogGetAll();
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
    // 编辑
    editRouter (obj) {
      this.editRouterModal = true;
      this.editFormModel = {
        id: obj.row.id,
        serviceId: obj.row.serviceId,
        path: obj.row.path,
        enabled: obj.row.enabled,
        routename: obj.row.routename,
        stripPrefix: String(obj.row.stripPrefix),
        retryable: String(obj.row.retryable),
        customSensitiveHeaders: String(obj.row.customSensitiveHeaders)
      };
    },
    editModalConfirm () {
      this.$refs['editForm'].validate(valid => {
        if (valid) {
          this.$data.addModalLoading = true;
          axios
            .request({
              url: 'core/routeconfig/update',
              data: this.editFormModel,
              method: 'put'
            })
            .then(res => {
              this.editRouterModal = false;
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
    // 删除
    deleteRouter (obj) {
      this.$Modal.confirm({
        title: '确定删除此条路由配置吗？',
        onOk: () => {
          if (obj.row.id !== '') {
            axios
              .request({
                url: 'core/routeconfig/delete',
                params: {
                  id: obj.row.id
                },
                method: 'delete'
              })
              .then(res => {
                if (res.status === 200) {
                  this.$data.deleteMenuModal = false;
                  this.$data.deleteModalLoading = false;
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
                this.$data.deleteModalLoading = false;
                this.$Message.error({
                  content: '请求失败，请重试'
                });
              });
          }
        }
      });
    },
    // 切换状态
    changeEnabledStatus (obj) {
      axios
        .request({
          url: 'core/routeconfig/updateEnabled',
          params: {
            id: obj.row.id,
            enabled: obj.row.enabled
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
    },
    // 加载数据
    operlogGetAll (arr) {
      this.spinShow = true;
      axios
        .request({
          url: 'core/routeconfig/getAll',
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
    routerQuery () {
      this.operlogGetAll(this.form);
    },
    // 重置
    resetClick () {
      this.form = {
        routename: '',
        enabled: ''
      };
      this.total = 1;
      this.operlogGetAll(this.form);
    }
  }
};
</script>
