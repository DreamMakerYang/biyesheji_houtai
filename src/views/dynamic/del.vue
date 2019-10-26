<template>
    <div>
        
        <el-form :inline="true" :model="searchMap" class="demo-form-inline" style="margin: 8px;height: 40px;width: 581px;float: right;">
            <el-form-item label="姓名">
                <el-input v-model="searchMap.authorName" placeholder="作者名"></el-input>
            </el-form-item>

            <el-form-item label="手机号">
                <el-input v-model="searchMap.authorPhone" placeholder="作者手机号"></el-input>
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
            width="80">
            </el-table-column>

            <el-table-column
            prop="authorId"
            label="作者编号"
            width="80">
            </el-table-column>
        
            <el-table-column
            prop="authorName"
            label="作者名"
            width="120">
            </el-table-column>

            <el-table-column
            prop="authorPhone"
            label="作者手机号"
            width="180">
            </el-table-column>

            <el-table-column
            prop="star"
            label="点赞数"
            width="80">
            </el-table-column>

            <el-table-column
            prop="comment"
            label="评论数"
            width="80">
            </el-table-column>

            <el-table-column
            prop="content"
            label="内容"
            width="449"
            show-overflow-tooltip>
            </el-table-column>

            <el-table-column
            fixed="right"
            label="操作"
            width="200">
            <template slot-scope="scope">
                <el-button @click="handleClick(scope.row)" type="text" size="small">编辑</el-button>
                <el-button type="text" size="small" @click="recoverById(scope.row.id)">恢复</el-button>
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

    <!-- 动态编辑窗口 -->
    <el-dialog
    title="动态详情"
    :visible.sync="dialogVisible"
    width="40%"
    center
    >
    <div>
        <el-form ref="form" :model="form" label-width="100px" >
            <el-form-item label="编号：" prop="id">
                <el-input v-model="form.id" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="作者编号：" prop="authorId">
                <el-input v-model="form.authorId" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="作者姓名：" prop="authorName">
                <el-input v-model="form.authorName" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="作者手机号：" prop="authorPhone">
                <el-input v-model="form.authorPhone" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="点赞数：" prop="star">
                <el-input v-model="form.star" ></el-input>
            </el-form-item>
            <el-form-item label="评论数：" prop="comment">
                <el-input v-model="form.comment" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="内容：" prop="content">
                <el-input
                    type="textarea"
                    v-model="form.content"
                    maxlength="200"
                    autosize
                    show-word-limit>
                </el-input>
            </el-form-item>
            
        </el-form>
    </div>

    <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="changeByid()">修改</el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>
    </span>
    </el-dialog>

    </div>
</template>
<script>
import dynamicApi from '@/api/dynamic'
export default {
    data(){

        return{
            // 总页数
            total: 0,
            // 当前页数
            currentPage: 1,
            // 当前页面大小
            pageSize: 10,
            // 搜索内容集合
            searchMap: {
                // 动态是已删除状态
                state: '-1'
            },
            // 页面数据
            tableData: [],
            // 是否显示用户编辑区
            dialogVisible: false,
            
            // 编辑表单
            form: {
                id: '',
                authorId:'',
                authorName:'',
                authorPhone:'',
                star:'',
                comment:'',
                content:''
            },
        }
    },
    methods: {
        // 每行的操作按钮
        handleClick(row) {
            console.log(row);
            this.form.id = row.id;
            this.form.authorId = row.authorId;
            this.form.authorName = row.authorName;
            this.form.authorPhone = row.authorPhone;
            this.form.star = row.star;
            this.form.comment = row.comment;
            this.form.content = row.content;
            this.dialogVisible = true;
        },
        // 更新列表数据
        fetchDate(){
            dynamicApi.search(this.currentPage,this.pageSize,this.searchMap).then(response=>{
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
        // 编辑动态提交事件
        changeByid(){
            dynamicApi.changeById(this.form).then(response=>{
                this.dialogVisible = false;
                this.$message({
                    message: response.message,
                    type: (response.flag ? 'success':'error')
                });
            })
        },
        // 恢复动态事件
        recoverById(id){
            this.$confirm('此操作将恢复动态, 是否继续?（你可以在“已发布”中找到）', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).then(() => {
                dynamicApi.changeStateById(id,1).then(response=>{
                    this.$message({
                        message: response.message,
                        type: (response.flag ? 'success':'error')
                    });
                })
                this.fetchDate()
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