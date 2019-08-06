<style lang="less">
// @import "./diary-handle.less";
</style>

<template>
  <!-- 筛选条件 -->
  <div class="menuList">
    <Card class="filterCard">
      <Form :label-width="100">
        <Row>
          <i-col span="3" style="min-width:180px;z-index:2">
            <FormItem label="系统模块" :label-width="78">
              <Input size="large" v-model="form.systemmodel" placeholder="请输入系统模块" />
            </FormItem>
          </i-col>
          <i-col span="3" style="min-width:180px;z-index:2">
            <FormItem label="操作人员" :label-width="78">
              <Input size="large" v-model="form.loginname" placeholder="请输入操作人员" />
            </FormItem>
          </i-col>
          <i-col span="3" style="min-width:180px;z-index:2">
            <FormItem label="操作类型" :label-width="78">
              <Select size="large" v-model="form.operatortype" placeholder="请选择类型" v-if="!IEFlag">
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
          <i-col span="3" style="min-width:180px;z-index:2">
            <FormItem label="操作状态" :label-width="78">
              <Select size="large" v-model="form.status" placeholder="请选择状态" v-if="!IEFlag">
                <Option
                  v-for="item in domestatusList"
                  :value="item.value"
                  :key="item.value"
                >{{item.label}}</Option>
              </Select>
              <select size="large" v-model="form.status" placeholder="请选择状态" v-if="IEFlag">
                <option
                  v-for="item in domestatusList"
                  :value="item.value"
                  :key="item.value"
                >{{item.label}}</option>
              </select>
              <p class="triangle" v-if="IEFlag"></p>
            </FormItem>
          </i-col>
          <i-col span="4" style="min-width:280px;z-index:2">
            <FormItem label="操作时间" :label-width="78">
              <DatePicker
                ref="zeros"
                @on-change="handleChange"
                type="daterange"
                size="large"
                style="width:100%"
                show-week-numbers
                placement="bottom-end"
                placeholder="请选择操作时间"
              ></DatePicker>
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
        <Button type="warning" size="large" style="margin-right: 24px" v-if="delBtn()" @click="cooseDelete()">删除</Button>
        <Button type="error" size="large"  v-if="emptyBtn()" @click="cooseEmpty()">清空</Button>
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
        <template slot-scope="{ row }" slot="operatortype">
          <strong>
            <img :src="getAllImg[row.operatortype]" />
          </strong>
        </template>
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
        <template slot-scope="{ row }" slot="operations">
            <CommonIcon
              type="_icondetail"
              color="#079fff"
              :size="25"
              title="详情"
              @click.native="logEditor(row)"
              style="margin-right: 10px;cursor:pointer"
            />
        </template>
      </Table>
      <Page :total="total" show-total @on-change="change" :styles="styles" />
    </Card>
    <SetModal
      :modalValue="logEditorModal"
      modalTitle="详情"
      :showSubmitButton="false"
      @on-cancel-modal="logEditorModal = false"
    >
      <div style="font-size:14px">
        <Row :gutter="16">
          <i-col style=" text-align: right" span="4">操作模块:</i-col>
          <i-col span="20">{{editorMidalObj.systemmodel}} / {{editorMidalObj.operatortypename}}</i-col>
        </Row>
        <br />
        <Row :gutter="16">
          <i-col style=" text-align: right" span="4">登录信息:</i-col>
          <i-col
            span="20"
          >{{editorMidalObj.loginname}} / {{editorMidalObj.operlocation}} / {{editorMidalObj.operip}}</i-col>
        </Row>
        <br />
        <Row :gutter="16">
          <i-col style=" text-align: right" span="4">请求地址:</i-col>
          <i-col span="20">{{editorMidalObj.operurl}}</i-col>
        </Row>
        <br />
        <Row :gutter="16">
          <i-col style=" text-align: right" span="4">操作时间:</i-col>
          <i-col span="20">{{editorMidalObj.operTime}}</i-col>
        </Row>
        <br />
        <Row :gutter="16">
          <i-col style=" text-align: right" span="4">请求参数:</i-col>
          <i-col span="20">
            <textarea rows="6" cols="50" style="margin:5px 0" v-model="editorMidalObj.operparam"></textarea>
          </i-col>
        </Row>
        <Row :gutter="16">
          <i-col style=" text-align: right" span="4">操作状态:</i-col>
          <i-col span="20" v-if="editorMidalObj.status===0">
            <CommonIcon
              type="_iconsucceed"
              color="#49C00E"
              :size="14"
              style="margin-right: 10px;cursor:pointer"
            />成功
          </i-col>
          <i-col span="20" v-if="editorMidalObj.status===1">
            <CommonIcon
              type="_iconfailure"
              color="#FF6B4E"
              :size="14"
              style="margin-right: 10px;cursor:pointer"
            />失败
          </i-col>
        </Row>
      </div>
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
      getAllImg: {
        DELETE: require('../../../assets/images/diary-handle/delete@2x.png'),
        OTHER: require('../../../assets/images/diary-handle/other@2x.png'),
        SAVE: require('../../../assets/images/diary-handle/save@2x.png'),
        UPDATE: require('../../../assets/images/diary-handle/update@2x.png'),
        DELETEMUTIL: require('../../../assets/images/diary-handle/deletemutil@2x.png'),
        GET: require('../../../assets/images/diary-handle/get@2x.png'),
        EXPORT: require('../../../assets/images/diary-handle/export@2x.png'),
        IMPORT: require('../../../assets/images/diary-handle/import@2x.png'),
        PRINT: require('../../../assets/images/diary-handle/print@2x.png'),
        LOGIN: require('../../../assets/images/diary-handle/login@2x.png'),
        GETALL: require('../../../assets/images/diary-handle/getall@2x.png'),
        LOGOUT: require('../../../assets/images/diary-handle/logout@2x.png')
      },
      styles: {
        'text-align': 'center',
        'margin-top': ' 20px'
      },
      logEditorModal: false,
      dataValue: '',
      spinShow: false,
      selectDataStore: [],
      traverseId: [],
      traverseIds: [],
      total: 0,
      obj: [],
      form: {
        operatortype: null,
        systemmodel: null,
        loginname: null,
        status: -1,
        currPage: Number,
        operatorBeginTime: null,
        operatorEndTime: null
      },
      editorMidalObj: {
        operatortypename: null,
        loginname: null,
        operlocation: null,
        operip: null,
        operurl: null,
        operparam: null,
        operTime: null,
        systemmodel: null,
        status: 0
      },

      operationTypestatus: [
        {
          label: '全部类型',
          value: ''
        },
        {
          label: '新增',
          value: 'SAVE'
        },
        {
          label: '其他  ',
          value: 'OTHER'
        },
        {
          label: '修改',
          value: 'UPDATE'
        },
        {
          label: '删除  ',
          value: 'DELETE'
        },
        {
          label: '批量删除',
          value: 'DELETEMUTIL'
        },
        {
          label: '详情  ',
          value: 'GET'
        },
        {
          label: '导出',
          value: 'EXPORT'
        },
        {
          label: '导入  ',
          value: 'IMPORT'
        },
        {
          label: '打印',
          value: 'PRINT'
        },
        {
          label: '查询列表  ',
          value: 'GETALL'
        },
        {
          label: '登录',
          value: 'LOGIN'
        },
        {
          label: '登出  ',
          value: 'LOGOIT'
        }
      ],

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
          title: '系统模块',
          align: 'center',
          key: 'systemmodel'
        },
        {
          title: '操作类型',
          align: 'center',
          slot: 'operatortype'
        },
        {
          title: '操作人员',
          align: 'center',
          key: 'loginname'
        },
        {
          title: '主机地址',
          align: 'center',
          key: 'operip'
        },
        {
          title: '操作地点',
          align: 'center',
          key: 'operlocation'
        },
        {
          title: '操作时间',
          align: 'center',
          key: 'operTime'
        },
        {
          title: '操作状态',
          align: 'center',
          slot: 'status'
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
    console.log(hasPermission('admin-diary-handle-del'));
    console.log(hasPermission('admin-diary-handle-empty'));
  },
  computed: {
    IEFlag () {
      return this.$store.state.app.IEFlag;
    }
  },
  methods: {
    // 删除权限
    delBtn () {
      return hasPermission('admin-diary-handle-del');
    },
    // 清空权限
    emptyBtn () {
      return hasPermission('admin-diary-handle-empty');
    },
    logEditor (obj) {
      this.editorMidalObj = {
        operatortypename: obj.operatortypename,
        loginname: obj.loginname,
        operlocation: obj.operlocation,
        operip: obj.operip,
        operparam: obj.operparam,
        operurl: obj.operurl,
        systemmodel: obj.systemmodel,
        operTime: obj.operTime,
        status: obj.status
      };
      this.logEditorModal = true;
    },
    // 加载数据
    operlogGetAll (arr) {
      this.spinShow = true;
      axios
        .request({
          url: 'core/operlog/getAll',
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
        this.form.operatorBeginTime = this.dataValue[0];
        this.form.operatorEndTime = this.dataValue[1];
        this.form.currPage = 1;
        this.total = 1;
        this.operlogGetAll(this.form);
      } else {
      }
    },
    handleChange (daterange) {
      this.dataValue = daterange;
    },
    // 重置
    resetClick () {
      this.form = {
        systemmodel: null,
        loginname: null,
        operatortype: null,
        status: -1,
        currPage: 0
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
              url: 'core/operlog/deleteAll',
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
      });
    },
    // 选中删除
    selectItem (selection, row) {
      this.selectDataStore.push(row);
    },
    cancelItem (selection, row) {
      this.selectDataStore.forEach((item, index) => {
        if (item.id === row.id) {
          // 这里我数据中regNo是唯一的，所以拿来做判断条件
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
                url: 'core/operlog/deletemutil',
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
