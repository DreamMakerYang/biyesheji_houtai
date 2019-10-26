<template>
    <div>
        
        <el-form :inline="true" :model="searchMap" class="demo-form-inline" style="margin: 8px;height: 40px;width: 1140px;float: right;">
            <el-form-item label="姓名">
                <el-input v-model="searchMap.authorName" placeholder="作者名"></el-input>
            </el-form-item>

            <el-form-item label="手机号">
                <el-input v-model="searchMap.authorPhone" placeholder="作者手机号"></el-input>
            </el-form-item>

            <el-form-item label="垃圾名称">
                <el-input v-model="searchMap.rubbishName" placeholder="垃圾名称"></el-input>
            </el-form-item>

            <el-form-item label="垃圾类别">
                <el-select v-model="searchMap.optionsValue" placeholder="请选择">
                    <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
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
            width="100">
            </el-table-column>

            <el-table-column
            prop="authorId"
            label="作者编号"
            width="100">
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
            prop="rubbishName"
            label="垃圾名"
            width="120"
            show-overflow-tooltip>
            </el-table-column>

            <el-table-column
            prop="rubbishType"
            label="垃圾类别"
            width="120"
            show-overflow-tooltip>
            </el-table-column>

            <el-table-column
            prop="rubbishIntro"
            label="简介"
            width="380"
            show-overflow-tooltip>
            </el-table-column>

            <el-table-column
            fixed="right"
            label="操作"
            width="200">
            <template slot-scope="scope">
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

    <!-- 垃圾预览框 -->
    <el-dialog
      width="30%"
      title="查看"
      :visible.sync="innerVisiblePreview"
      append-to-body>

      <div style="width: 276px;height: 432px;margin: 0 auto;">
        <el-card shadow="hover" style="margin-bottom: 10px;width: 100%;height: 100%;">
            <div style="margin: 0px auto;width: fit-content;" class="card">
                <img width="160" height="160" :src="form.imageUrl"/>	
            </div>
            <div style="text-align:center">
                <div style="font-size: 24px;margin-top:10px" class="cardContent">{{form.rubbishName}}</div>
                <div style="font-size: 16px; color: rgb(70, 201, 101);">{{form.rubbishType}}</div>
            </div>
            <p class="cardContent">{{form.rubbishIntro}}</p>
        </el-card>
      </div>
        

        <!-- 内嵌删除警告框 -->
        <el-dialog
        width="30%"
        title="删除"
        :visible.sync="innerVisibleDel"
        append-to-body>
        此操作将删除垃圾, 是否继续?（你可以在“已删除”中找到）
            <span slot="footer" class="dialog-footer">
                <el-button type="warning" @click="deleteRubbishInner(form.id)">确 定</el-button>
                <el-button @click="innerVisibleDel = false">取 消</el-button>
            </span>
        </el-dialog>
    

        <span slot="footer" class="dialog-footer">
            <el-button type="danger" @click="innerVisibleDel = true">删 除</el-button>
            <el-button @click="innerVisiblePreview = false">取 消</el-button>
        </span>
    </el-dialog>

    </div>
</template>
<script>
import rubbishApi from '@/api/rubbish'
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
                // 选择器值
                optionsValue: '0',
                // 已通过状态
                state: '1'
            },
            // 页面数据
            tableData: [],
            
            // 是否展示内嵌删除窗口
            innerVisibleDel: false,
            // 是否显示内嵌预览框
            innerVisiblePreview: false,
            // 编辑表单
            form: {
                id: '',
                authorId:'',
                authorName:'',
                authorPhone:'',
                rubbishName:'',
                rubbishType:'',
                rubbishIntro:'',
                imageUrl: ''
            },
            // 新闻内容
            newsContent: '',

            // 选择器内容
            options: [{
                value: '0',
                label: '全部'
            }, {
                value: '1',
                label: '可回收垃圾'
            }, {
                value: '2',
                label: '湿垃圾'
            }, {
                value: '3',
                label: '干垃圾'
            }, {
                value: '4',
                label: '有害垃圾'
            }],
            
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
            this.form.rubbishName = row.rubbishName;
            this.form.rubbishType = row.rubbishType;
            this.form.rubbishIntro = row.rubbishIntro;
            this.form.imageUrl = row.imageUrl;
            this.innerVisiblePreview = true;
        },
        // 更新列表数据
        fetchDate(){
            rubbishApi.search(this.currentPage,this.pageSize,this.searchMap).then(response=>{
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
        
        // 删除点击事件
        deleteById(id){
            this.$confirm('此操作将删除垃圾, 是否继续?（你可以在“已删除”中找到）', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).then(() => {
                rubbishApi.changeStateById(id,-1).then(response=>{
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
        deleteRubbishInner(id){
            this.innerVisiblePreview= false;
            this.innerVisibleDel = false;
            rubbishApi.changeStateById(id,-1).then(response=>{
                this.$message({
                message: response.message,
                type: (response.flag ? 'success':'error')
            });
            });
            this.fetchDate()
        }
    },
    // 页面创建之初调用钩子函数
    created(){
        this.fetchDate()
    }
}
</script>
<style scoped>
.card{
	border: 1px solid rgb(83, 213, 114);
	border-radius:50%;
}
.cardContent{
	font-family: "pinghei","Hiragino Sans GB", "Microsoft YaHei", "WenQuanYi Micro Hei", sans-serif;
	font-size: 16px;
	line-height: 30px;
	font-weight: 300;
	font-style: normal;
}
</style>