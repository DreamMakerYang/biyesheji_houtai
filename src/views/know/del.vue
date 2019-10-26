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

    <!-- 知识编辑区 -->
    <el-dialog
    title="编辑知识"
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
            <el-form-item label="知识标题：" prop="title">
                <el-input v-model="form.title" ></el-input>
            </el-form-item>
            <el-form-item label="日期：" prop="date">
                <el-date-picker
                    v-model="form.date"
                    type="date"
                    value-format="yyyy-MM-dd"
                    placeholder="选择日期">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="浏览量：" prop="count">
                <el-input-number v-model="form.count" :min="0" ></el-input-number>
            </el-form-item>
            <el-form-item label="图片地址：" prop="imageUrl">
                <el-input v-model="form.imageUrl" ></el-input>
            </el-form-item>
            <el-form-item label="简介：" prop="intro">
                <el-input v-model="form.intro" type="textarea" autosize maxlength="100" show-word-limit></el-input>
            </el-form-item>
            
        </el-form>
    </div>
    <!-- 内嵌保存警告框 -->
    <el-dialog
      width="30%"
      title="保存"
      :visible.sync="innerVisibleDel"
      append-to-body>
      此操作将保存知识, 是否继续?
        <span slot="footer" class="dialog-footer">
            <el-button type="warning" @click="saveKnowInner()">确 定</el-button>
            <el-button @click="innerVisibleDel = false">取 消</el-button>
        </span>
    </el-dialog>

    <!-- 内嵌知识内容编辑框 -->
    <el-dialog
      width="65%"
      title="知识内容编辑"
      :visible.sync="innerVisibleKnowContent"
      append-to-body>

        <!-- 富文本编辑器 -->
        <div class="quill-editor" 
            :content="KnowContent"
            @change="onEditorChange($event)"
            v-quill:myQuillEditor="editorOption">
        </div>

        <span slot="footer" class="dialog-footer">
            <el-button type="success" @click="commitKnowContent()">提 交</el-button>
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
                <el-image style="width: 370px; height: 250px"  :src="form.imageUrl" fit="fill"></el-image>	
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
        <el-button type="primary" @click="getKnowContentById(form.id)">编辑内容</el-button>
        <el-button type="danger" @click="innerVisibleDel = true">保存</el-button>
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
                // 知识是待审批状态
                state: '-1'
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

            // 富文本编辑器工具栏
            editorOption: {
                theme:'snow',
                placeholder: '请输入小知识内容',
                modules: {
                    toolbar: [
                        ['bold', 'italic', 'underline', 'strike'],    //加粗，斜体，下划线，删除线
                        ['blockquote', 'code-block'],     //引用，代码块
                        [{ 'header': 1 }, { 'header': 2 }],        // 标题，键值对的形式；1、2表示字体大小
                        [{ 'list': 'ordered'}, { 'list': 'bullet' }],     //列表
                        [{ 'script': 'sub'}, { 'script': 'super' }],   // 上下标
                        [{ 'indent': '-1'}, { 'indent': '+1' }],     // 缩进
                        [{ 'direction': 'rtl' }],             // 文本方向
                        [{ 'size': ['small', false, 'large', 'huge'] }], // 字体大小
                        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],     //几级标题
                        [{ 'color': [] }, { 'background': [] }],     // 字体颜色，字体背景颜色
                        [{ 'font': [] }],     //字体
                        [{ 'align': [] }],    //对齐方式
                        ['clean'],    //清除字体样式
                        ['image']    //上传图片
                    ]
                }
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
        // 恢复点击事件
        recoverById(id){
            this.$confirm('此操作将恢复小知识, 是否继续?（你可以在“已发布”中找到）', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).then(() => {
                knowApi.changeStateById(id,1).then(response=>{
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
        },
        // 内嵌窗口的保存功能
        saveKnowInner(){
            this.dialogVisible= false;
            this.innerVisibleDel = false;
            knowApi.saveKnow(this.form).then(response=>{
                this.$message({
                message: response.message,
                type: (response.flag ? 'success':'error')
            });
            });
            this.fetchDate()
        },
        // 富文本编辑器内容改变事件
        onEditorChange({ editor, html, text }){
            this.KnowContent = html;
        },
        // 提交新闻内容
        commitKnowContent(){
            knowApi.commitKnowContent(this.form.id,this.KnowContent).then(response=>{
                this.$message({
                    message: response.message,
                    type: (response.flag ? 'success':'error')
                });
            })
            this.innerVisibleKnowContent = false;
        },
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