<template>
    <div>
        
        <el-form :inline="true" :model="searchMap" class="demo-form-inline" style="margin: 8px;height: 40px;width: 581px;float: right;">
            <el-form-item label="姓名">
                <el-input v-model="searchMap.authorName" placeholder="作者名"></el-input>
            </el-form-item>

            <el-form-item label="手机号">
                <el-input v-model="searchMap.authorPhone" placeholder="作者手机号"></el-input>
            </el-form-item>

            <el-form-item label="手机号">
                <el-input v-model="searchMap.title" placeholder="作者手机号"></el-input>
            </el-form-item>
            
            <el-form-item>
                <el-button type="primary" @click="onSubmit">查询</el-button>
            </el-form-item>
        </el-form>
        
        

        <el-table
        stripe
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
                <el-button @click="setHot(scope.row.id)" type="text" size="small" :disabled="scope.row.hot">热门</el-button>
                <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
                <el-button @click="deleteDynamic(scope.row.id)" type="text" size="small">删除</el-button>
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

    <!-- 动态查看窗口 -->
    <el-dialog
    title="动态详情"
    :visible.sync="dialogVisible"
    width="40%"
    center
    >
    <div>
        <el-form ref="form" :model="form" label-width="100px" >
            <el-form-item label="编号：" prop="id">
                {{form.id}}
            </el-form-item>
            <el-form-item label="作者编号：" prop="authorId">
                {{form.authorId}}
            </el-form-item>
            <el-form-item label="作者姓名：" prop="authorName">
                {{form.authorName}}
            </el-form-item>
            <el-form-item label="作者手机号：" prop="authorPhone">
                {{form.authorPhone}}
            </el-form-item>
            <el-form-item label="点赞数：" prop="star">
                {{form.star}}
            </el-form-item>
            <el-form-item label="评论数：" prop="comment">
                {{form.comment}}
            </el-form-item>
            <el-form-item label="内容：" prop="content">
                {{form.content}}
            </el-form-item>
            
        </el-form>
    </div>

    <!-- 内嵌删除窗口 -->
    <el-dialog
      width="30%"
      title="删除"
      :visible.sync="innerDeleteVisible"
      append-to-body>
      此操作将删除动态, 是否继续?（你可以在“删除动态”中找到）
        <span slot="footer" class="dialog-footer">
            <el-button type="warning" @click="deleteDynamicInner(form.id)">确 定</el-button>
            <el-button @click="innerDeleteVisible = false">取 消</el-button>
        </span>
    </el-dialog>

    <!-- 内嵌评论窗口 -->
    <el-dialog
      width="60%"
      title="评论"
      :visible.sync="innerCommentVisible"
      append-to-body>
        <div>
            <el-table
                stripe
                :data="CommentData"
                tooltip-effect="dark"
                style="width: 100%"
                @selection-change="handleSelectionChange">
                <el-table-column
                type="selection"
                width="55">
                </el-table-column>
                <el-table-column
                prop="id"
                label="编号"
                width="60">
                </el-table-column>
                <el-table-column
                prop="date"
                label="日期"
                width="120">
                </el-table-column>
                 <el-table-column
                prop="authorId"
                label="作者编号"
                width="80">
                </el-table-column>
                <el-table-column
                prop="authorName"
                label="作者名"
                width="80">
                </el-table-column>
                <el-table-column
                prop="content"
                label="内容"
                show-overflow-tooltip>
                </el-table-column>
            </el-table>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button type="warning" @click="deleteComment()">删除选中</el-button>
            <el-button @click="innerCommentVisible = false">取 消</el-button>
        </span>
    </el-dialog>

    <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="getCommentById(form.id)">审查评论</el-button>
        <el-button type="danger" @click="innerDeleteVisible = true">删 除</el-button>
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
                // 动态是已发布状态
                state: '1'
            },
            // 页面数据
            tableData: [],
            // 是否显示查看区
            dialogVisible: false,
            // 是否显示内嵌删除窗口
            innerDeleteVisible: false,
            // 是否显示内嵌评论窗口
            innerCommentVisible: false,
            // 评论数据
            CommentData: [],
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
            // 删除评论的id
            deleteCommentIds: [],
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
        // 根据动态ID查询评论
        getCommentById(id){
            dynamicApi.getCommentById(id).then(response=>{
                this.CommentData = response.data;
            })
            this.innerCommentVisible = true;
        },
        // 审查通过提交事件
        onSubmitPass(){
            usersApi.pass(this.form.id).then(response=>{
                // 根据返回结果显示提示消息
                this.$message({
                    message: response.message,
                    type: (response.flag ? 'success':'error')
                });
            });
            this.dialogVisible = false;
        },
        // 删除动态点击事件(列表)
        deleteDynamic(id){
            this.$confirm('此操作将删除动态, 是否继续?（你可以在“删除动态”中找到）', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).then(() => {
                dynamicApi.changeStateById(id,-1).then(response=>{
                    this.$message({
                    message: response.message,
                    type: (response.flag ? 'success':'error')
                });
                })
                this.fetchDate()
            }).catch(() => {
            this.$message({
                type: 'info',
                message: '已取消删除'
            });          
            });
        },
        // 内嵌窗口的删除点击事件
        deleteDynamicInner(id){
            this.dialogVisible= false;
            this.innerDeleteVisible = false;
            dynamicApi.changeStateById(id,-1).then(response=>{
                this.$message({
                message: response.message,
                type: (response.flag ? 'success':'error')
            });
            });
            this.fetchDate()
        },
        // 评论窗口当多选框改变时
        handleSelectionChange(val){
            // console.log(val);
            this.deleteCommentIds = [];
            for(var i=0;i<val.length;i++){
                this.deleteCommentIds[i] = val[i].id;
            }
            // console.log(this.deleteCommentIds);
        },
        // 删除评论点击事件
        deleteComment(){
            if(this.deleteCommentIds.length != 0){
                dynamicApi.deleteCommentByIds(this.deleteCommentIds).then(response=>{
                    this.$message({
                        message: response.message,
                        type: (response.flag ? 'success':'error')
                    });
                    this.getCommentById(this.form.id);
                })
            }else{
                this.$message({
                    message: '未选择内容',
                    type: 'info'
                });
            }
        },

        // 设置热门点击事件
        setHot(id){
            dynamicApi.setHot(id).then(response=>{
                this.$message({
                    message: response.message,
                    type: (response.flag ? 'success':'error')
                });
                this.fetchDate();
            })
        }
    },
    // 页面创建之初调用钩子函数
    created(){
        this.fetchDate()
    }
}
</script>