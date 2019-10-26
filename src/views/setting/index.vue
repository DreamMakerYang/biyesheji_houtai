<template>
    <div class="main">
        <el-form label-width="80px">
            <el-form-item label="轮播图:">
                
                <div>
                    <div v-for="(url,index) in urlList" :key="index" style="float:left;margin:10px">
                        <el-tooltip class="item" effect="light" content="点击图片大图预览" placement="top">
                            <el-image 
                                style="width: 100px; height: 100px"
                                :src="url" 
                                :preview-src-list="srcList">
                            </el-image>
                        </el-tooltip>
                    </div>
                </div>
                
                <div style="margin-top: 40px;">
                    <el-button type="primary" plain round @click="getPictureInfoById()">管理</el-button>
                </div>
            </el-form-item>

            <el-form-item label="热门关注:">
                <div style="float:left">
                    <el-switch v-model="autoAttention"></el-switch>
                    按浏览量自动生成 OR
                </div>
                <el-tooltip class="item" effect="light" content="自动生成和自定义只能二选一" placement="top" :disabled="!autoAttention">
                    <div style="float:left;margin-left:10px">
                        <el-button type="primary" plain round :disabled="autoAttention" @click="getHotAttention()">自定义</el-button>
                    </div>
                </el-tooltip>
                
            </el-form-item>

            <el-form-item label="推荐新闻:">
                <div style="float:left">
                    <el-switch v-model="autoNews"></el-switch>
                    按浏览量自动生成 OR
                </div>
                <el-tooltip class="item" effect="light" content="自动生成和自定义只能二选一" placement="top" :disabled="!autoNews">
                    <div style="float:left;margin-left:10px">
                        <el-button type="primary" plain round :disabled="autoNews" @click="getHotNews()">自定义</el-button>
                    </div>
                </el-tooltip>
            </el-form-item>
            <el-form-item>
                <el-button type="success" @click="submit()" round plain style="float: right;margin-right: 20px;">提交</el-button>
            </el-form-item>
        </el-form>

        <el-dialog
        width="60%"
        title="轮播图设置"
        :visible.sync="pictureVisible"
        append-to-body>

            <el-dialog
            width="40%"
            title="上传图片"
            :visible.sync="uploadVisible"
            append-to-body>

                <el-upload
                    class="upload-demo"
                    ref="upload"
                    action=""
                    :http-request='uploadFileMethod'
                    :on-change="beforeUpload"
                    :on-exceed="spillNub"
                    :file-list="fileList"
                    :limit="5"
                    accept=".jpg,.png"
                    :auto-upload="false"
                    list-type="picture">
                    <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                    <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
                    <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                </el-upload>
            </el-dialog>


            <div>
                <el-table
                    stripe
                    :data="PictureData"
                    tooltip-effect="dark"
                    style="width: 100%"
                    @selection-change="handlePicSelectionChange">
                    <el-table-column
                    type="selection"
                    width="55">
                    </el-table-column>
                    <el-table-column
                    prop="id"
                    label="编号"
                    width="80">
                    </el-table-column>
                    <el-table-column
                    prop="date"
                    label="日期"
                    width="120">
                    </el-table-column>
                    <el-table-column
                    prop="imageUrl"
                    label="图片地址"
                    width="600">
                    </el-table-column>

                </el-table>
            </div>
            
            <span slot="footer" class="dialog-footer">
                <el-button slot="trigger" type="success" @click="uploadVisible = true">上传</el-button>
                <el-button type="warning" @click="deletePicture()">删除选中</el-button>
                <el-button @click="pictureVisible = false">取 消</el-button>
            </span>
        </el-dialog>

        <el-dialog
            width="65%"
            title="自定义热门关注"
            :visible.sync="hotAttentionVisible"
            append-to-body>
            <div>
                <el-table
                    stripe
                    :data="AttentionData"
                    tooltip-effect="dark"
                    style="width: 100%"
                    @selection-change="handleAttentionSelectionChange">
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
                    prop="authorName"
                    label="作者名"
                    width="80">
                    </el-table-column>
                    <el-table-column
                    prop="authorPhone"
                    label="作者手机号"
                    width="120">
                    </el-table-column>
                    <el-table-column
                    prop="title"
                    label="标题"
                    width="120">
                    </el-table-column>
                    <el-table-column
                    prop="content"
                    label="内容"
                    width="500">
                    </el-table-column>

                </el-table>
            </div>

            <span slot="footer" class="dialog-footer">
                <el-button type="warning" @click="deleteAttention()">删除选中</el-button>
                <el-button @click="hotAttentionVisible = false">关 闭</el-button>
            </span>
            
        </el-dialog>


        <el-dialog
            width="65%"
            title="自定义热门新闻"
            :visible.sync="hotNewsVisible"
            append-to-body>


            <div>
                <el-table
                    stripe
                    :data="NewsData"
                    tooltip-effect="dark"
                    style="width: 100%"
                    @selection-change="handleNewsSelectionChange">
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
                    prop="authorName"
                    label="作者名"
                    width="80">
                    </el-table-column>
                    <el-table-column
                    prop="authorPhone"
                    label="作者手机号"
                    width="120">
                    </el-table-column>
                    <el-table-column
                    prop="title"
                    label="标题"
                    width="120">
                    </el-table-column>
                    <el-table-column
                    prop="content"
                    label="内容"
                    width="500">
                    </el-table-column>

                </el-table>
            </div>

            <span slot="footer" class="dialog-footer">
                <el-button type="warning" @click="deleteNews()">删除选中</el-button>
                <el-button @click="hotNewsVisible = false">关 闭</el-button>
            </span>
            
        </el-dialog>
    </div>
        
</template>
<script>
import settingApi from '@/api/setting'
export default {
    data(){
        return {
            // 缩略图
            urlList: [],
            // 预览大图
            srcList: [],
            // 是否自动设置热门关注
            autoAttention: false,
            // 是否自动设置热门新闻
            autoNews: false,
            // 是否显示轮播图设置
            pictureVisible: false,
            // 是否显示内嵌图片上传框
            uploadVisible: false,
            // 图片详情
            PictureData: [],
            // 热门关注内容
            AttentionData:[],
            // 删除图片的id
            deletePictureIds:[],
            // 删除热门关注的id
            deleteAttentionIds:[],
            // 上次图片地址
            fileList: [],
            // 自定义热门关注
            hotAttentionVisible: false,
            // 自定义热门新闻
            hotNewsVisible: false,
            // 热门新闻内容
            NewsData:[],
            // 删除热门新闻的id
            deleteNewsIds:[]
        }
    },
    methods:{
        // 更新列表数据
        fetchDate(){
            settingApi.init().then(response=>{
                this.autoAttention = response.data.autoAttention;
                this.autoNews = response.data.autoNews;
                this.urlList = response.data.urlList;
                this.srcList = response.data.srcList;
            })
        },
        getPictureInfoById(){
            settingApi.getPictureInfoById().then(response=>{
                this.PictureData = response.data;
            });
            this.pictureVisible = true;
        },

        deletePicture(){
            if(this.deletePictureIds.length != 0){
                settingApi.deletePictureByIds(this.deletePictureIds).then(response=>{
                    this.$message({
                        message: response.message,
                        type: (response.flag ? 'success':'error')
                    });
                    this.getPictureInfoById();
                })
            }else{
                this.$message({
                    message: '未选择内容',
                    type: 'info'
                });
            }

        },

        // 图片窗口当多选框改变时
        handlePicSelectionChange(val){
            // console.log(val);
            this.deletePictureIds = [];
            for(var i=0;i<val.length;i++){
                this.deletePictureIds[i] = val[i].id;
            }
            // console.log(this.deleteCommentIds);
        },
        // 获取热门关注信息
        getHotAttention(){
            settingApi.getHotAttention().then(response=>{
                this.AttentionData = response.data;
            });
            this.hotAttentionVisible = true;
        },
        deleteAttention(){
            if(this.deleteAttentionIds.length != 0){
                settingApi.deleteAttentionByIds(this.deleteAttentionIds).then(response=>{
                    this.$message({
                        message: response.message,
                        type: (response.flag ? 'success':'error')
                    });
                    this.getHotAttention();
                })
            }else{
                this.$message({
                    message: '未选择内容',
                    type: 'info'
                });
            }
        },
        // 热门关注窗口当多选框改变时
        handleAttentionSelectionChange(val){
            this.deleteAttentionIds = [];
            for(var i=0;i<val.length;i++){
                this.deleteAttentionIds[i] = val[i].id;
            }
        },

        // 获取热门新闻信息
        getHotNews(){
            settingApi.getHotNews().then(response=>{
                this.NewsData = response.data;
            });
            this.hotNewsVisible = true;
        },
        deleteNews(){
            if(this.deleteNewsIds.length != 0){
                settingApi.deleteNewsByIds(this.deleteNewsIds).then(response=>{
                    this.$message({
                        message: response.message,
                        type: (response.flag ? 'success':'error')
                    });
                    this.getHotNews();
                })
            }else{
                this.$message({
                    message: '未选择内容',
                    type: 'info'
                });
            }
        },
        // 热门新闻窗口当多选框改变时
        handleNewsSelectionChange(val){
            this.deleteNewsIds = [];
            for(var i=0;i<val.length;i++){
                this.deleteNewsIds[i] = val[i].id;
            }
        },

        // 提交订单
        submit(){
            settingApi.submit(this.autoAttention,this.autoNews).then(res=>{
                this.$message({
                    message: res.message,
                    type: (res.flag ? 'success':'error')
                });
            })
        },

        // 上传服务器
        submitUpload() {
            this.$refs.upload.submit();
        },

        beforeUpload(file) {
            console.log(file)
            var testmsg=file.name.substring(file.name.lastIndexOf('.')+1)
            const extension = testmsg === 'jpg'
            const extension2 = testmsg === 'png'
            const isLt2M = file.size / 1024 / 1024 < 1
            if(!extension && !extension2) {
                this.$message({
                    message: '图片格式错误!',
                    type: 'error'
                });
            }
            if(!isLt2M) {
                this.$message({
                    message: '上传文件大小不能超过 1MB!',
                    type: 'error'
                });
            }
            if(! extension || extension2 && isLt2M) 
              this.fileList = []
            // return extension || extension2
        },
        
        // 文件超出个数限制时的钩子
        spillNub(){
          this.$message({
              message: '图片数量不能超过1张!',
              type: 'error'
          });
        },
        
        
    },
    // 页面创建之初调用钩子函数
    created(){
        this.fetchDate()
    }
    
}
</script>
<style scoped>
.main{
    box-shadow: rgba(0, 0, 0, 0.1) 0px 2px 12px 0px;
    width: 700px;
    height: 400px;
    margin: 0 auto;
    padding: 30px;
    margin-top: 100px;
}
</style>