<!-- smartsoft created on 2018/09/14-->
<style lang="less">
  @import '../../styles/common.less';
  @import 'smsConfig.less';

</style>

<template>
  <div class="smsConfig">
    <Row>
      <Col span="24">
      <Card style="box-shadow: -2px 2px 10px rgba(66,66,66,0.09)">
        <div>
          <Form
              ref="smsForm"
              :model="smsForm"
              :label-width="150"
              label-position="right"
              :rules="inforValidate">

            <FormItem label="Access-key-id：" prop="accessKeyId">
              <div style="display:inline-block;width:300px;">
                <Input v-model="smsForm.accessKeyId" placeholder="enter a Access-key-id"></Input>
              </div>
            </FormItem>
            <FormItem label="Acess-key-secret：" prop="accessKeySecret">
              <div style="display:inline-block;width:300px;">
                <Input v-model="smsForm.accessKeySecret" placeholder="enter a Acess-key-secret"></Input>
              </div>
            </FormItem>
            <FormItem label="Sign-name：" prop="signName">
              <div style="display:inline-block;width:300px;">
                <Input v-model="smsForm.signName" placeholder="enter a Sign-name"></Input>
              </div>
            </FormItem>
            <FormItem label="send-type：" prop="sendType">
              <div style="display:inline-block;width:300px;">
                <Input v-model="smsForm.sendType" placeholder="enter a send-type"></Input>
              </div>
            </FormItem>
            <div>
              <div class="submit-button" style="display: inline-block;">
                <Button type="primary" style="width: 100px;margin-left: 69px" :loading="save_loading" @click="saveEdit">
                  保存
                </Button>
              </div>
              <Button type="primary" class="right-button" :loading="test_loading" @click="smsTest">短信测试
              </Button>
            </div>
          </Form>
        </div>
      </Card>
      </Col>
    </Row>

    <Modal
        v-model="smsTestModel"
        title="接收号码">
      <Form ref='sendSmsForm' :model='sendSmsForm' :rules='smsFormRule' :label-width='120' style="width: 450px">
        <FormItem label="手机号" prop="recievePhone">
          <div style="display: inline-block; width:300px;">
            <Input v-model='sendSmsForm.recievePhone' placeholder='请输入手机号'/>
          </div>
        </FormItem>
        <FormItem label="模板代码" prop="templateParameter">
          <div style="display: inline-block; width:300px;">
            <Input v-model='sendSmsForm.templateParameter' placeholder='请输入模板CODE'/>
          </div>
        </FormItem>
      </Form>
      <div slot="footer">
        <Spin fix v-if="editLoading">
          <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
          <div>加载中...</div>
        </Spin>
        <Button @click="handleReset()" style="margin-left: 8px">取消</Button>
        <Button type="success" :loading="isSending" @click="handleSend()">发送</Button>
      </div>

    </Modal>
  </div>
</template>
<script>
export default {
  name: 'smsConfig',
  data() {
    return {
      smsForm: {
        accessKeyId: '',
        accessKeySecret: '',
        signName: '',
        sendType: '',
      },
      inforValidate: {
        accessKeyId: [
          { required: true, message: 'ACCESS-KEY-ID', trigger: 'blur' }
        ],
        accessKeySecret: [
          { required: true, message: 'ACCESS-KEY-SECRET', trigger: 'blur' }
        ],
        signName: [
          { required: true, message: 'SIGN-NAME', trigger: 'blur' }
        ],
        sendType: [
          { required: true, message: 'send-Type', trigger: 'blur' }
        ],
      },
      sendSmsForm: {
        recievePhone: ''
      },
      smsFormRule: {
        recievePhone: [
          { required: true, message: '手机号码不能为空！', trigger: 'blur' }
        ],
        templateParameter: [
          { required: true, message: '模板CODE不能为空！', trigger: 'blur' }
        ],
      },
      smsTestModel: false,
      save_loading: false,
      test_loading: false,
      isSending: false,
      editLoading: false,
      keepalive: false,

      data: []
    }
  },
  methods: {
    searchSmsConfig() {
      const self = this;
      this.$http.get('/sms/config', {}).then(function (res) {
        if (res.code === 200) {
          self.smsForm = res.data;
        }
      });
    },

    saveEdit() {
      this.$refs['smsForm'].validate((valid) => {
        if (valid) {
          this.saveInfoAjax();
        }
      });
    },

    edit(index) {
      this.isSaving = false;
      const self = this;
      this.$refs.smsConfigForm.resetFields();
      this.editModal = true;
      this.$http.get('/smsConfig/' + self.data[index].id, {}).then((res) => {
        if (res.code === 200) {
          self.smsConfigForm = res.data;
        } else {
          self.$Message.error('获取smsConfig失败！' + res.data.code);
        }

      });
    },

    saveInfoAjax() {
      this.isSaving = true;
      let self = this;

      this.$refs.smsForm.validate((valid) => {
        if (valid) {
          if (this.smsForm.id) {
            this.$http.put('/sms/config', self.smsForm).then(function (res) {
              if (res.code === 200) {
                self.isSaving = false;
                self.searchSmsConfig();
                self.$Message.success('更新成功');
              } else {
                self.isSaving = false;
                self.$Message.error('更新失败');
              }
            })
          } else {
            this.$http.post('/sms/config', self.smsForm).then(function (res) {
              if (res.code === 200) {
                self.isSaving = false;
                self.searchSmsConfig();
                self.$Message.success('添加成功');
              } else {
                self.isSaving = false;
                self.$Message.error('添加失败');
              }
            })
          }
        }
      });
    },

    smsTest() {
      this.isSaving = false;
      this.smsTestModel = true;
    },

    handleReset() {
      this.smsTestModel = false;
    },

    handleSend() {
      const self = this;
      this.$refs['sendSmsForm'].validate((valid) => {
        if (valid) {
          let params = {
            recievePhone: this.sendSmsForm.recievePhone,
            templateParameter: this.sendSmsForm.templateParameter,
          };
          this.$http.get('/sms/config/sendSms', params).then(function (res) {
            if (res.code === 200) {
              self.$Message.success('发送成功');
              self.smsTestModel = false;
            } else {
              self.$Message.error('发送失败');
            }
          })
        }
      });
    },
  },

  created() {
    this.searchSmsConfig();
  },

  activated() {
    if (this.keepalive) {
      this.keepalive = false;
      this.searchSmsConfig();
    }
  },

  deactivated() {
    this.keepalive = true;
  }

}

</script>
