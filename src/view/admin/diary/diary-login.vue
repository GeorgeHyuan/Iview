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
            <FormItem label="登录状态" :label-width="78">
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
          <i-col span="6" style="min-width:280px;z-index:2">
            <FormItem label="登录时间" :label-width="78">
              <DatePicker
                ref="zeros"
                size="large"
                style="width:100%"
                @on-change="handleChange"
                type="daterange"
                show-week-numbers
                placement="bottom-end"
                placeholder="请选择登录时间"
              ></DatePicker>
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

    <Card>
      <div style="margin-bottom: 20px">
        <Button type="warning" size="large" style="margin-right: 24px" @click="cooseDelete()"  v-if="delBtn()" >删除</Button>
        <Button type="error" size="large" @click="cooseEmpty()" v-if="emptyBtn()">清空</Button>
      </div>
      <Spin fix v-if="spinShow"></Spin>
      <Table
        :columns="columns1"
        :data="dataList"
        @on-select="selectItem"
        @on-select-cancel="cancelItem"
        @on-select-all="selectItemAll"
        @on-selection-change="selectChange"
      >
        <template slot-scope="{ row }" slot="status">
          <strong>
            <CommonIcon
              type="_iconsucceed"
              color="#49C00E"
              :size="25"
              v-if="row.status===0"
              style="margin-right: 10px;cursor:pointer"
            />
            <CommonIcon
              type="_iconfailure"
              color="#FF6B4E"
              :size="25"
              v-if="row.status===1"
              style="margin-right: 10px;cursor:pointer"
            />
          </strong>
        </template>
      </Table>
      <Page :total="total" show-total @on-change="change" :styles="styles" />
    </Card>
  </div>
</template>
<script>
import axios from '@/libs/api.request';
import mixin from '_c/gather/mixin';
import { hasPermission } from '@/libs/util';
export default {
  name: 'diary-handle',
  components: {},
  mixins: [mixin],
  data () {
    return {
      dataValue: '',
      spinShow: false,
      selectDataStore: [],
      traverseId: [],
      traverseIds: [],
      total: 0,
      dataList: [],
      form: {
        loginname: null,
        status: -1,
        currPage: 1,
        loginBeginTime: null,
        loginEndTime: null
      },
      styles: {
        'text-align': 'center',
        'margin-top': ' 20px'
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
          title: '登录地址',
          align: 'center',
          key: 'ipaddr'
        },
        {
          title: '登录地点',
          align: 'center',
          key: 'loginlocation'
        },
        {
          title: '浏览器',
          align: 'center',
          key: 'terminalname'
        },
        {
          title: '操作系统',
          align: 'center',
          key: 'os'
        },
        {
          title: '登录时间',
          align: 'center',
          key: 'logintime'
        },
        {
          title: '登录状态',
          align: 'center',
          slot: 'status'
        }
      ]
    };
  },
  created () {
    this.operlogGetAll();
  },
  computed: {
    IEFlag () {
      return this.$store.state.app.IEFlag;
    }
  },
  methods: {
    // 删除权限
    delBtn () {
      return hasPermission('admin-diary-login-del');
    },
    // 清空权限
    emptyBtn () {
      return hasPermission('admin-diary-login-empty');
    },
    // 加载数据
    operlogGetAll (arr) {
      this.spinShow = true;
      axios
        .request({
          url: 'core/signlog/getAll',
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
      if (this.dataValue.length !== null) {
        this.form.loginBeginTime = this.dataValue[0];
        this.form.loginEndTime = this.dataValue[1];
        this.operlogGetAll(this.form);
      }
    },
    handleChange (daterange) {
      this.dataValue = daterange;
    },
    // 重置
    resetClick () {
      this.form = {
        loginname: null,
        status: -1
      };
      this.total = 1;
      this.$refs.zeros.handleClear();
      this.operlogGetAll(this.form);
    },
    // 清空
    cooseEmpty () {
      this.$Modal.confirm({
        title: '确定全部清空吗？',
        onOk: () => {
          axios
            .request({
              url: 'core/signlog/deleteAll',
              data: '',
              method: 'delete'
            })
            .then(res => {
              if (res.data.code === 200) {
                this.$Message.success({
                  content: '已全部清空'
                });
                this.operlogGetAll();
              } else {
                this.$Message.error({
                  content: '清空失败'
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
      });
    },
    // 选中删除
    selectItem (selection, row) {
      this.selectDataStore.push(row);
    },
    cancelItem (selection, row) {
      this.selectDataStore.forEach((item, index) => {
        if (item.id === row.id) {
          this.selectDataStore.splice(index, 1);
        }
      });
    },
    selectItemAll (selection) {
      this.selectDataStore = this.selectDataStore.concat(selection);
    },
    selectChange (selection) {
      if (!selection.length) {
        let arr1 = this.selectDataStore;
        let arr2 = this.dataList;
        for (let i = 0; i < arr1.length; i++) {
          for (let j = 0; j < arr2.length; j++) {
            if (arr1[i].id === arr2[j].id) {
              this.selectDataStore.splice(i, 1);
            }
          }
        }
      }
    },
    // 请求删除
    cooseDelete () {
      for (let i = 0; i < this.selectDataStore.length; i++) {
        this.traverseId.push(this.selectDataStore[i].id);
      }
      this.traverseIds = [...new Set(this.traverseId)];
      this.$Modal.confirm({
        title: '确定要删除吗？',
        onOk: () => {
          if (this.selectDataStore.length === 0) {
            this.$Message.error({
              content: '请选择要删除的数据'
            });
          } else {
            axios
              .request({
                url: 'core/signlog/deletemutil',
                data: {
                  pks: this.traverseIds
                },
                method: 'delete'
              })
              .then(res => {
                this.spinShow = false;
                if (res.data.code === 200) {
                  this.$Message.success({
                    content: '删除成功'
                  });
                  this.selectDataStore = [];
                  this.operlogGetAll();
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
          }
        }
      });
    }
  }
};
</script>
<style lang="less">
</style>
