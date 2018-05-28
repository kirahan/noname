<template>
    <div v-if="isdisplay">
        <el-row>
            <el-col :span="20" :offset="2">
                <el-col :span="8">
                    <el-button class="live live-btn">直播编号</el-button>
                    <el-input  style="width: 40%" v-model="inputComId" placeholder="请输入赛事直播编号"></el-input>
                    <el-button type="success" @click="initLiveModule('id')" class="live live-btn">确定</el-button>
                    <el-button type="success" @click="sendtest" class="live live-btn">send</el-button>
                </el-col>
                <el-col :span="8">
                    <el-button class="live live-btn">比赛链接</el-button>
                    <el-input style="width: 40%" v-model="inputComLiveUrl" placeholder="请输入赛事直播页面网址"></el-input>
                    <el-button type="success" @click="initLiveModule('url')"  class="live live-btn">确定</el-button>
                </el-col>
                <el-col :span="8" >
                    <el-switch style="background-color: white;height: 50px;width: 300px"  v-model="LiveModuleSwitch.whole" active-color="#13ce66" inactive-color="#ff4949"
                               active-text="模块开启"
                               inactive-text="模块关闭">
                    </el-switch>
                    <!--<el-switch style="background-color: white;height: 50px;width: 300px" v-model="LiveModuleSwitch.recentMessage" active-color="#13ce66" inactive-color="#ff4949"-->
                               <!--active-text="聊天消息显示"-->
                               <!--inactive-text="聊天消息隐藏">-->
                    <!--</el-switch>-->
                    <el-switch style="background-color: white;height: 50px;width: 300px" v-model="LiveModuleSwitch.newMessage" active-color="#13ce66" inactive-color="#ff4949"
                               active-text="新信息显示"
                               inactive-text="新信息显示">
                    </el-switch>
                    <el-switch style="background-color: white;height: 50px;width: 300px" v-model="LiveModuleSwitch.updateResult" active-color="#13ce66" inactive-color="#ff4949"
                               active-text="新成绩录入更新"
                               inactive-text="新成绩录入不提示">
                    </el-switch>
                </el-col>




                <el-button-group>

                </el-button-group>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import cbComLive from './websocket/cubingComLive'


    import cbspider from './cubingSpider'
    const newspider = new cbspider()
    const cbcomlive = new cbComLive()
    const {ipcRenderer} = require('electron')
    export default {
        name: "live",
        data(){
            return {
                inputComId : 858,
                inputComLiveUrl : '',
                LiveModuleSwitch :{
                    whole : true,
                    recentMessage : false,
                    newMessage : false,
                    updateResult : true,
                    allResult : true,
                    allUser : true
                },
                funcbuffer : {},
            }
        },
        created(){
        },
        methods : {
            initLiveModule : function (type) {
                var that = this
                if(type == 'id'){
                    cbcomlive.state.c = (this.inputComId==0)? 858 : this.inputComId
                    var funcbuf = cbcomlive.conn()
                    cbcomlive._events.onUser = function(data){
                        let buffer = {}
                        buffer.type = 'allUser'
                        buffer.switch = that.LiveModuleSwitch
                        buffer.data = data
                        ipcRenderer.send('render-show-cubing-live', buffer)
                    },
                        cbcomlive._events.onResultAll = function (data) {
                            let buffer = {}
                            buffer.type = 'allResult'
                            buffer.switch = that.LiveModuleSwitch
                            buffer.data = data
                            ipcRenderer.send('render-show-cubing-live', buffer)
                        },
                        cbcomlive._events.onResultUpdate = function (data) {
                            let buffer = {}
                            buffer.type = 'ResultUpdate'
                            buffer.switch = that.LiveModuleSwitch
                            buffer.data = data
                            ipcRenderer.send('render-show-cubing-live', buffer)
                        },
                        cbcomlive._events.onMessageRecent = function (data) {
                            let buffer = {}
                            buffer.type = 'messageRecent'
                            buffer.switch = that.LiveModuleSwitch
                            buffer.data = data
                            ipcRenderer.send('render-show-cubing-live', buffer)
                        },
                        cbcomlive._events.onMessageNew = function (data) {

                            let buffer = {}
                            buffer.type = 'messageNew'
                            buffer.switch = that.LiveModuleSwitch
                            buffer.data = data
                            ipcRenderer.send('render-show-cubing-live', buffer)
                        }

                        this.funcbuffer = funcbuf
                }else if(type=='url'){
                    newspider.getLiveModuleId(this.inputComLiveUrl,function (comid) {
                        cbcomlive.state.c = comid
                        var funcbuf = cbcomlive.conn()
                        cbcomlive._events.onUser = function(data){
                            let buffer = {}
                            buffer.type = 'allUser'
                            buffer.switch = that.LiveModuleSwitch
                            buffer.data = data
                            ipcRenderer.send('render-show-cubing-live', buffer)
                        },
                            cbcomlive._events.onResultAll = function (data) {
                                let buffer = {}
                                buffer.type = 'allResult'
                                buffer.switch = that.LiveModuleSwitch
                                buffer.data = data
                                ipcRenderer.send('render-show-cubing-live', buffer)
                            },
                            cbcomlive._events.onResultUpdate = function (data) {
                                let buffer = {}
                                buffer.type = 'ResultUpdate'
                                buffer.switch = that.LiveModuleSwitch
                                buffer.data = data
                                ipcRenderer.send('render-show-cubing-live', buffer)
                            },
                            cbcomlive._events.onMessageRecent = function (data) {
                                let buffer = {}
                                buffer.type = 'messageRecent'
                                buffer.switch = that.LiveModuleSwitch
                                buffer.data = data
                                ipcRenderer.send('render-show-cubing-live', buffer)
                            },
                            cbcomlive._events.onMessageNew = function (data) {

                                let buffer = {}
                                buffer.type = 'messageNew'
                                buffer.switch = that.LiveModuleSwitch
                                buffer.data = data
                                ipcRenderer.send('render-show-cubing-live', buffer)
                            }

                        this.funcbuffer = funcbuf
                    })
                }
            },
            sendtest : function () {
                var ws = this.funcbuffer
                ws.send(
                    {
                    type: 'result',
                    action: 'fetch',
                    params:   {
                        event : '333',
                        round : '2',
                        filter : 'all'
                    }
                    }
                )
            }
        },
        props : ['isdisplay'],
        watch : {
            LiveModuleSwitch : function () {
                ipcRenderer.send('render-change-cubing-live-setting', this.LiveModuleSwitch)
            }
        }
    }
</script>

<style scoped>

    .live {
        padding: 10px !important;
        margin-top: 5px !important;
    }
    .live.live-btn{
        width: 25%;
    }



</style>



