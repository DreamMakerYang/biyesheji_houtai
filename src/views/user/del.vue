<template>
    <div>
        
        <el-form :inline="true" :model="searchMap" class="demo-form-inline" style="margin: 8px;height: 40px;width: 581px;float: right;">
            <el-form-item label="姓名">
                <el-input v-model="searchMap.user" placeholder="姓名"></el-input>
            </el-form-item>

            <el-form-item label="手机号">
                <el-input v-model="searchMap.phone" placeholder="手机号"></el-input>
            </el-form-item>
            
            <el-form-item>
                <el-button type="primary" @click="onSubmit">查询</el-button>
            </el-form-item>
        </el-form>
        
        

        <el-table
        :data="tableData"
        border
        style="width: 100%">
            <el-table-column
            fixed
            prop="id"
            label="编号"
            width="100">
            </el-table-column>
        
            <el-table-column
            prop="name"
            label="姓名"
            width="120">
            </el-table-column>

            <el-table-column
            prop="gender"
            label="性别"
            width="120">
            </el-table-column>

            <el-table-column
            prop="phone"
            label="手机号"
            width="200">
            </el-table-column>
            
            <el-table-column
            prop="pass"
            label="密码"
            width="200">
            </el-table-column>
            
            <el-table-column
            prop="date"
            label="注册日期"
            width="300">
            </el-table-column>
            
            <el-table-column
            fixed="right"
            label="操作"
            width="200">
            <template slot-scope="scope">
                <el-button @click="handleClick(scope.row)" type="text" size="small">编辑</el-button>
                <el-button type="text" size="small" @click="recoverUser(scope.row.id)">恢复</el-button>
            </template>
            </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div style="float:right;margin-right: 10px;">
        <el-pagination
        @current-change="handleCurrentChange"
        layout="total, prev, pager, next"
        :total="this.total">
        </el-pagination>
    </div>

    <!-- 用户编辑区 -->
    <el-dialog
    title="编辑用户"
    :visible.sync="dialogVisible"
    width="30%"
    >
    <div>
        <el-form ref="form" :model="form" label-width="100px" :rules="rules">
            <el-form-item label="编号：" prop="id">
                <el-input v-model="form.id" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="手机号：" prop="phone">
                <el-input v-model="form.phone"></el-input>
            </el-form-item>
            <el-form-item label="用户名：" prop="name">
                <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="性别">
                <el-radio-group v-model="form.gender">
                <el-radio label="男"></el-radio>
                <el-radio label="女"></el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="密码：" prop="password">
                <el-input v-model="form.password" ></el-input>
            </el-form-item>
            <el-form-item label="确认密码：" prop="checkPass">
                <el-input v-model="form.checkPass" ></el-input>
            </el-form-item>
        </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="onSubmitChange()">确 定</el-button>
    </span>
    </el-dialog>

    </div>
</template>
<script>
import usersApi from '@/api/users'
export default {
    data(){

        // 编辑表单验证 callback不管如何都要调用
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

        return{
            // 总页数
            total: 0,
            // 当前页数
            currentPage: 1,
            // 当前页面大小
            pageSize: 10,
            // 搜索内容集合
            searchMap: {
                // 用户为禁用状态
                state: '0'
            },
            // 页面数据
            tableData: [],
            // 是否显示用户编辑区
            dialogVisible: false,
            // 编辑表单
            form: {
                id: '',
                phone: '',
                name: '',
                password: '',
                checkPass: '',
                gender:''
            },

            // 编辑表单验证 映射到方法
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
        // 每行的操作按钮
        handleClick(row) {
            console.log(row);
            this.form.id = row.id;
            this.form.phone = row.phone;
            this.form.name = row.name;
            this.form.gender = row.gender;
            this.form.password = row.pass;
            this.form.checkPass = row.pass;
            this.dialogVisible = true;
        },
        // 更新列表数据
        fetchDate(){
            usersApi.search(this.currentPage,this.pageSize,this.searchMap).then(response=>{
                this.total = response.data.total;
                this.tableData = response.data.rows;
            })
        },
        // 查询按钮点击事件
        onSubmit(){
            // 数据初始化
            this.total = 0;
            this.currentPage = 1;
            this.pageSize = 10;
            // 发送请求
            this.fetchDate();
        },
        // 分页点击事件
        handleCurrentChange(val){
            this.currentPage = val;
            this.fetchDate();
        },
        // 编辑用户提交事件
        onSubmitChange(){
            usersApi.changeUser(this.form).then(response=>{
                // 根据返回结果显示提示消息
                this.$message({
                    message: response.message,
                    type: (response.flag ? 'success':'error')
                });
            });
            this.dialogVisible = false;
        },
        // 恢复用户点击事件
        recoverUser(id){
            this.$confirm('此操作将恢复用户, 是否继续?（你可以在“查询用户”中找到）', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).then(() => {
                usersApi.recoverById(id).then(response=>{
                    this.$message({
                    message: response.message,
                    type: (response.flag ? 'success':'error')
                });
                })
            }).catch(() => {
            this.$message({
                type: 'info',
                message: '已取消恢复'
            });          
            });
        }
    },
    // 页面创建之初调用钩子函数
    created(){
        this.fetchDate()
    }
}
</script>