<!-- smartsoft created on 2018/09/14-->
<style lang="less">
  @import '../../styles/common.less';

</style>

<template>
  <div class="smart-crud-container">

    <div class="smart-crud-top">
      <Row>
        <Col span="24">
        <Button class="" type="primary" @click="add">添加</Button>
        </Col>
      </Row>
    </div>
    <br>
    <div class="smart-crud-bottom">
      <Row>
        <Col span="24">
        <Table :loading="loading" :columns="columns" :data="data"></Table>

        <div style="margin: 10px;overflow: hidden">
          <div style="float: right;">
            <Page v-model="pageInfo"
                  :current="pageInfo.pageNum"
                  :total="pageInfo.total"
                  :page-size="pageInfo.pageSize"
                  size="small"
                  :page-size-opts="[5,10,15]"
                  @on-change="changePage"
                  @on-page-size-change="changePageSize"
                  show-elevator
                  show-sizer
                  show-total></Page>
          </div>
        </div>
        </Col>
      </Row>
    </div>

    <Modal
        v-model="editModal"
        width="700"
        :loading="isSaving"
        @on-ok="handleSubmit"
        @on-cancel="handleReset"
        ok-text="保存"
        cancel-text="取消"
        :title="modalTitle"
        :styles="{top:'20px'}">
      <Form ref='permissionForm' :model='permissionForm' :rules='permissionFormRule' :label-width='50'>
        <FormItem label='名称' prop='name'>
          <Input v-model='permissionForm.name' :maxlength=150 placeholder='请输入名称'/>
        </FormItem>
        <FormItem label='描述' prop='description'>
          <Input v-model='permissionForm.description' :maxlength=300 placeholder='请输入描述'/>
        </FormItem>
        <Input v-model="searchModel"
               icon="ios-search" placeholder="根据路径或者名字搜索..."
               style="width: 200px;margin-left: 468px;margin-bottom: 10px;" @on-enter="reloadresourceList"/>
        <Table stripe border :loading="resourceLoading" ref="selection" :columns="resourceColumns" :data="resourceList"
               @on-selection-change="getCheckList"/>
        <div style="margin: 10px;overflow: hidden">
          <div style="float: right;">
            <Page v-model="resourcePageInfo"
                  :current="resourcePageInfo.pageNum"
                  :total="resourcePageInfo.total"
                  :page-size="resourcePageInfo.pageSize"
                  size="small"
                  :page-size-opts="[5,10,15]"
                  @on-change="changeResourcePage"
                  @on-page-size-change="changeResourcePageSize"
                  show-elevator
                  show-sizer
                  show-total></Page>
          </div>
        </div>
      </Form>
      <div slot="footer">
        <Button @click="handleReset()" style="margin-left: 8px">取消</Button>
        <Button type="primary" :loading="isSaving" @click="handleSubmit()">保存</Button>
      </div>
    </Modal>

    <Modal v-model="deleteModal" width="360">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="information-circled"></Icon>
        <span>删除permission</span>
      </p>
      <div style="text-align:center">
        <p>删除该permission，将无法恢复！</p>
        <p>是否删除?</p>
      </div>
      <div slot="footer">
        <Button type="error" size="large" long :loading="isDeleting" @click="deleteItem">删除</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
  export default {
    name: 'permission',
    data() {
      return {
        searchModel: undefined,
        permissionForm: {
          name: undefined,
          description: undefined,
          resourceIds: [],
        },
        permissionFormRule: {
          name: [
            { type: 'string', max: 150, message: '名称最多150字符', trigger: 'blur' },
          ],
          type: [
            { required: true, message: '类型不能为空.', trigger: 'blur' },
            { type: 'string', max: 30, message: '类型最多30字符', trigger: 'blur' },
          ],
          description: [
            { required: true, message: '描述不能为空.', trigger: 'blur' },
            { type: 'string', max: 300, message: '描述最多300字符', trigger: 'blur' },
          ],
        },
        loading: false,
        keepalive: false,
        isSaving: false,
        isDeleting: false,
        pageInfo: {},
        resourcePageInfo: {},
        resourceList: [],
        checkList: [],
        resourceLoading: false,
        modalTitle: '',
        editModal: false,
        deleteModal: false,
        deleteIndex: '',
        columns: [{ type: 'index', title: '序号', width: 60, align: 'center' },
          { title: '名称', key: 'name', align: 'center' },
          { title: '描述', key: 'description', align: 'center' },
          { title: '类型', key: 'type', align: 'center' },
          {
            title: '权限',
key: 'resource',
align: 'center',
            render: (h, params) => {
              if (params.row.resourceList !== null && params.row.resourceList.length > 0) {
                let s = '';
                for (let i = 0; i < params.row.resourceList.length; i++) {
                  if (i === params.row.resourceList.length - 1) {
                    s += params.row.resourceList[i].name;
                  } else {
                    s += params.row.resourceList[i].name + ',';
                  }
                }
                return h('span', s);
              } else {
                return h('span', '错误数据')
              }
            }
          },
          {
            title: '操作',
align: 'center',
key: 'handle',
render: (h, params) => {
            return this.$render.renderEditDel(this, h, params);
          }
          }
        ],
        data: [],
        resourceColumns: [
          { type: 'selection', width: 60, align: 'center' },
          { title: '名称', key: 'name', align: 'center' },
          { title: '路径', key: 'url', align: 'center' },
          { title: '方法类型', key: 'requestMethod', align: 'center', width: 100 },
        ],
      }
    },
    methods: {
      getList() {
        this.loading = true;
        const self = this;
        const params = {
          page: this.pageInfo.pageNum || 1,
          size: this.pageInfo.pageSize || 10
        };
        this.$http.get('/permission/pageList', params).then((res) => {
          self.loading = false;
          if (res.code === 200) {
            const result = res.data;
            self.data = result && result.list;
            self.pageInfo.total = result && result.total;
          } else {
            self.$Message.error('获取数据失败！' + res.data.code);
          }

        })
      },

      getResourceList() {
        const self = this;
        this.resourceLoading = true;
        const params = {
          page: this.resourcePageInfo.pageNum || 1,
          size: this.resourcePageInfo.pageSize || 10,
          keyword: this.searchModel,
        };
        this.$http.get('/resource/filter', params).then((res) => {
          self.resourceLoading = false;
          if (res.code === 200) {
            self.resourceList = res.data.list;
            self.resourceList.map(item => {
              for (let i = 0; i < self.checkList.length; i++) {
                if (item.id === self.checkList[i]) {
                  item._checked = true;
                }
              }
            });
            self.resourcePageInfo.total = res.data.total;
          } else {
            self.$Message.error('获取数据失败！' + res.data.code);
          }
        })

      },

      reloadresourceList() {
        this.resourcePageInfo.pageNum = 1;
        this.getResourceList();
      },

      getCheckList(selection) {
        const self = this;
        let a = [];
        this.checkList.map(item => {
          let f = true;
          for (let i = 0; i < self.resourceList.length; i++) {
            if (item === self.resourceList[i].id) {
              f = false;
            }
          }
          if (f) {
            a.push(item);
          }
        });
        selection.map(item => {
          a.push(item.id);
        });
        self.checkList = a;
      },

      changeResourcePage(currentPage) {
        this.resourcePageInfo.pageNum = currentPage;
        this.getResourceList();
      },

      changeResourcePageSize(pageSize) {
        this.resourcePageInfo.pageSize = pageSize;
        this.getResourceList();
      },

      reloadList() {
        this.pageInfo.pageNum = 1;
        this.getList();
      },

      changePage(currentPage) {
        this.pageInfo.pageNum = currentPage;
        this.getList();
      },

      changePageSize(pageSize) {
        this.pageInfo.pageSize = pageSize;
        this.getList();
      },

      add() {
        this.isSaving = false;
        this.modalTitle = '添加权限';
        this.$refs.permissionForm.resetFields();
        this.permissionForm = {
          name: undefined,
          description: undefined,
          resourceIds: [],
        };
        this.checkList = [];
        this.getResourceList();
        this.editModal = true;
      },

      edit(index) {
        this.isSaving = false;
        const self = this;
        this.$refs.permissionForm.resetFields();
        this.modalTitle = '编辑权限';
        this.editModal = true;
        this.$http.get('/permission/detailInfo/' + self.data[index].id, {}).then((res) => {
          if (res.code === 200) {
            self.permissionForm = res.data;
            self.checkList = self.permissionForm.resourceIds;
            self.getResourceList();
          } else {
            self.$Message.error('获取permission失败！' + res.data.code);
          }

        });
      },

      handleSubmit() {
        this.isSaving = true;
        let self = this;
        this.$refs.permissionForm.validate((valid) => {
          if (valid) {
            if (self.checkList.length > 0) {
              this.permissionForm.resourceIds = self.checkList;
              if (this.permissionForm.id) {
                this.$http.put('/permission/updatePermission', self.permissionForm).then((res) => {
                  if (res.code === 200) {
                    self.isSaving = false;
                    self.editModal = false;
                    self.reloadList();
                    self.$Message.success('更新成功！');
                  } else {
                    self.$Message.error('更新失败！' + res.code);
                  }
                })
              } else {
                this.$http.post('/permission/addPermission', self.permissionForm).then((res) => {
                  if (res.code === 200) {
                    self.isSaving = false;
                    self.editModal = false;
                    self.reloadList();
                    self.$Message.success('添加成功！');
                  } else {
                    self.$Message.error('添加失败！' + res.code);
                  }
                })
              }
            } else {
              self.$Message.error('请选择需要添加的路径');
            }
          } else {
            self.isSaving = false;
            self.$Message.error('表单验证失败！');
          }
        })
      },
      handleReset() {
        this.editModal = false;
        console.log('handleReset');
      },
      remove(index) {
        this.deleteModal = true;
        this.deleteIndex = index;
        this.isDeleting = false;
      },
      deleteItem() {
        this.isDeleting = true;
        const self = this;
        this.$http.delete('/permission/deletePermission/' + self.data[self.deleteIndex].id, {}).then((res) => {
          if (res.code === 200) {
            self.isDeleting = false;
            self.deleteModal = false;
            self.reloadList();
            self.$Message.success('删除成功！');
          } else {
            self.$Message.error('删除失败！' + res.data.code);
          }
        });
      }
    },

    created() {
      this.getList();
    },

    activated() {
      if (this.keepalive) {
        this.keepalive = false;
        this.getList();
      }
    },

    deactivated() {
      this.keepalive = true;
    }

  }

</script>
