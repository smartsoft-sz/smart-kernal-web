<!-- smartsoft created on 2018/09/15-->
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
      width="550"
      :loading="isSaving"
      @on-ok="handleSubmit"
      @on-cancel="handleReset"
      ok-text="保存"
      cancel-text="取消"
      :title="modalTitle"
      :styles="{top:'20px'}">
      <Form ref='ParameterForm' :model='ParameterForm' :rules='ParameterFormRule' :label-width='120'>
				<FormItem label='code' prop='code'>
					<Input v-model='ParameterForm.code' :maxlength=30 placeholder='请输入code' style="width: 300px" />
				</FormItem>
				<FormItem label='名称' prop='name'>
					<Input v-model='ParameterForm.name' :maxlength=50 placeholder='请输入名称' style="width: 300px" />
				</FormItem>
				<FormItem label='值' prop='value'>
					<Input v-model='ParameterForm.value' :maxlength=255 placeholder='请输入值' style="width: 300px" />
				</FormItem>
				<FormItem label='值类型' prop='valueType'>
					<Input v-model='ParameterForm.valueType' :maxlength=10 placeholder='请输入值类型' style="width: 300px" />
				</FormItem>
				<FormItem label='描述' prop='description'>
					<Input v-model='ParameterForm.description' :maxlength=255 placeholder='请输入描述' style="width: 300px" />
				</FormItem>
				<FormItem label='func_code' prop='funcCode'>
					<Input v-model='ParameterForm.funcCode' :maxlength=255 placeholder='请输入func_code' style="width: 300px" />
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
        <span>删除Parameter</span>
      </p>
      <div style="text-align:center">
        <p>删除该Parameter，将无法恢复！</p>
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
  name: 'Parameter',
  data() {
    return {
      ParameterForm: {
				code: undefined, 
				name: undefined, 
				value: undefined, 
				valueType: undefined, 
				description: undefined, 
				funcCode: undefined, 
			},
      ParameterFormRule: {
				code: [
					{ required: true, message: 'code不能为空.', trigger: 'blur' }, 
					{ type: 'string', max: 30, message: 'code最多30字符', trigger: 'blur' }, 
				], 
				name: [
					{ required: true, message: '名称不能为空.', trigger: 'blur' }, 
					{ type: 'string', max: 50, message: '名称最多50字符', trigger: 'blur' }, 
				], 
				value: [
					{ required: true, message: '值不能为空.', trigger: 'blur' }, 
					{ type: 'string', max: 255, message: '值最多255字符', trigger: 'blur' }, 
				], 
				valueType: [
					{ required: true, message: '值类型不能为空.', trigger: 'blur' }, 
					{ type: 'string', max: 10, message: '值类型最多10字符', trigger: 'blur' }, 
				], 
				description: [
					{ type: 'string', max: 255, message: '描述最多255字符', trigger: 'blur' }, 
				], 
				funcCode: [
					{ required: true, message: 'func_code不能为空.', trigger: 'blur' }, 
					{ type: 'string', max: 255, message: 'func_code最多255字符', trigger: 'blur' }, 
				], 
			},
      loading: false,
      keepalive: false,
      isSaving: false,
      isDeleting: false,
      modalTitle: '',
      pageInfo: {},
      editModal: false,
      deleteModal: false,
      deleteIndex: '',
      columns: [ { type: 'index', title: '序号', width: 60, align: 'center' },
  			{ title: 'code', key: 'code' },
  			{ title: '名称', key: 'name' },
  			{ title: '值', key: 'value' },
  			{ title: '值类型', key: 'valueType' },
  			{ title: '描述', key: 'description' },
  			{ title: 'Func_Code', key: 'funcCode' },
				{ title: '操作', align: 'center', key: 'handle', render: (h, params) => { return this.$render.renderEditDel(this, h, params); } } 
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
      this.$http.get('/parameter', params).then((res) => {
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
      this.modalTitle = '添加参数';
      this.$refs.ParameterForm.resetFields();
      this.ParameterForm = {
				code: undefined, 
				name: undefined, 
				value: undefined, 
				valueType: undefined, 
				description: undefined, 
				funcCode: undefined, 
			};
      this.editModal = true;
    },

    edit(index) {
      this.isSaving = false;
      const self = this;
      this.$refs.ParameterForm.resetFields();
      this.modalTitle = '编辑参数';
      this.editModal = true;
      this.$http.get('/parameter/' + self.data[index].id, {}).then((res) => {
        if (res.code === 200) {
          self.ParameterForm = res.data;
        } else {
          self.$Message.error('获取Parameter失败！' + res.code);
        }

      });
    },

    handleSubmit() {
      this.isSaving = true;
      let self = this;
      this.$refs.ParameterForm.validate((valid) => {
        if (valid) {
          if (this.ParameterForm.id) {
            this.$http.put('/parameter', self.ParameterForm).then((res) => {
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
            this.$http.post('/parameter', self.ParameterForm).then((res) => {
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
      this.$http.delete('/parameter/' + self.data[self.deleteIndex].id, {}).then((res) => {
        if (res.code === 200) {
          self.isDeleting = false;
          self.deleteModal = false;
          self.reloadList();
          self.$Message.success('删除成功！');
        } else {
          self.$Message.error('删除失败！'+res.code);
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
