<template>
    <div >
        <el-row :gutter="0">

            <el-col v-if="data.mode=='single'" :span="16" :offset="4" v-for="player,index in data.result">
                <div class="grid-content bg-purple" >
                    <el-button type="danger" class="result result-20" >{{index + data.range}}</el-button>
                    <el-button type="warning" class="result result-50">{{player.playerName}}</el-button>
                    <el-button type="primary" class="result result-30" >{{player.result}}</el-button>
                </div>
            </el-col>

            <el-col v-if="data.mode=='average'" :span="20" :offset="2" v-for="player,index in data.result">
                <div class="grid-content bg-purple" >
                    <el-button-group style="width: 38%;">
                        <el-button type="danger" class="result result-30" >{{index + data.range}}</el-button>
                        <el-button type="warning" class="result result-65">{{player.playerName}}</el-button>
                    </el-button-group >
                    <el-button-group style="width: 60%;">
                        <el-button type="primary" class="result result-value" >{{player.result}}</el-button>
                        <el-button v-for="result in player.detail" type="danger" class="result result-value-small" >{{result}}</el-button>
                    </el-button-group >
                </div>
            </el-col>
        </el-row>

    </div>
</template>

<script>
    export default {
        name: "RankPanel",
        data(){
            return {

            }
        },
        methods :{

        },
        props:['data','workingcounter'],
        watch :{}
    }
</script>

<style scoped>
    .result{
        padding: 8px !important;
        margin-top: 5px !important;
        color: white;
        font-size: 20px;
        text-shadow: 0 0 1px #4a77dc, 0 0 1px #5379dc, 0 0 1px #2e58e7, 0 0 1px #00ade7, 0 0 1px #00ade7, 0 0 1px #00ade7, 0 0 1px #00ade7;
    }
    .result.result-index{
        width: 5%;
    }
    .result.result-value{
        width: 20%;
    }
    .result.result-value-small{
        width: 15%;
    }
    .result.result-player{
        width: 50%;
    }
    .result.result-competition{
        width: 35%;
    }
    .result-20{
        width: 20%;
    }
    .result-30{
        width: 30%;
    }
    .result-50{
        width: 45%;
    }
    .result-65{
        width : 65%
    }

</style>