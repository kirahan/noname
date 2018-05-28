<template>
    <div v-if="isdisplay">
        <el-row :gutter="10">
            <el-col :span="20"></el-col>
        </el-row>
    </div>
</template>

<script>
    export default {
        name: "statistics",
        data(){
            return{

            }
        },
        props : ['isdisplay']
    }
</script>

<style scoped>

</style>