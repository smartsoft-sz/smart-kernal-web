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
      width="700"
      :loading="isSaving"
      @on-ok="handleSubmit"
      @on-cancel="handleReset"
      ok-text="保存"
      cancel-text="取消"
      :title="modalTitle"
      :styles="{top:'20px'}">
      <Form ref='emailTemplateForm' :model='emailTemplateForm' :rules='emailTemplateFormRule' :label-width='95'>
				<FormItem label='模板编号：' prop='templateId'>
					<Input v-model='emailTemplateForm.templateId' :maxlength=50 placeholder='请输入模板编号：' style="width: 530px;"/>
				</FormItem>
        <FormItem label='发件人：' prop='templateFromName'>
        <Input v-model='emailTemplateForm.templateFromName' type="text" style="width: 530px;"
               :maxlength=255 placeholder='请输入发件人...'/>
        </FormItem>
        <FormItem label='发件人邮箱：' prop='templateFrom'>
        <Input v-model='emailTemplateForm.templateFrom' :autosize='{minRows: 2,maxRows: 5}' type='textarea'
               :maxlength=255 placeholder='请输入发件人邮箱...' style="width: 530px;"/>
        </FormItem>
        <FormItem label='抄送：' prop='templateCc'>
          <Input v-model='emailTemplateForm.templateCc' :autosize='{minRows: 2,maxRows: 5}' style="width: 530px;"
                 type='textarea' :maxlength=255 placeholder='请输入抄送...' />
          <p style="color: #9ea7b4">如果有多个抄送人，请用<span style="color: red">；</span>隔开</p>
        </FormItem>
        <FormItem label='密送：' prop='templateBcc'>
          <Input v-model='emailTemplateForm.templateBcc' :autosize='{minRows: 2,maxRows: 5}' style="width: 530px;"
                 type='textarea'  :maxlength=255 placeholder='请输入密送...'/>
        </FormItem>
        <FormItem label='主题：' prop='templateSubject'>
          <Input v-model='emailTemplateForm.templateSubject' :maxlength=255 placeholder='请输入主题：' style="width: 530px;"/>
        </FormItem>
        <FormItem label='描述：' prop='description'>
          <Input v-model='emailTemplateForm.description' :autosize='{minRows: 2,maxRows: 5}' style="width: 530px;"
                 type='textarea'  :maxlength=200 placeholder='请输入描述...'/>
        </FormItem>
        <FormItem label='正文：' prop='content'>
          <tinymce v-model='emailTemplateForm.content'  :maxlength=14000  v-if="editModal" style="width: 530px;"
                   id="tinymceEditer" ></tinymce>
        </FormItem>

				<!--<FormItem label='参数：' prop='parameter'>-->
					<!--<Input v-model='emailTemplateForm.parameter' :maxlength=255 placeholder='请输入参数：'/>-->
				<!--</FormItem>-->
				<!--<FormItem label='收件人：' prop='templateTo'>-->
					<!--<Input v-model='emailTemplateForm.templateTo' :maxlength=255 placeholder='请输入收件人：'/>-->
				<!--</FormItem>-->
			</Form>
			<div slot="footer">
				<Button @click="handleReset()" style="margin-left: 8px">取消</Button>
				<Button type="primary" :loading="isSaving" @click="handleSubmit()">保存</Button>
			</div>
    </Modal>

    <Modal v-model="deleteModal" width="360">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="information-circled"></Icon>
        <span>删除emailTemplate</span>
      </p>
      <div style="text-align:center">
        <p>删除该emailTemplate，将无法恢复！</p>
        <p>是否删除?</p>
      </div>
      <div slot="footer">
        <Button type="error" size="large" long :loading="isDeleting" @click="deleteItem">删除</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
  import tinymce from '../shared/tinymce.vue';
export default {
  name: 'emailTemplate',
  components: { tinymce },
  data() {
    return {
      emailTemplateForm: {
				templateId: undefined, 
				description: undefined, 
				content: undefined, 
//				parameter: undefined,
				templateSubject: undefined, 
				templateFrom: undefined, 
				templateFromName: undefined, 
//				templateTo: undefined,
				templateCc: undefined, 
				templateBcc: undefined, 
			},
      emailTemplateFormRule: {
				templateId: [
					{ required: true, message: '模板编号：不能为空.', trigger: 'blur' }, 
					{ type: 'string', max: 50, message: '模板编号：最多50字符', trigger: 'blur' }, 
				], 
				description: [
					{ type: 'string', max: 200, message: '描述：最多200字符', trigger: 'blur' }, 
				], 
				content: [
					{ type: 'string', max: 255, message: '正文：最多255字符', trigger: 'blur' }, 
				], 
				parameter: [
					{ type: 'string', max: 255, message: '参数：最多255字符', trigger: 'blur' }, 
				], 
				templateSubject: [
					{ type: 'string', max: 255, message: '主题：最多255字符', trigger: 'blur' }, 
				], 
				templateFrom: [
					{ type: 'string', max: 255, message: '发件人邮箱：最多255字符', trigger: 'blur' }, 
				], 
				templateFromName: [
					{ type: 'string', max: 255, message: '发件人：最多255字符', trigger: 'blur' }, 
				], 
				templateTo: [
					{ type: 'string', max: 255, message: '收件人：最多255字符', trigger: 'blur' }, 
				], 
				templateCc: [
					{ type: 'string', max: 255, message: '抄送：最多255字符', trigger: 'blur' }, 
				], 
				templateBcc: [
					{ type: 'string', max: 255, message: '密送：最多255字符', trigger: 'blur' }, 
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
      columns: [
        { type: 'index', title: '序号', width: 70, align: 'center' },
  			{ title: '模板编号：', key: 'templateId', align: 'center' },
        { title: '发件人：', key: 'templateFromName', align: 'center' },
  			{ title: '发件人邮箱：', key: 'templateFrom', align: 'center' },
        { title: '主题：', key: 'templateSubject', align: 'center' },
        { title: '描述：', key: 'description', align: 'center' },
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
        size: this.pageInfo.pageSize || 10
      };
      this.$http.get('/emailTemplate', params).then((res) => {
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
      this.modalTitle = '添加邮箱模板';
      this.$refs.emailTemplateForm.resetFields();
      this.emailTemplateForm = {
				templateId: undefined, 
				description: undefined, 
				content: undefined, 
				parameter: undefined, 
				templateSubject: undefined, 
				templateFrom: undefined, 
				templateFromName: undefined, 
				templateTo: undefined, 
				templateCc: undefined, 
				templateBcc: undefined, 
			};
      this.editModal = true;
    },

    edit(index) {
      this.isSaving = false;
      const self = this;
      this.modalTitle = '编辑邮箱模板';
      this.$refs.emailTemplateForm.resetFields();
      this.editModal = true;
      this.$http.get('/emailTemplate/' + self.data[index].id, {}).then((res) => {
        if (res.code === 200) {
          self.emailTemplateForm = res.data;
        } else {
          self.$Message.error('获取emailTemplate失败！' + res.code);
        }

      });
    },

    handleSubmit() {
      this.isSaving = true;
      let self = this;
      this.$refs.emailTemplateForm.validate((valid) => {
        if (valid) {
          if (this.emailTemplateForm.id) {
            this.$http.put('/emailTemplate', self.emailTemplateForm).then((res) => {
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
            this.$http.post('/emailTemplate', self.emailTemplateForm).then((res) => {
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
      this.$http.delete('/emailTemplate/' + self.data[self.deleteIndex].id, {}).then((res) => {
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
