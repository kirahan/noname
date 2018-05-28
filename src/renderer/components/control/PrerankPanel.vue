<template>
    <div >
        <el-row :gutter="0">
            <el-col :span="16" :offset="4" style="margin-top: 50px">
                <el-button type="primary" class="rank rank-title">{{data.itemname}}预排名</el-button>
            </el-col>

            <el-col  :span="16" :offset="4" v-for="list in data.result" >
                <div v-if="list.rank!='' && list.rank<=15">
                    <el-button type="warning" class="rank rank-rank">{{list.rank}}</el-button>
                    <el-button type="info" class="rank rank-name">{{list.name}}</el-button>
                    <el-button type="danger" class="rank rank-result">{{list.result}}</el-button>
                </div>
            </el-col>
        </el-row>

    </div>
</template>

<script>
    export default {
        name: "PrerankPanel",
        data(){
            return {

            }
        },
        methods :{},
        props:['data','workingcounter'],
        watch :{}
    }
</script>

<style scoped>

    .rank{
        padding: 10px !important;
        margin-top: 5px !important;
        color: white;
        font-size: 20px;
        text-shadow: 0 0 1px #4a77dc, 0 0 1px #5379dc, 0 0 1px #2e58e7, 0 0 1px #00ade7, 0 0 1px #00ade7, 0 0 1px #00ade7, 0 0 1px #00ade7;

    }
    .rank-title{
        font-size: 40px;
        width: 100%;
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