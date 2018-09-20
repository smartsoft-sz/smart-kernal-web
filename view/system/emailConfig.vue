<!-- smartsoft created on 2018/09/15-->
<style lang="less">
  @import '../../styles/common.less';

</style>

<template>
  <div style="margin-top: 20px;">
    <div>
      <Form
          ref="emailForm"
          :model="emailForm"
          :label-width="80"
          label-position="right"
          :rules="inforValidate">

        <FormItem label="主  机：" prop="host">
          <div style="display:inline-block;width:300px;">
            <Input v-model="emailForm.host" placeholder="enter a host"></Input>
          </div>
        </FormItem>
        <FormItem label="端  口：" prop="port">
          <div style="display:inline-block;width:300px;">
            <Input v-model="emailForm.port" placeholder="enter a port"></Input>
          </div>
        </FormItem>
        <FormItem label="协  议：" prop="protocol">
          <div style="display:inline-block;width:300px;">
            <Input v-model="emailForm.protocol" placeholder="enter a protocol"></Input>
          </div>
        </FormItem>
        <FormItem label="参  数：">
          <div style="display:inline-block;width:300px;">
            <Input v-model="emailForm.parameter" placeholder="enter a parameter"></Input>
          </div>
        </FormItem>
        <FormItem label="编码方式：" :label-width= "82">
          <div style="display:inline-block;width:300px;">
            <Input v-model="emailForm.encoding" placeholder="enter a encoding"></Input>
          </div>
        </FormItem>
        <FormItem label="用户名：" prop="username">
          <div style="display:inline-block;width:300px;">
            <Input v-model="emailForm.username" placeholder="enter a username"></Input>
          </div>
        </FormItem>
        <FormItem label="密  码：" prop="password">
          <div style="display:inline-block;width:300px;">
            <Input v-model="emailForm.password" placeholder="enter a password"></Input>
          </div>
        </FormItem>
        <FormItem label="邮件来源：" :label-width= "82">
          <div style="display:inline-block;width:300px;">
            <Input v-model="emailForm.emailFrom" placeholder="enter a email_from"></Input>
          </div>
        </FormItem    >
        <div>
          <div class="submit-button" style="display: inline-block;">
            <Button type="primary" style="width: 100px;margin-left: 90px" :loading="save_loading" @click="saveEdit">保存
            </Button>
          </div>
          <Button type="primary" class="right-button" style="margin-left: 40px;" :loading="test_loading" @click="emailTest">邮箱测试
          </Button>
        </div>
      </Form>
    </div>

    <Modal
        v-model="emailTestModel"
        title="接收邮箱">
      <Form ref='sendEmailForm' :model='sendEmailForm' :rules='emailFormRule' :label-width='80'
            style="width: 450px">
        <FormItem label="接收邮箱" prop="emailAdd">
          <div style="display: inline-block; width:300px;">
            <Input v-model='sendEmailForm.emailAdd' placeholder='请输入邮箱'/>
          </div>
        </FormItem>
        <FormItem label="测试参数" prop="testParameter">
          <div style="display: inline-block; width:300px;">
            <Input v-model='sendEmailForm.testParameter' placeholder='请输入测试参数'/>
          </div>
        </FormItem>
      </Form>
      <div slot="footer">
        <Spin fix v-if="editLoading">
          <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
          <div>加载中...</div>
        </Spin>
        <Button  @click="handleReset()" style="margin-left: 8px">取消</Button>
        <Button type="success" :loading="isSending" @click="handleSend()">发送</Button>
      </div>

    </Modal>
  </div>
</template>
<script>
export default {
  name: 'emailConfig',
  data() {
    return {
      emailForm: {
        host: undefined,
        port: undefined,
        protocol: undefined,
        parameter: undefined,
        encoding: undefined,
        username: undefined,
        password: undefined,
        emailFrom: undefined,
      },
      inforValidate: {
        host: [
          { required: true, message: '请输入主机', trigger: 'blur' }
        ],
        port: [
          { required: true, message: '请输入端口号', trigger: 'blur' }
        ],
        protocol: [
          { required: true, message: '请输入协议', trigger: 'blur' }
        ],
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
      },
      email: {},
      emailTestModel: false,
      save_loading: false,
      test_loading: false,
      isSending: false,
      editLoading: false,
      data: [],
      sendEmailForm: {
        emailAdd: '',
        testParameter: ''
      },
      emailFormRule: {
        emailAdd: [
          { required: true, message: '邮箱不能为空', trigger: 'blur' },
          { type: 'email', message: '邮件格式不正确', trigger: 'blur' },
        ],
        testParameter: [
          { required: true, message: '测试参数不能为空', trigger: 'blur' }
        ]
      },
    }
  },
  methods: {
    search() {
      let self = this;
      this.$http.get('/email/config/setInfo', {}).then(function (res) {
        if (res.code === 200) {
          const result = res && res.data;
          if (result !== null) {
            self.emailForm = result;
          }
        } else {
          self.$Message.error('获取数据失败。');
        }
      });
    },

    saveEdit() {
      this.$refs['emailForm'].validate((valid) => {
        if (valid) {
          this.saveInfoAjax();
        }
      });
    },

    saveInfoAjax() {
      let self = this;
      this.save_loading = true;
      if (this.emailForm.id) {
        this.$http.put('/email/config', self.emailForm).then(function (res) {
          if (res.code === 200) {
            self.save_loading = false;
            self.search();
            self.$Message.success('更新成功！');
          } else {
            self.save_loading = false;
            self.$Message.error('更新失败！' + res.code);
          }
        });
      } else {
        this.$http.post('/email/config', self.emailForm).then(function (res) {
          if (res.code === 200) {
            self.save_loading = false;
            self.search();
            self.$Message.success('添加成功！');
          } else {
            self.$Message.error('添加失败！' + res.code);
          }
        });
      }
    },

    emailTest() {
      this.isSaving = false;
      this.emailTestModel = true;
    },

    handleReset() {
      this.emailTestModel = false;
    },

    handleSend() {
      const self = this;
      const params = {
        emailAdd: this.sendEmailForm.emailAdd,
        testParameter: this.sendEmailForm.testParameter
      };
      this.$refs['sendEmailForm'].validate((valid) => {
        if (valid) {
          this.$http.get('/email/config/sendMail', params).then(function (res) {
            if (res.code === 200) {
              self.$Message.success('发送成功');
              self.emailTestModel = false;
            } else {
              self.$Message.error('发送失败');
            }
          })
        }
      });
    },
  },

  created() {
    this.search();
  },

  activated() {
    if (this.keepalive) {
      this.keepalive = false;
      this.search();
    }
  },

  deactivated() {
    this.keepalive = true;
  }

}

</script>
