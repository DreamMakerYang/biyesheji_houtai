<template>
    <div style="margin: 100px;">
        <el-form ref="form" :model="form" label-width="100px" :rules="rules">
            <el-form-item label="手机号：" prop="phone">
                <el-input v-model="form.phone"></el-input>
            </el-form-item>
            <el-form-item label="用户名：" prop="name">
                <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="密码：" prop="password">
                <el-input v-model="form.password" show-password></el-input>
            </el-form-item>
            <el-form-item label="确认密码：" prop="checkPass">
                <el-input v-model="form.checkPass" show-password></el-input>
            </el-form-item>
            
            <el-form-item>
                <el-button type="primary" @click="onSubmit('form')">立即创建</el-button>
                <el-button>取消</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
import usersApi from '@/api/users'
export default {
    data() {
        // 注册表单验证 callback不管如何都要调用
        var validatePhone = (rule, value, callback)=>{
        if (value === '') {
            callback(new Error('请输入电话号码'));
        }else {
            callback();
        }
        };

        var validateName = (rule, value, callback)=>{
        if (value === '') {
            callback(new Error('请输入用户名称'));
        }else {
            callback();
        }
        };

        var validatePass = (rule, value, callback) => {
        if (value === '') {
            callback(new Error('请输入密码'));
        } else {
            if (this.form.checkPass !== '') {
            this.$refs.form.validateField('checkPass');
            }
            callback();
        }
        };
        var validatePass2 = (rule, value, callback) => {
        if (value === '') {
            callback(new Error('请再次输入密码'));
        } else if (value !== this.form.password) {
            callback(new Error('两次输入密码不一致!'));
        } else {
            callback();
        }
        };

      return {
        form: {
          phone: '',
          name: '',
          password: '',
          checkPass: ''
        },
        // 注册表单验证 映射到方法
        rules: {
          phone: [
            { validator: validatePhone, trigger: 'blur' }
          ],
          name: [
            { validator: validateName, trigger: 'blur' }
          ],
          password: [
            { validator: validatePass, trigger: 'blur' }
          ],
          checkPass: [
            { validator: validatePass2, trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      // 提交用户相关数据
      onSubmit(formName) {

        this.$refs[formName].validate((valid) => {
          // 判断是否正确填写表单
          if (valid) {
            console.log('submit!');
            // 发送请求
            usersApi.addUser(this.form).then(response =>{
              // 根据返回结果显示提示消息
              this.$message({
                message: response.message,
                type: (response.flag ? 'success':'error')
              });
              if(response.flag){//如果成功
                this.form = {
                    phone: '',
                    name: '',
                    password: '',
                    checkPass: ''
                  }//刷新表单
              }
            })
          } else {
            console.log('error submit!!');
            this.$message({
              message: '请填写正确信息！',
              type: 'warning'
            });
            return false;
          }
        })
      }
    }
  }
</script>