<!-- smartsoft created on 2018/09/07-->
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
        :title="modalTitle">
      <Form ref='menuForm' :model='menuForm' :rules='menuFormRule' :label-width='120'>
        <FormItem label='图标' prop='icon'>
          <Input v-model='menuForm.icon' :maxlength=30 placeholder='请输入Icon'/>
        </FormItem>
        <FormItem label='菜单名称' prop='name'>
          <Input v-model='menuForm.name' :maxlength=60 placeholder='请输入Name'/>
        </FormItem>
        <FormItem label='路由名称' prop='routerName'>
          <Input v-model='menuForm.routerName' :maxlength=60 placeholder='请输入RouterName'/>
        </FormItem>
        <FormItem label='父级菜单' prop='parentId'>
          <Select v-model="menuForm.parentId" clearable filterable >
            <Option v-for="item in parentList" :key="item.id" :value="item.id" :label="item.name"></Option>
          </Select>
        </FormItem>
        <FormItem label='链接地址' prop='linkUrl'>
          <Input v-model='menuForm.linkUrl' :maxlength=200 placeholder='请输入LinkUrl'/>
        </FormItem>
        <FormItem label='权限' prop='permissionId'>
          <Select v-model="menuForm.permissionId" filterable clearable>
            <Option v-for="item in permissionList" :key="item.id" :value="item.id" :label="item.name"></Option>
          </Select>
        </FormItem>
        <FormItem label='状态' prop='status'>
          <InputNumber v-model='menuForm.status'/>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button @click="handleReset()" style="margin-left: 8px">取消</Button>
        <Button type="primary" :loading="isSaving" @click="handleSubmit()">保存</Button>
      </div>
    </Modal>

    <Modal v-model="deleteModal" width="360">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="information-circled"></Icon>
        <span>删除menu</span>
      </p>
      <div style="text-align:center">
        <p>删除该menu，将无法恢复！</p>
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
    name: 'menu',
    data() {
      return {
        menuForm: {
          icon: undefined,
          name: undefined,
          routerName: undefined,
          linkUrl: undefined,
          status: 1,
          parentId:undefined,
          permissionId: undefined,
        },
        menuFormRule: {
          icon: [
            {required: true, message: '图标不能为空.', trigger: 'blur'},
            {type: 'string', max: 30, message: '图标最多30字符', trigger: 'blur'},
          ],
          name: [
            {required: true, message: '菜单不能为空.', trigger: 'blur'},
            {type: 'string', max: 60, message: '菜单最多60字符', trigger: 'blur'},
          ],
          routerName: [
            {required: true, message: '路由名称不能为空.', trigger: 'blur'},
            {type: 'string', max: 60, message: '路由名称最多60字符', trigger: 'blur'},
          ],
          linkUrl: [
            {type: 'string', max: 200, message: '链接地址最多200字符', trigger: 'blur'},
          ],
          status: [
            {type: 'number', required: true, message: '状态不能为空.', trigger: 'blur'},
          ],
        },
        loading: false,
        keepalive: false,
        isSaving: false,
        isDeleting: false,
        pageInfo: {},
        modalTitle:'',
        editModal: false,
        permissionList:[],
        parentList:[],
        deleteModal: false,
        deleteIndex: '',
        columns: [
          {type: 'index', title: '序号', width: 60, align: 'center'},
          {title: '图标', key: 'icon', align: 'center'},
          {title: '菜单名称', key: 'name', align: 'center'},
          {title: '路由名称', key: 'routerName', align: 'center'},
          {title: '链接地址', key: 'linkUrl', align: 'center'},
          {title: '状态', key: 'status', align: 'center'},
          {
            title: '权限', key: 'permission', align: 'center',
            render:(h,params)=>{
              return h('span',params.row.permissionList[0]?params.row.permissionList[0].name:'')
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
        data: []
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
        this.$http.get('/menu', params).then((res) => {
          self.loading = false;
          if (res.code === 200) {
            const result = res.data;
            self.data = result && result.list;
            self.pageInfo.total = result && result.total;
          } else {
            self.$Message.error('获取数据失败！' + res.code);
          }

        })
      },

      getPermissionList(){
        const self = this;
        this.$http.get('/permission').then((res) =>{
          if (res.code === 200){
            self.permissionList = res.data.list;
          }
        })
      },

      getParentList(){
        const self = this;
        this.$http.get('/menu/parentList').then((res) =>{
          if (res.code === 200){
            self.parentList = res.data;
          }
        })
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
        this.getParentList();
        this.$refs.menuForm.resetFields();
        this.modalTitle = '添加菜单';
        this.menuForm = {
          icon: undefined,
          name: undefined,
          routerName: undefined,
          linkUrl: undefined,
          status: 1,
          parentId:undefined,
          permissionId:undefined,
        };
        this.editModal = true;
      },

      edit(index) {
        this.isSaving = false;
        const self = this;
        this.modalTitle = '编辑菜单';
        this.getParentList();
        this.$refs.menuForm.resetFields();
        this.editModal = true;
        this.$http.get('/menu/findMenuDetial/' + self.data[index].id, {}).then((res) => {
          if (res.code === 200) {
            self.menuForm = res.data;
          } else {
            self.$Message.error('获取menu失败！' + res.code);
          }

        });
      },

      handleSubmit() {
        this.isSaving = true;
        let self = this;
        this.$refs.menuForm.validate((valid) => {
          if (valid) {
            if (this.menuForm.id) {
              this.$http.put('/menu/updateMenu', self.menuForm).then((res) => {
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
              this.$http.post('/menu/addMenu', self.menuForm).then((res) => {
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
        this.$http.delete('/menu/deleteMenu/' + self.data[self.deleteIndex].id, {}).then((res) => {
          if (res.code === 200) {
            self.isDeleting = false;
            self.deleteModal = false;
            self.reloadList();
            self.$Message.success('删除成功！');
          } else {
            self.$Message.error('删除失败！' + res.code);
          }
        });
      }
    },

    created() {
      this.getList();
      this.getPermissionList();
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
