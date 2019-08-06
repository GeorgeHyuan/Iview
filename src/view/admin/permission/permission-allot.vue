<style lang="less">
/*@import "";*/
</style>

<template>
  <!-- 筛选条件 -->
  <div class="menuList">
    <Card class="filterCard">
      <Form :label-width="100">
        <Row>
          <i-col span="6" style="min-width:180px;z-index:2">
            <FormItem label="登录名称" :label-width="78">
              <Input size="large" v-model="form.loginname" placeholder="请输入登录名称" />
            </FormItem>
          </i-col>
          <i-col span="6" style="min-width:180px;z-index:2">
            <FormItem label="用户名称" :label-width="78">
              <Input size="large" v-model="form.username" placeholder="请输入用户名称" />
            </FormItem>
          </i-col>
          <i-col span="6" style="min-width:180px;z-index:2">
            <FormItem label="手机号码" :label-width="78">
              <Input size="large" v-model="form.mobile" placeholder="请输入手机号码" />
            </FormItem>
          </i-col>
          <i-col style="min-width:180px;">
            <FormItem>
              <Button type="error" size="large" @click="resetClick" style="float: right;">重置</Button>
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

    <Card shadow>
      <div style="margin-bottom: 20px">
        <Button type="primary" size="large" style="margin-right: 24px" @click="addallot()" v-if="addBtn()">添加</Button>
        <Button type="primary" size="large" style="margin-right: 24px" @click="goLast()">返回</Button>
        <Button type="error" size="large" @click="allDelete()" v-if="delBtn()">解绑绑定</Button>
      </div>
      <Spin fix v-if="spinShow"></Spin>
      <Table :columns="columns1" @on-selection-change="selectListAll" :data="dataList">
        <template slot="actions" slot-scope="scope">
          <CommonIcon
            type="_icondelete"
            color="#ff6b4e"
            @click.native="deleteSingular(scope)"
            :size="25"
            style="margin-right: 10px;cursor:pointer"
          />
        </template>
      </Table>
      <Page :total="total" show-total @on-change="change" :styles="styles" />
    </Card>
    <SetModal
      :modalValue="addAllotModal"
      modalTitle="添加用户"
      :modalMask="modalMask"
      :modalLoading="addModalLoading"
      @on-submit-modal="addModalConfirm"
      @on-cancel-modal="addAllotModal = false"
      :modalWidth="1200"
    >
      <Form :label-width="100">
        <Row>
          <i-col span="6" style="min-width:180px;z-index:2">
            <FormItem label="登录名称" :label-width="78">
              <Input size="large" v-model="forms.loginname" placeholder="请输入登录名称" />
            </FormItem>
          </i-col>
          <i-col span="6" style="min-width:180px;z-index:2">
            <FormItem label="用户名称" :label-width="78">
              <Input size="large" v-model="forms.username" placeholder="请输入用户名称" />
            </FormItem>
          </i-col>
          <i-col span="6" style="min-width:180px;z-index:2">
            <FormItem label="手机号码" :label-width="78">
              <Input size="large" v-model="forms.mobile" placeholder="请输入手机号码" />
            </FormItem>
          </i-col>
          <i-col style="min-width:180px;">
            <FormItem>
              <Button type="error" size="large" @click="resetClickAll" style="float: right;">重置</Button>
              <Button
                type="primary"
                size="large"
                @click="logQueryAlls()"
                style="float: right;margin-right: 20px"
              >查询</Button>
            </FormItem>
          </i-col>
        </Row>
        <Card>
          <Spin fix v-if="spinShow"></Spin>
          <Table :columns="columns2" :data="dataListtwo" @on-selection-change="selectList">
          </Table>
          <Page :total="totals" show-total @on-change="changes" :styles="styleModel" />
        </Card>
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
  name: 'diary-handle',
  components: {},
  mixins: [mixin],
  data () {
    return {
      addModalLoading: false,
      addAllotModal: false,
      dataValue: '',
      spinShow: false,
      selectDataStore: [],
      selectDataStores: [],
      traverseId: [],
      traverseIds: [],
      total: 0,
      totals: 0,
      arrList: [],
      arrListAll: [],
      dataList: [],
      dataListtwo: [],
      form: {
        username: null,
        loginname: null,
        mobile: null,
        currPage: 1
      },

      forms: {
        username: null,
        loginname: null,
        mobile: null,
        currPage: 1
      },
      styles: {
        'text-align': 'center',
        'margin-top': ' 20px'
      },
      styleModel: {
        'text-align': 'right',
        'margin-top': ' 20px'
      },
      addFormModel: {
        powerno: null,
        powername: null,
        powerexplain: null,
        powerstatus: null
      },
      // 状态列表
      domestatusList: [
        {
          label: '全部',
          value: -1
        },
        {
          label: '成功',
          value: 0
        },
        {
          label: '失败',
          value: 1
        }
      ],
      columns1: [
        {
          type: 'selection',
          align: 'center',
          key: 'id',
          width: 50
        },
        {
          title: '序号',
          type: 'index',
          align: 'center',
          width: 70
        },
        {
          title: '登录名称',
          align: 'center',
          key: 'loginname'
        },
        {
          title: '用户名称',
          align: 'center',
          key: 'username'
        },
        {
          title: '手机号码',
          align: 'center',
          key: 'mobile'
        },
        {
          title: '创建时间',
          align: 'center',
          key: 'createtime'
        },
        {
          title: '操作',
          align: 'center',
          type: 'template',
          slot: 'actions'
        }
      ],
      columns2: [
        {
          type: 'selection',
          align: 'center',
          key: 'id',
          width: 50
        },

        {
          title: '登录名称',
          align: 'center',
          key: 'loginname'
        },
        {
          title: '用户名称',
          align: 'center',
          key: 'username'
        },
        {
          title: '手机号码',
          align: 'center',
          key: 'mobile'
        },
        {
          title: '创建时间',
          align: 'center',
          key: 'createtime'
        }
      ]
    };
  },
  created () {
    this.operlogGetAll();
    this.operaActions();
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
    ...mapMutations(['closeTag']),
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
    operaActions () {
      if (hasPermission('admin-system-permission-del') === false) {
        this.columns1.pop();
      }
    },
    goLast () {
      this.closeTag(this.$route);
      this.$router.push({
        name: 'admin-system-permission'
      });
    },
    // 加载数据
    operlogGetAll (arr) {
      this.spinShow = true;
      axios
        .request({
          url: 'core/power/getPageUserLimitSystemPower',
          data: {
            ...arr,
            systemPowerId: this.$route.query.id,
            organizeId: localStorage.getItem('organizeId')
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
    // 加载未分配人员数据
    operlogGetAlls (arr) {
      this.spinShow = true;
      axios
        .request({
          url: 'core/power/getPageUserNoLimitSystemPower',
          data: {
            ...arr,
            systemPowerId: this.$route.query.id,
            organizeId: localStorage.getItem('organizeId')
          },
          method: 'post'
        })
        .then(res => {
          this.spinShow = false;
          if (res.data.code === 200) {
            this.dataListtwo = res.data.data.dataList;
            this.totals = res.data.data.totalRecord;
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
    // 分页弹窗
    changes (Page) {
      this.forms.currPage = Page;
      this.operlogGetAlls(this.forms);
    },
    // 查询已经分配
    logQuery () {
      this.selectDataStores = [];
      this.form.currPage = 1;
      this.operlogGetAll(this.form);
    },
    // 查询未分配
    logQueryAlls () {
      this.selectDataStore = [];
      this.forms.currPage = 1;
      this.operlogGetAlls(this.forms);
    },
    // 重置已经分配
    resetClick () {
      this.selectDataStores = [];
      this.form = {
        username: null,
        loginname: null,
        mobile: null,
        currPage: 1
      };
      this.total = 1;
      this.operlogGetAll(this.form);
    },
    // 重置未分配
    resetClickAll () {
      this.selectDataStore = [];
      this.forms = {
        username: null,
        loginname: null,
        mobile: null,
        currPage: 1
      };
      this.totals = 1;
      this.operlogGetAlls(this.forms);
    },
    // 删除方法
    deletes (objs) {
      if (objs.length === 0) {
        this.$Message.error({
          content: '请勾选要移除的项'
        });
      } else {
        axios
          .request({
            url: 'core/power/deleteUserLimitPower',
            data: {
              userIdList: objs,
              powerId: this.$route.query.id
            },
            method: 'delete'
          })
          .then(res => {
            if (res.status === 200) {
              this.operlogGetAll();
              this.$Message.success({
                content: '移除成功'
              });
            } else {
              this.$Message.error({
                content: '移除失败'
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
    },
    // 点击全部删除
    selectListAll (selection) {
      this.selectDataStores = [];
      if (selection.length > 0) {
        this.disabled = false;
        for (let i = 0; i < selection.length; i++) {
          this.selectDataStores.push(selection[i].id);
        }
      } else {
        this.disabled = true;
      }
    },
    allDelete () {
      if (this.selectDataStores.length === 0) {
        this.$Message.error({
          content: '请勾选需要解除的用户'
        });
      } else {
        for (let i in this.selectDataStores) {
          this.arrListAll.push(this.selectDataStores[i]);
        }
        this.$Modal.confirm({
          title: '确定解除绑定吗？',
          onOk: () => {
            this.deletes(this.arrListAll);
            this.selectDataStores = [];
          }
        });
      }
    },
    // 单个删除
    deleteSingular (obj) {
      let objs = [];
      objs.push(obj.row.id);
      this.$Modal.confirm({
        title: '确定解除用户吗？',
        onOk: () => {
          this.deletes(objs);
        }
      });
    },
    selectList (selection) {
      this.selectDataStore = [];
      if (selection.length > 0) {
        this.disabled = false;
        for (let i = 0; i < selection.length; i++) {
          this.selectDataStore.push(selection[i].id);
        }
      } else {
        this.disabled = true;
      }
    },
    // 点击添加权限用户
    addallot () {
      this.$data.addModalLoading = false;
      this.selectDataStore = [];
      this.addAllotModal = true;
      this.operlogGetAlls();
    },
    // 点击确认添加
    addModalConfirm () {
      this.arrList = [];
      for (let i in this.selectDataStore) {
        this.arrList.push(this.selectDataStore[i]);
      }
      if (this.arrList.length === 0) {
        this.$Message.error({
          content: '请勾选添加项'
        });
      } else {
        this.$data.addModalLoading = true;
        axios
          .request({
            url: 'core/power/saveUserLimitPower',
            data: {
              userIdList: this.arrList,
              powerId: this.$route.query.id
            },
            method: 'post'
          })
          .then(res => {
            if (res.data.code === 200) {
              this.$Message.success({
                content: '新增成功'
              });
              this.arrList = [];
              this.selectDataStore = [];
              this.addAllotModal = false;
              this.operlogGetAlls();
              this.operlogGetAll();
            } else {
              this.$data.addModalLoading = false;
              this.$Message.error({
                content: '新增失败'
              });
            }
          })
          .catch(e => {
            this.$Message.error({
              content: '请求失败'
            });
          });
      }
    }
  }
};
</script>
<style lang="less">
</style>
