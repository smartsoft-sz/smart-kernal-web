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
          <Input class="pull-right" v-model="searchModel"
               icon="ios-search" placeholder="搜索..." style="width: 200px" @on-enter="reloadList"/>
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
      width="500"
      :loading="isSaving"
      @on-ok="handleSubmit"
      @on-cancel="handleReset"
      ok-text="保存"
      cancel-text="取消"
      :title="modalTitle">
      <Form ref='resourceForm' :model='resourceForm' :rules='resourceFormRule' :label-width='120'>
        <FormItem label='名称:' prop='name'>
          <Input v-model='resourceForm.name' :maxlength=150 placeholder='请输入名称' style="width: 250px"/>
        </FormItem>
        <FormItem label='路径:' prop='url'>
          <Input v-model='resourceForm.url' :maxlength=255 placeholder='请输入路径' style="width: 250px"/>
        </FormItem>
        <FormItem label='请求类型:' prop='requestMethod'>
          <Input v-model='resourceForm.requestMethod' :maxlength=10  style="width: 250px"
                 placeholder='请输入请求类型'/>
        </FormItem>
        <FormItem label='类型:' prop='type'>
          <Input v-model='resourceForm.type' :maxlength=30 placeholder='请输入类型' style="width: 250px"/>
        </FormItem>
        <FormItem label='核查类型:' prop='checkType'>
          <InputNumber v-model='resourceForm.checkType' :min="0" />
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
        <span>删除resource</span>
      </p>
      <div style="text-align:center">
        <p>删除该resource，将无法恢复！</p>
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
  name: 'resource',
  data() {
    return {
      searchModel: undefined,
      resourceForm: {
        name: undefined,
        url: undefined,
        requestMethod: undefined,
        type: undefined,
        checkType: 1,
			},
      resourceFormRule: {
				name: [
					{ type: 'string', max: 150, message: '名称最多150字符', trigger: 'blur' }, 
				], 
				url: [
					{ required: true, message: 'url不能为空.', trigger: 'blur' }, 
					{ type: 'string', max: 255, message: 'url最多255字符', trigger: 'blur' }, 
				],
        requestMethod: [
					{ required: true, message: 'requestMethod不能为空.', trigger: 'blur' }, 
					{ type: 'string', max: 10, message: 'requestMethod最多10字符', trigger: 'blur' }, 
				],
        type: [
					{ required: true, message: 'type不能为空.', trigger: 'blur' }, 
					{ type: 'string', max: 30, message: 'type最多30字符', trigger: 'blur' }, 
				],
        checkType: [
					{ type: 'number', required: true, message: 'checkType不能为空.', trigger: 'blur' }, 
				], 
			},
      loading: false,
      keepalive: false,
      isSaving: false,
      modalTitle: '',
      isDeleting: false,
      pageInfo: {},
      editModal: false,
      deleteModal: false,
      deleteIndex: '',
      columns: [
        { type: 'index', title: '序号', width: 60, align: 'center' },
  			{ title: '名称', key: 'name', align: 'center' },
  			{ title: '路径', key: 'url', align: 'center' },
  			{ title: '方法', key: 'requestMethod', align: 'center' },
  			{ title: '类型', key: 'type', align: 'center' },
  			{ title: '检查类型', key: 'checkType', align: 'center' },
				{ title: '操作',
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
        size: this.pageInfo.pageSize || 10,
        keyword: this.searchModel,
      };
      this.$http.get('/resource/filter', params).then((res) => {
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
      this.modalTitle = '新建resource';
      this.$refs.resourceForm.resetFields();
      this.resourceForm = {
        name: undefined,
        url: undefined,
        requestMethod: undefined,
        type: undefined,
        checkType: 1,
			};
      this.editModal = true;
    },

    edit(index) {
      this.isSaving = false;
      const self = this;
      this.modalTitle = '编辑resource';
      this.$refs.resourceForm.resetFields();
      this.editModal = true;
      this.$http.get('/resource/' + self.data[index].id, {}).then((res) => {
        if (res.code === 200) {
          self.resourceForm = res.data;
        } else {
          self.$Message.error('获取resource失败！' + res.data.code);
        }

      });
    },

    handleSubmit() {
      this.isSaving = true;
      let self = this;
      this.$refs.resourceForm.validate((valid) => {
        if (valid) {
          if (this.resourceForm.id) {
            this.$http.put('/resource', self.resourceForm).then((res) => {
              if (res.code === 200) {
                self.isSaving = false;
                self.editModal = false;
                self.reloadList();
                self.$Message.success('更新成功！');
              } else {
                self.$Message.error('更新失败！' + res.data.code);
              }
            })
          } else {
            this.$http.post('/resource', self.resourceForm).then((res) => {
              if (res.code === 200) {
                self.isSaving = false;
                self.editModal = false;
                self.reloadList();
                self.$Message.success('添加成功！');
              } else {
                self.$Message.error('添加失败！' + res.data.code);
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
      this.$http.delete('/resource/' + self.data[self.deleteIndex].id, {}).then((res) => {
        if (res.code === 200) {
          self.isDeleting = false;
          self.deleteModal = false;
          self.reloadList();
          self.$Message.success('删除成功！');
        } else {
          self.$Message.error('删除失败！'+res.data.code);
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
