<template>
    <div id="container">
        <el-row id="wrapper">
            <el-col :span="4" id="firstcol">
                <Calendar></Calendar>
            </el-col>

            <el-col :span="10" id="secondcol">
                <el-row style="height: 50%;">
                    <Timeline></Timeline>
                </el-row>
                <el-row style="height: 50%;">
                    <el-col :span="12"></el-col>
                    <el-col :span="12">
                      <MareyChart></MareyChart>
                    </el-col>
                </el-row>
            </el-col>

            <el-col :span="10" id="thirdcol">
                <el-row style="height: 50%;">

                </el-row>
                <el-row style="height: 50%;">
                    
                </el-row>
            </el-col>
        </el-row>
    </div>
</template>
  
<script>

import Calendar from "@/components/Calendar"
import Timeline from "@/components/Timeline"
import MareyChart from "@/components/MareyChart.vue";
  
export default {
    name: "homepage",
    components: {
      MareyChart,
        Calendar,
        Timeline
    }
};
</script>
  
<style>
#container{
    height: 100%;
    width: 100%;
    position: absolute;
    left: 0;
    top: 0;
  overflow: auto;
}
#wrapper{
    height: 100%;
    
}

#firstcol{
    height: 100%;
  
}
#secondcol{
    height: 100%;
 
}
#thirdcol{
    height: 100%;
 
}
</style>
  