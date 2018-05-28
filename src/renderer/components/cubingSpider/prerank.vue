<template>
    <div v-if="isdisplay">
        <el-row :gutter="10">
            <el-col :span="24">
                <el-col :span="8">
                    <el-button-group style="width: 100%">
                        <el-button type="danger" @click="ipcToMain('auto')" class="rank rank-btn">自动</el-button>
                        <el-button type="danger" @click="ipcToMain('display')" class="rank rank-btn">显示</el-button>
                        <el-button type="danger" @click="ipcToMain('hide')" class="rank rank-btn">隐藏</el-button>
                        <el-button type="danger" @click="refreshPreRank('hide')" class="rank rank-btn">重新爬取</el-button>
                    </el-button-group>

                </el-col>
                <el-col :span="16">
                    <el-button v-for="event,name in Prerank"  @click="chooseEventDisplay(name)" type="success" class="rank rank-event">{{name}}</el-button>
                </el-col>


                <el-col v-if="event.rank!=''" :span="16" :offset="4" v-for="event in DataDisplay" >
                    <el-button type="warning" class="rank rank-rank">{{event.rank}}</el-button>
                    <el-button type="success" class="rank rank-name">{{event.name}}</el-button>
                    <el-button type="danger" class="rank rank-result">{{event.result}}</el-button>
                </el-col>



            </el-col>
        </el-row>
    </div>
</template>

<script>
    import fs from 'fs'
    import path  from 'path'
    const {ipcRenderer} = require('electron')


    export default {

        name: "prerank",
        data(){
            return{
                Prerank: {},
                DataDisplay : {},
                ItemDisplay : '',
            }
        },
        methods:{
            chooseEventDisplay: function (eventname) {
                this.ItemDisplay = eventname
                this.DataDisplay = this.Prerank[eventname]
            },
            refreshPreRank :function () {
                this.$emit('refresh-prerank')
            },
            ipcToMain : function (action) {
                let data = {}
                data.type = action
                data.result = this.DataDisplay
                data.itemname = this.ItemDisplay
                ipcRenderer.send('render-show-cubing-prerank', data)
                console.log('already',data)
            }
        },
        props : ['isdisplay','comname','comurl'],
        watch :{
            isdisplay :function () {
                var that = this
                if(this.isdisplay){
                    try{
                        var filepath = path.join(__dirname, './../../assets/Competitions/'+ that.comname + '/prerank.json' )
                        this.Prerank = JSON.parse(fs.readFileSync(filepath, 'utf8'))
                        console.log(this.Prerank)
                    }
                    catch(err){
                        that.$message.error('预排名不存在，请确认网址正确，或者已经爬取');
                        console.log('can not load schedule.json',err)
                    }
                }
            }
        }

    }
</script>

<style scoped>

    .rank{
        padding: 10px !important;
        margin-top: 5px !important;
    }
    .rank.rank-btn{
        width: 25%;
    }
    .rank.rank-event{
        width: 10%;
    }
    .rank-rank{
        width: 15%;
    }
    .rank-name{
        width: 50%;
    }
    .rank-result{
        width: 30%;
    }

</style>