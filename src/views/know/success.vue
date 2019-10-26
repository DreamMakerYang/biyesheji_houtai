<template>
    <div>
        
        <el-form :inline="true" :model="searchMap" class="demo-form-inline" style="margin: 8px;height: 40px;width: 830px;float: right;">
            <el-form-item label="姓名">
                <el-input v-model="searchMap.authorName" placeholder="作者名"></el-input>
            </el-form-item>

            <el-form-item label="手机号">
                <el-input v-model="searchMap.authorPhone" placeholder="作者手机号"></el-input>
            </el-form-item>

            <el-form-item label="标题">
                <el-input v-model="searchMap.newsTitle" placeholder="知识标题"></el-input>
            </el-form-item>
            
            <el-form-item>
                <el-button type="primary" @click="onSubmit">查询</el-button>
            </el-form-item>
        </el-form>
        
        

        <el-table
        :data="tableData"
        border
        stripe
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
            width="100">
            </el-table-column>
        
            <el-table-column
            prop="authorName"
            label="作者名"
            width="100">
            </el-table-column>

            <el-table-column
            prop="authorPhone"
            label="作者手机号"
            width="180">
            </el-table-column>

            <el-table-column
            prop="title"
            label="标题"
            width="120"
            show-overflow-tooltip>
            </el-table-column>

            <el-table-column
            prop="date"
            label="日期"
            width="100"
            show-overflow-tooltip>
            </el-table-column>

            <el-table-column
            prop="intro"
            label="简介"
            width="400"
            show-overflow-tooltip>
            </el-table-column>

            <el-table-column
            fixed="right"
            label="操作"
            width="200">
            <template slot-scope="scope">
                <el-button @click="setHot(scope.row.id)" type="text" size="small" :disabled="scope.row.hot">热门</el-button>
                <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
                <el-button type="text" size="small" @click="deleteById(scope.row.id)">删除</el-button>
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

    <!-- 知识审查区 -->
    <el-dialog
    title="查看知识详情"
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
            <el-form-item label="知识标题：" prop="title">
                {{form.title}}
            </el-form-item>
            <el-form-item label="日期：" prop="date">
                {{form.date}}
            </el-form-item>
            <el-form-item label="浏览量：" prop="count">
                {{form.count}}
            </el-form-item>
            <el-form-item label="图片地址：" prop="imageUrl">
                {{form.imageUrl}}
            </el-form-item>
            <el-form-item label="简介：" prop="intro">
                {{form.intro}}
            </el-form-item>
            
        </el-form>
    </div>
    <!-- 内嵌删除警告框 -->
    <el-dialog
      width="30%"
      title="删除"
      :visible.sync="innerVisibleDel"
      append-to-body>
      此操作将删除知识, 是否继续?（你可以在“已删除”中找到）
        <span slot="footer" class="dialog-footer">
            <el-button type="warning" @click="deleteKnowInner(form.id)">确 定</el-button>
            <el-button @click="innerVisibleDel = false">取 消</el-button>
        </span>
    </el-dialog>

    <!-- 内嵌知识内容审核框 -->
    <el-dialog
      width="50%"
      title="查看知识内容"
      :visible.sync="innerVisibleKnowContent"
      append-to-body>

      <div v-html="KnowContent"></div>

        <span slot="footer" class="dialog-footer">
            <el-button @click="innerVisibleKnowContent = false">取 消</el-button>
        </span>
    </el-dialog>

    <!-- 内嵌知识预览框 -->
    <el-dialog
      width="40%"
      title="预览"
      :visible.sync="innerVisiblePreview"
      append-to-body>

    <div style="width:372px;heigh:565px;margin:0 auto">
        <el-card shadow="hover" style="margin-bottom: 10px;" :body-style="{ padding: '0px' }" >
            <div style="margin: 0px auto;width: fit-content;" class="card">
                <img width="370" height="250" :src="form.imageUrl"/>	
            </div>
            <div style="margin: 5px 10px 0 10px;">
                <div class="cardContent" style="border-bottom: solid 1px #DCDFE6;">
                    {{form.date}}
                </div>
                <div style="text-align:center">
                    <div style="font-size: 24px;margin-top:10px" class="cardContent">{{form.title}}</div>
                </div>
                <p class="cardContent">{{form.intro}}</p>
            </div>
            <div style="float: right;margin: 0 10px 10px 0;">
                <el-button type="success" plain round >阅读详情</el-button>
            </div>
        </el-card>
    </div>
    

        <span slot="footer" class="dialog-footer">
            <el-button @click="innerVisiblePreview = false">关 闭</el-button>
        </span>
    </el-dialog>

    <span slot="footer" class="dialog-footer">
        <el-button type="success" @click="innerVisiblePreview = true">预览</el-button>
        <el-button type="primary" @click="getKnowContentById(form.id)">查看内容</el-button>
        <el-button type="danger" @click="innerVisibleDel = true">删 除</el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>
    </span>
    </el-dialog>

    </div>
</template>
<script>
import knowApi from '@/api/know'
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
                // 知识是已发布状态
                state: '1'
            },
            // 页面数据
            tableData: [],
            // 是否显示审查区
            dialogVisible: false,
            // 是否展示内嵌删除窗口
            innerVisibleDel: false,
            // 是否显示内嵌知识内容审核框
            innerVisibleKnowContent: false,
            // 是否显示内嵌预览框
            innerVisiblePreview: false,
            // 编辑表单
            form: {
                id: '',
                authorId:'',
                authorName:'',
                authorPhone:'',
                title:'',
                date:'',
                count:'',
                intro:'',
                imageUrl:''
            },
            // 知识内容
            KnowContent: '',
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
            this.form.title = row.title;
            this.form.date = row.date;
            this.form.count = row.count;
            this.form.intro = row.intro;
            this.form.imageUrl = row.imageUrl;
            this.dialogVisible = true;
        },
        // 更新列表数据
        fetchDate(){
            knowApi.search(this.currentPage,this.pageSize,this.searchMap).then(response=>{
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
        
        // 根据id查询知识内容
        getKnowContentById(id){
            knowApi.getKnowContentById(id).then(response=>{
                this.KnowContent = response.data.content;
            });
            this.innerVisibleKnowContent = true;
        },
        // 删除点击事件
        deleteById(id){
            this.$confirm('此操作将删除小知识, 是否继续?（你可以在“已删除”中找到）', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).then(() => {
                knowApi.changeStateById(id,-1).then(response=>{
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
        // 内嵌窗口的删除功能
        deleteKnowInner(id){
            this.dialogVisible= false;
            this.innerVisibleDel = false;
            knowApi.changeStateById(id,-1).then(response=>{
                this.$message({
                message: response.message,
                type: (response.flag ? 'success':'error')
            });
            });
            this.fetchDate()
        },
        // 设置热门点击事件
        setHot(id){
            knowApi.setHot(id).then(response=>{
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
<style scoped>
.cardContent{
	font-family: "pinghei","Hiragino Sans GB", "Microsoft YaHei", "WenQuanYi Micro Hei", sans-serif;
	font-size: 16px;
	line-height: 30px;
	font-weight: 300;
	font-style: normal;
}
</style>