<template>
    <div :id="myId"  ref="timeline" class="Timeline">
        
    </div>
</template>

<script>

import * as d3 from 'd3'

// import picking_hour_info from "@/assets/picking_hour_info_202301_202305.json"

export default {
    name: "Timeline",
    data() {
        return {
            width: '',
            height: '',
            rawData: '',
            myId: "TimelineView" + Date.now()
        }
    },
    props: ['date'],
    methods: {
        // 绘制一个流图
        drawTimelineOnly() {
            // d3.select('#TimelineView').selectAll('*').remove();
            let rawData; // 用于绘制流图，只包含某天的数据
            let sliceData; // 用于寻找最值，包括一个月的数据
            
            console.log("this.date", this.date)

            sliceData =  this.rawData.RECORDS.filter((record) => {
                return record.dateinfo.includes(this.date.slice(0, 7)); 
            });

            // console.log("sliceData", sliceData)

            // 寻找某个月最大的波次数量和订单数量
            var maxBatchNumCntHour = -Infinity;
            var maxOrderNumCntHour = -Infinity;
            for (var i = 0; i < sliceData.length; i++) {
                var record = sliceData[i];
                maxBatchNumCntHour = Math.max(maxBatchNumCntHour, record.batchNumCntHour);
                maxOrderNumCntHour = Math.max(maxOrderNumCntHour, record.orderNumCntHour);
            }
            this.$store.commit('setMaxBatchNumCntHour', maxBatchNumCntHour)
            this.$store.commit('setMaxOrderNumCntHour', maxOrderNumCntHour)

            // console.log("maxBatchNumCntHour", maxBatchNumCntHour)
            // console.log("maxOrderNumCntHour", maxOrderNumCntHour)

            rawData =  this.rawData.RECORDS.filter((record) => {
                    return record.dateinfo === this.date; // 原始数据包含5个月，需要返回只包含对应天的数据
                });
            // console.log("rawData", rawData)
            
            let xValues_tmp = []
            let yBatchValues_tmp = []
            let yOrderValues_tmp = []
            for(let i = 0; i < rawData.length; i++) {
                xValues_tmp.push(rawData[i].hourinfo)
                yBatchValues_tmp.push(rawData[i].batchNumCntHour)
                yOrderValues_tmp.push(-rawData[i].orderNumCntHour)
            }

            let xValues_arr= new Array(24)
            let yBatchValues_arr = new Array(24)
            let yOrderValues_arr = new Array(24)
            let index = 0
            
            for(let i = 0; i < 24; i++){
                let flag = xValues_tmp.includes(i.toString())
                if(flag == false){
                    xValues_arr[i] = i.toString()
                    yBatchValues_arr[i] = "0"
                    yOrderValues_arr[i] = "0"
                } else {
                    xValues_arr[i] = i.toString()
                    yBatchValues_arr[i] = rawData[index].batchNumCntHour
                    yOrderValues_arr[i] = -rawData[index].orderNumCntHour
                    index++
                }
            }
            
            let datalist = []
            function creatCountobj(hour, batchNum, orderNum) {
                let obj = new Object()
                obj.hour = hour
                obj.batchNum = batchNum
                obj.orderNum = orderNum
                return obj
            }
            for(let i = 0; i < 24; i++){
                let o = creatCountobj(xValues_arr[i], yBatchValues_arr[i], yOrderValues_arr[i])
                
                datalist.push(o)
            }
            // console.log("datalist", datalist)

            let width = this.width
            let height = this.height
            const margin = { top: 10, right: 10, bottom: 10, left: 10 };
            let maxBatchNum = this.$store.state.maxBatchNumCntHour
            let maxOrderNum = this.$store.state.maxOrderNumCntHour

            // console.log("this.$store.state.maxBatchNumCntHour", maxBatchNum)
            // console.log("this.$store.state.maxOrderNumCntHour", maxOrderNum)

            const svg = d3.select("#" + this.myId)
                        .append('svg')
                        .attr('width', width)
                        .attr('height', height)
            
            var xScale = d3.scaleLinear()
                            .domain([0, 23])
                            .range([margin.left, width - margin.right]);

            var yScaleBatch = d3.scaleLinear()
                                .domain([0, maxBatchNum])
                                .range([height * 0.5, margin.top]);

            // var yScaleOrder = d3.scaleLinear()
            //                     .domain([-maxOrderNumCntHour, 0])
            //                     .range([height - margin.bottom, height * 0.5]);
            
            var yScaleOrder = d3.scaleLinear()
                                .domain([0, maxOrderNum])
                                .range([height * 0.5, height - margin.bottom]);
            
            const areaBatch = d3.area()
                                .x((d, i) => {                                  
                                    return xScale(d.hour)   
                                })
                                .y0((d, i) => {                           
                                    return height * 0.5
                                })
                                .y1((d, i) => {                                  
                                    return yScaleBatch(d.batchNum)
                                })
                                .curve(d3.curveMonotoneX);

            const areaOrder = d3.area()
                                .x((d, i) => {
                                    return xScale(d.hour)
                                })
                                .y0((d, i) => {                                   
                                    return height * 0.5
                                })
                                .y1((d, i) => {                         
                                    return yScaleOrder(-d.orderNum)
                                })
                                .curve(d3.curveMonotoneX);
            
            svg.append("path")
                .datum(datalist)
                .attr("fill", "steelblue")
                .attr("d", areaBatch);


            svg.append("path")
                .datum(datalist)
                .attr("fill", "orange")
                .attr("d", areaOrder);

            svg.append("g")
                .attr("transform", "translate(0," + height * 0.5 + ")")
                .call(d3.axisBottom(xScale).ticks(24));

            
            svg.append("g")
                .attr("transform", "translate(" + margin.left + ",0)")
                .call(d3.axisRight(yScaleBatch).ticks(5));

            svg.append("g")
                .attr("transform", "translate(" + margin.left + ",0)")
                .call(d3.axisRight(yScaleOrder).ticks(5));
            
            //设置横轴刷选
            const brush = d3.brushX()
                    // .extent([[padding.left, padding.top], [line_width - padding.right - padding.left, line_height - padding.bottom]])
                    .extent([[0, margin.top], [width - margin.right, height - margin.bottom]])
                    .on("end", brushed)

            var date_range = []
            
            //定义具体的刷选事件
            function brushed({selection}) {
                if(selection != null){
                    // console.log(selection.map(xScale.invert))
                    date_range = selection.map(xScale.invert)
                    console.log("date_range", date_range)
                    // _this.$emit('func', date_range)
                }       
            }

            svg.append("g")
                    .attr("class", "time_brush")
                    .call(brush)
                    .select(".selection")
                    .attr("fill", "#ffd92f")

            

            // 创建拖拽行为
            var drag = d3.drag()
            .on("start", dragStarted)
            .on("drag", dragged)
            .on("end", dragEnded);

            // 拖拽开始时的处理函数
            function dragStarted() {
            d3.select(this).raise().classed("active", true);
            }

            // 拖拽过程中的处理函数
            function dragged(event, d) {
            d3.select(this)
                .attr("y", event.y);
            }

            // 拖拽结束时的处理函数
            function dragEnded() {
            d3.select(this).classed("active", false);
            }

            // 将拖拽行为应用到矩形元素上
            d3.select("#" + this.myId).call(drag);
            
            var tooltip = d3.select("#" + this.myId)
                            .append("div")
                            .attr("class", "tooltip")
                            .style("opacity", 0);
            
            // 在面积图的数据点上添加悬浮事件处理器
            // svg.selectAll("path")
            // .on("mouseover", function(d) {
            //     console.log("d", d)
            //     // 更新提示框的内容和位置
            //     tooltip.html("Value: " + d.value)
            //     .style("left", (d3.event.pageX + 10) + "px")
            //     .style("top", (d3.event.pageY - 10) + "px")
            //     .style("opacity", 1);
            // })
            // .on("mouseout", function(d) {
            //     // 隐藏提示框
            //     tooltip.style("opacity", 0);
            // });
            
        },
       
    },
    mounted() {
        this.width = this.$refs.timeline.offsetWidth
        this.height = this.$refs.timeline.offsetHeight
        this.rawData = require('@/assets/picking_hour_info_202301_202305.json')
        this.drawTimelineOnly();
    }
}

</script>

<style scoped>
.Timeline{
    width: 100%;
    height: 50%;
    scroll-snap-align: center;
    /* overflow: scroll; */
}
.tooltip {
  position: absolute;
  background-color: #fff;
  border: 1px solid #ccc;
  padding: 10px;
  opacity: 0;
}
</style>
