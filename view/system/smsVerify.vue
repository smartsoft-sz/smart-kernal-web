<!-- smartsoft created on 2018/09/14-->
<style lang="less">
  @import '../../styles/common.less';

</style>

<template>
  <div class="smart-crud-container">

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
      title="编辑smsVerify">
      <Form ref='smsVerifyForm' :model='smsVerifyForm'  :label-width='120'>
				<FormItem label='手机' prop='mobile'>
          <span>{{smsVerifyForm.mobile}}</span>
				</FormItem>
				<FormItem label='验证短信' prop='verifyCode'>
          <span>{{smsVerifyForm.verifyCode}}</span>
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
        <span>删除smsVerify</span>
      </p>
      <div style="text-align:center">
        <p>删除该smsVerify，将无法恢复！</p>
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
  name: 'smsVerify',
  data() {
    return {
      smsVerifyForm: {
				mobile: undefined,
        verifyCode: undefined,
			},
      loading: false,
      keepalive: false,
      isSaving: false,
      isDeleting: false,
      pageInfo: {},
      editModal: false,
      deleteModal: false,
      deleteIndex: '',
      columns: [ { type: 'index', title: '序号', width: 60, align: 'center' },
  			{ title: '手机', key: 'mobile' },
  			{ title: '验证短信', key: 'verifyCode' },
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
      this.$http.get('/smsVerify', params).then((res) => {
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

    edit(index) {
      this.isSaving = false;
      const self = this;
      this.$refs.smsVerifyForm.resetFields();
      this.editModal = true;
      this.$http.get('/smsVerify/' + self.data[index].id, {}).then((res) => {
        if (res.code === 200) {
          self.smsVerifyForm = res.data;
        } else {
          self.$Message.error('获取smsVerify失败！' + res.data.code);
        }

      });
    },

    handleSubmit() {
      this.isSaving = true;
      let self = this;
      this.$refs.smsVerifyForm.validate((valid) => {
        if (valid) {
          if (this.smsVerifyForm.id) {
            this.$http.put('/smsVerify', self.smsVerifyForm).then((res) => {
              if (res.code === 200) {
                self.isSaving = false;
                self.editModal = false;
                self.reloadList();
                self.$Message.success('更新成功！');
              } else {
                self.$Message.error('更新失败！' + res.data.code);
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
      this.$http.delete('/smsVerify/' + self.data[self.deleteIndex].id, {}).then((res) => {
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
