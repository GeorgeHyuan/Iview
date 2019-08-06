<template>
  <!-- 筛选条件 -->
  <div class="menuList">
    <Card class="filterCard">
      <Form :label-width="100">
        <Row>
          <i-col span="6" style="min-width:180px;z-index:2">
             <FormItem label="字典编码" :label-width="78">
              <Input size="large" v-model="form.dicno" placeholder="请输入字典编码" />
            </FormItem>
        </i-col>
          <i-col span="6" style="min-width:180px;z-index:2">
            <FormItem label="字典名称" :label-width="78">
              <Input size="large" v-model="form.dicname" placeholder="请输入字典名称" />
            </FormItem>
          </i-col>


          <i-col style="min-width:180px;">
            <FormItem style=" text-align: center;">
              <Button type="error" size="large" style="float: right;" @click="resetClick">重置</Button>
              <Button
                type="primary"
                size="large"
                @click="dictionQuery"
                style="float: right;margin-right: 20px"
              >查询</Button>
            </FormItem>
          </i-col>
        </Row>
      </Form>
    </Card>

    <Card>
      <div style="margin-bottom: 20px">
        <Button type="primary" size="large" style="margin-right: 24px" @click="newDiction()" v-if="addBtn()">新建</Button>
      </div>
      <Spin fix v-if="spinShow"></Spin>
      <Table :columns="columns1" :data="dataList">
        <template slot="operations" slot-scope="scope">
          <!-- @click.native="clickEdit(scope)"    @click.native="clickDelete(scope)" -->
          <CommonIcon
            type="_iconedit"
            color="#079fff"
            :size="25"
            v-if="editBtn()"
            title="编辑"
            @click.native="divtionRouter(scope)"
            style="margin-right: 10px;cursor:pointer"
          />
          <CommonIcon
            type="_icondetail"
            color="#079fff"
            :size="25"
            title="详情"
            v-if="detailBtn()"
            @click.native="divtionDetails(scope)"
            style="margin-right: 10px;cursor:pointer"
          />
          <CommonIcon
            type="_icondelete"
            color="#ff6b4e"
            :size="25"
            v-if="delBtn()"
            title="删除"
            @click.native="deleteDiction(scope)"
            style="margin-right: 10px;cursor:pointer"
          />
        </template>
      </Table>
      <Page :total="total" show-total @on-change="change" :styles="styles" />
    </Card>
    <!--添加-->
    <SetModal
      :modalValue="addDictionModal"
      modalTitle="新建"
      :modalMask="modalMask"
      :modalLoading="addModalLoading"
      @on-submit-modal="addModalConfirm"
      @on-cancel-modal="addDictionModal = false"
    >
      <Form ref="addForm" :model="addFormModel" :rules="addFormRules" :label-width="100">
        <FormItem label="字典编号" prop="dicno">
          <Input v-model="addFormModel.dicno" />
        </FormItem>
        <FormItem label="字典名称" prop="dicname">
          <Input v-model="addFormModel.dicname" />
        </FormItem>
        <FormItem label="字典说明">
          <Input
            v-model="addFormModel.dicexplain"
            :autosize="{minRows: 6,maxRows: 10}"
            type="textarea"
            placeholder="请输入说明"
          />
        </FormItem>
      </Form>
    </SetModal>
    <!--编辑-->
    <SetModal
      :modalValue="editDivtionModal"
      modalTitle="编辑"
      :modalMask="modalMask"
      :modalLoading="addModalLoading"
      @on-submit-modal="editModalConfirm"
      @on-cancel-modal="editDivtionModal = false"
    >
      <Form ref="editForm" :model="editFormModel" :rules="editFormRules" :label-width="100">
        <FormItem label="字典编号" prop="dicno">
          <Input v-model="editFormModel.dicno" />
        </FormItem>
        <FormItem label="字典名称" prop="dicname">
          <Input v-model="editFormModel.dicname" />
        </FormItem>
        <FormItem label="字典说明">
          <Input
            v-model="editFormModel.dicexplain"
            :autosize="{minRows: 6,maxRows: 10}"
            type="textarea"
            placeholder="请输入说明"
          />
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
      dataList: [],
      editDivtionModal: false,
      addModalLoading: false,
      addDictionModal: false,
      spinShow: false,
      total: 0,
      form: {
        dicname: null,
        dicno: null
      },
      styles: {
        'text-align': 'center',
        'margin-top': ' 20px'
      },
      editFormModel: {
        dicname: null,
        dicno: null,
        dicexplain: null
      },
      addFormModel: {
        dicname: null,
        dicno: null,
        dicexplain: null,
        delflag: 0
      },
      addFormRules: {
        dicno: [
          { required: true, message: '字典编号不能为空', trigger: 'blur' }
        ],
        dicname: [
          { required: true, message: ' 字典编码不能为空', trigger: 'blur' }
        ]
      },
      editFormRules: {
        dicno: [
          { required: true, message: '字典编号不能为空', trigger: 'blur' }
        ],
        dicname: [
          { required: true, message: '字典编码不能为空', trigger: 'blur' }
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
          title: '字典名称',
          align: 'center',
          key: 'dicname'
        },
        {
          title: '字典编码',
          align: 'center',
          key: 'dicno'
        },
        {
          title: '字典说明',
          align: 'center',
          key: 'dicexplain'
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
    this.addDictionGetAll();
    this.operaActions();
  },
  methods: {
    // 新增权限
    addBtn () {
      return hasPermission('admin-system-dictionary-add');
    },
    // 修改权限
    editBtn () {
      return hasPermission('admin-system-dictionary-edit');
    },
    // 删除权限
    delBtn () {
      return hasPermission('admin-system-dictionary-del');
    },
    // 详情权限
    detailBtn () {
      return hasPermission('admin-system-dictionary-detail');
    },
    operaActions () {
      if (hasPermission('admin-system-dictionary-edit') === false && hasPermission('admin-system-dictionary-del') === false && hasPermission('admin-system-dictionary-detail') === false) {
        this.columns1.pop();
      }
    },
    // 跳转详情
    divtionDetails (obj) {
      this.$router.push({
        name: 'admin-system-dictionary-detail',
        query: { id: obj.row.id }
      });
    },
    // 新增
    newDiction () {
      this.$data.addModalLoading = false;
      this.$refs.addForm.resetFields();
      this.addDictionModal = true;
    },
    addModalConfirm () {
      this.$refs['addForm'].validate(valid => {
        if (valid) {
          this.$data.addModalLoading = true;
          axios
            .request({
              url: 'core/sysdicmst/save',
              data: this.addFormModel,
              method: 'post'
            })
            .then(res => {
              this.$Message.success({
                content: '新增成功'
              });
              this.addDictionModal = false;
              this.addDictionGetAll();
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
    divtionRouter (obj) {
      this.editDivtionModal = true;
      this.editFormModel = {
        id: obj.row.id,
        dicname: obj.row.dicname,
        dicno: obj.row.dicno,
        dicexplain: obj.row.dicexplain,
        delflag: 0
      };
    },
    editModalConfirm () {
      this.$refs['editForm'].validate(valid => {
        if (valid) {
          this.$data.addModalLoading = true;
          axios
            .request({
              url: 'core/sysdicmst/update',
              data: this.editFormModel,
              method: 'put'
            })
            .then(res => {
              this.editDivtionModal = false;
              this.$data.addModalLoading = false;
              this.addDictionGetAll();
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
    deleteDiction (obj) {
      this.$Modal.confirm({
        title: '确定删除此条字典吗？',
        onOk: () => {
          if (obj.row.id !== '') {
            axios
              .request({
                url: 'core/sysdicmst/delete',
                params: {
                  id: obj.row.id
                },
                method: 'delete'
              })
              .then(res => {
                if (res.status === 200) {
                  this.addDictionGetAll();
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
    addDictionGetAll (arr) {
      this.spinShow = true;
      axios
        .request({
          url: 'core/sysdicmst/getAll',
          data: {
            ...arr,
            delflag: 0
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
      this.addDictionGetAll(this.form);
    },
    // 查询
    dictionQuery () {
      this.addDictionGetAll(this.form);
    },
    // 重置
    resetClick () {
      this.form = {
        dicname: '',
        dicno: ''
      };
      this.total = 1;
      this.addDictionGetAll(this.form);
    }
  }
};
</script>
