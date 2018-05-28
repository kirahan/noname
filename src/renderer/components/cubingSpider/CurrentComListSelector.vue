<template>
    <div v-if="isdisplay">
        <el-row>
            <el-col :span="20">
                <el-button class="select-title">赛事列表</el-button>

                <el-cascader
                        :options="options"
                        :show-all-levels="false"
                        v-model="SelectedCompetition"
                ></el-cascader>

            </el-col>
        </el-row>
    </div>
</template>

<script>

    export default {
        name: "CurrentComListSelector",
        data(){
            return {
                SelectedCompetition : '',
                options : [
                    {
                        value: 'enrollOpen',
                        label: '报名中',
                        children : [
                        ],
                    },
                    {
                        value: 'enrollClose',
                        label: '已截止',
                        children : [
                        ],
                    },
                    {
                        value: 'enrollReady',
                        label: '即将开始',
                        children : [
                        ],
                    },
                    {
                        value: 'finish',
                        label: '已结束',
                        children : [
                        ],
                    }
                ],
            }
        },
        props : ['comlist'],
        created(){
                var that = this

                for (var type in this.comlist){
                    console.warn(type,that.comlist[type])
                    if(type == 'enrollOpen'){
                        console.warn(that.comlist[type])
                        for (var list of that.comlist[type]){
                            let buffer = {}
                            buffer.value = list.comurl
                            buffer.label = list.comname
                            that.options[0].children.push(buffer)
                        }

                    }
                    else if(type == 'enrollClose'){
                        for (var list of that.comlist[type]){
                            let buffer = {}
                            buffer.value = list.comurl
                            buffer.label = list.comname
                            that.options[1].children.push(buffer)
                        }
                    }
                    else if(type == 'enrollReady'){
                        for (var list of that.comlist[type]){
                            let buffer = {}
                            buffer.value = list.comurl
                            buffer.label = list.comname
                            that.options[2].children.push(buffer)
                        }
                    }
                    else if(type == 'finish'){
                        for (var list of that.comlist[type]){
                            let buffer = {}
                            buffer.value = list.comurl
                            buffer.label = list.comname
                            that.options[3].children.push(buffer)
                        }
                    }
                    else {
                        null
                    }
                }
            }

    }
</script>

<style scoped>
    .select-title{
        background-color: white;
    }

</style>