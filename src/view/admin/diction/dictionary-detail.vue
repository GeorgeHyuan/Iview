<template>
  <!-- 筛选条件 -->
  <div class="menuList">
    <!-- <Card class="filterCard">
      <Form :label-width="100">
        <Row>
          <i-col span="6" style="min-width:180px;z-index:2">
            <FormItem label="字典名称" :label-width="78">
              <Input size="large" v-model="form.dicname" placeholder="请输入" />
            </FormItem>
          </i-col>

          <i-col span="6" style="min-width:180px;z-index:2">
            <FormItem label="字典值" :label-width="78">
              <Input size="large" v-model="form.dicvalue" placeholder="请输入" />
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
    </Card>-->

    <Card>
      <div style="margin-bottom: 20px">
        <Button type="primary" size="large" style="margin-right: 24px" @click="newDiction()" v-if="addBtn()">添加</Button>
        <Button type="primary" size="large" style="margin-right: 24px" @click="goLast()">返回</Button>
      </div>
      <Spin fix v-if="spinShow"></Spin>
      <Table :columns="columns1" :data="dataList">
        <template slot="operations" slot-scope="scope">
          <!-- @click.native="clickEdit(scope)"    @click.native="clickDelete(scope)" -->
          <CommonIcon
            type="_iconedit"
            color="#079fff"
            :size="25"
            title="编辑"
            v-if="editBtn()"
            @click.native="divtionRouter(scope)"
            style="margin-right: 10px;cursor:pointer"
          />
          <CommonIcon
            type="_icondelete"
            color="#ff6b4e"
            :size="25"
            title="删除"
            v-if="delBtn()"
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
      modalTitle="添加"
      :modalMask="modalMask"
      :modalLoading="addModalLoading"
      @on-submit-modal="addModalConfirm"
      @on-cancel-modal="addDictionModal = false"
    >
      <Form ref="addForm" :model="addFormModel" :rules="addFormRules" :label-width="100">
        <FormItem label="字典名称" prop="dicname">
          <Input v-model="addFormModel.dicname" />
        </FormItem>
        <FormItem label="字典值" prop="dicvalue">
          <Input v-model="addFormModel.dicvalue" />
        </FormItem>
        <FormItem label="排序号 " prop="indexnum">
          <InputNumber v-model="addFormModel.indexnum" ></InputNumber>
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
        <FormItem label="字典名称" prop="dicname">
          <Input v-model="editFormModel.dicname" />
        </FormItem>
        <FormItem label="字典值" prop="dicvalue">
          <Input v-model="editFormModel.dicvalue" />
        </FormItem>
        <FormItem label="排序号" prop="indexnum">
          <InputNumber v-model="editFormModel.indexnum" ></InputNumber>
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
import { mapMutations } from 'vuex';
export default {
  name: 'admin-system-dictionary-detail',
  mixins: [mixin],
  components: {},
  data () {
    return {
      Id: null,
      queryId: this.$route.query.id,
      dataList: [],
      editDivtionModal: false,
      addModalLoading: false,
      addDictionModal: false,
      spinShow: false,
      total: 0,
      form: {
        dicname: null,
        dicvalue: null
      },
      styles: {
        'text-align': 'center',
        'margin-top': ' 20px'
      },
      editFormModel: {
        dicvalue: null,
        dicname: null,
        dicexplain: null,
        indexnum: 0,
        parentid: this.$route.query.id,
        id: null,
        delflag: 0
      },
      addFormModel: {
        parentid: this.$route.query.id,
        delflag: 0,
        dicvalue: null,
        dicname: null,
        dicexplain: null,
        indexnum: 0
      },
      addFormRules: {
        dicvalue: [
          { required: true, message: '字典值不能为空', trigger: 'blur' }
        ],
        dicname: [
          { required: true, message: '字典名称不能为空', trigger: 'blur' }
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
      editFormRules: {
        dicvalue: [
          { required: true, message: '字典值不能为空', trigger: 'blur' }
        ],
        dicname: [
          { required: true, message: '字典名称不能为空', trigger: 'blur' }
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

      columns1: [
        {
          title: '序号',
          align: 'center',
          type: 'index'
        },
        {
          title: '字典名称',
          align: 'center',
          key: 'dicname'
        },
        {
          title: '字典值',
          align: 'center',
          key: 'dicvalue'
        },
        {
          title: '字典描述',
          align: 'center',
          key: 'dicexplain'
        },
        {
          title: '排序号',
          align: 'center',
          key: 'indexnum'
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
  watch: {
    '$route.query.id' (newValue, oldValue) {
      this.Id = {
        parentid: newValue
      };
      this.addDictionGetAll(this.Id);
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      if (vm.$data.Id !== vm.$route.query.id) {
        let idone = {
          parentid: vm.$route.query.id
        };
        vm.addDictionGetAll(idone);
      }
    });
  },
  methods: {
    ...mapMutations(['closeTag']),

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
    operaActions () {
      if (hasPermission('admin-system-dictionary-edit') === false) {
        this.columns1.pop();
      }
    },
    goLast () {
      this.closeTag(this.$route);
      this.$router.push({
        name: 'admin-system-dictionary'
      });
    },
    // 新增
    newDiction () {
      this.$data.addModalLoading = false;
      this.addFormModel = {
        parentid: this.$route.query.id,
        delflag: 0,
        dicvalue: null,
        dicname: null,
        dicexplain: null,
        indexnum: 0
      };
      this.$refs.addForm.resetFields();
      this.addDictionModal = true;
    },
    addModalConfirm () {
      this.$refs['addForm'].validate(valid => {
        if (valid) {
          this.$data.addModalLoading = true;
          axios
            .request({
              url: 'core/sysdicdtl/save',
              data: this.addFormModel,
              method: 'post'
            })
            .then(res => {
              this.addDictionModal = false;
              this.$Message.success({
                content: '新增成功'
              });
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
        dicvalue: obj.row.dicvalue,
        dicname: obj.row.dicname,
        dicexplain: obj.row.dicexplain,
        indexnum: String(obj.row.indexnum),
        parentid: this.$route.query.id,
        id: obj.row.id,
        delflag: 0
      };
    },
    editModalConfirm () {
      this.$refs['editForm'].validate(valid => {
        if (valid) {
          this.$data.addModalLoading = true;
          axios
            .request({
              url: 'core/sysdicdtl/update',
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
                url: 'core/sysdicdtl/delete',
                params: {
                  id: obj.row.id,
                  parentid: this.$route.query.id
                },
                method: 'delete'
              })
              .then(res => {
                if (res.status === 200) {
                  this.$data.deleteMenuModal = false;
                  this.$data.deleteModalLoading = false;
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
                this.$data.deleteModalLoading = false;
                this.$Message.error({
                  content: '请求失败，请重试'
                });
              });
          }
        }
      });
    },
    // 加载数据
    addDictionGetAll (arr) {
      this.spinShow = true;
      axios
        .request({
          url: 'core/sysdicdtl/getAll',
          data: {
            ...arr,
            parentid: this.$route.query.id
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
    }
    // 查询
    // dictionQuery() {
    //   this.addDictionGetAll(this.form);
    // },
    // 重置
    // resetClick() {
    //   this.form = {
    //     dicname: "",
    //     dicvalue: ""
    //   };
    //   this.total = 1;
    //   this.addDictionGetAll(this.form);
    // }
  }
};
</script>
