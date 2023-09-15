<template>
    <div id="TimelineView" ref="timeline">
        
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
        }
    },
    methods: {
        drawTimeline() {
            let rawData = require('@/assets/picking_hour_info_202301_202305.json');
            console.log(rawData);

            let width = this.width
            let height = this.height
            
            
            
            // 数据处理
            var formattedData = rawData.RECORDS.map(function(d) {
                return {
                    hour: +d.hourinfo,
                    batchNum: +d.batchNumCntHour,
                    orderNum: +d.orderNumCntHour
                };
            });

            // 创建堆叠面积图
            var margin = { top: 20, right: 30, bottom: 30, left: 40 };
            var viewwidth = width - margin.left - margin.right;
            var viewheight = height - margin.top - margin.bottom;

            let svg = d3.select('#TimelineView')
                        .append('svg')
                        .classed('timeline', true)
                        .attr('width', viewwidth + margin.left + margin.right)
                        .attr('height', viewheight + margin.top + margin.bottom)
            
            console.log(svg)

            var x = d3.scaleLinear()
                    .domain([0, 23])
                    .range([0, viewwidth]);

            var y = d3.scaleLinear()
                    .domain([0, d3.max(formattedData, function(d) { return d.batchNum + d.orderNum; })])
                    .range([viewheight, 0]);

            var area = d3.area()
                    .x(function(d) { return x(d.data.hour); })
                    .y0(function(d) { return y(d[0]); })
                    .y1(function(d) { return y(d[1]); });
            
            // console.log("x" + x)
            // console.log("y" + y)
            // console.log("area" + area)

            var stack = d3.stack()
                    .keys(["batchNum", "orderNum"])
                    .offset(d3.stackOffsetNone);

            var stackedData = stack(formattedData);

            var color = d3.scaleOrdinal()
                    .domain(["batchNum", "orderNum"])
                    .range(["#98abc5", "#8a89a6"]);

            svg.selectAll(".area")
                .data(stackedData)
                .join("path")
                .attr("class", "area")
                .attr("d", area)
                .style("fill", function(d) { return color(d.key); });

            // 添加x轴
            
            svg.append("g")
                .attr("class", "axis")
                .attr("transform", "translate(0," + viewheight + ")")
                .call(d3.axisBottom(x).ticks(24));

            // 添加y轴
            svg.append("g")
                .attr("class", "axis")
                .call(d3.axisLeft(y).ticks(5));



            // 添加图例
            var legend = svg.selectAll(".legend")
            .data(color.domain())
            .join("g")
            .attr("class", "legend")
            .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

            legend.append("rect")
            .attr("x", viewwidth - 18)
            .attr("width", 18)
            .attr("height", 18)
            .style("fill", color);

            legend.append("text")
            .attr("x", viewwidth - 24)
            .attr("y", 9)
            .attr("dy", ".35em")
            .style("text-anchor", "end")
            .text(function(d) { return d; });
        }
    },
    mounted() {
        this.width = this.$refs.timeline.offsetWidth
        this.height = this.$refs.timeline.offsetHeight * 0.98
        this.drawTimeline();
    }
}

</script>

<style scoped>
#TimelineView{
    position: absolute;
    width: 100%;
    height: 100%;
}
</style>
