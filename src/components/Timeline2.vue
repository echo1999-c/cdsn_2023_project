<template>
    <div id="TimelineView2" ref="timeline2">
        
    </div>
</template>

<script>

import * as d3 from 'd3'

// import picking_hour_info from "@/assets/picking_hour_info_202301_202305.json"

export default {
    name: "Timeline2",
    data() {
        return {
            width: '',
            height: '',
        }
    },
    methods: {
        drawTimeline() {
            let rawData = require('@/assets/picking_hour_info_202301.json');
            console.log(rawData);

            let width = this.width
            let height = this.height

            console.log("width" + width)
            console.log("height" + height)
            
            
            // Extract x and y values from data
            const xValues = rawData.RECORDS.map(d => d.hourinfo);
            const yBatchValues = rawData.RECORDS.map(d => d.batchNumCntHour);
            const yOrderValues = rawData.RECORDS.map(d => -d.orderNumCntHour); // Negative values for orderNumCntHour
            
            let xValues_tmp = []
            let yBatchValues_tmp = []
            let yOrderValues_tmp = []
            for(let i = 0; i < xValues.length; i++) {
                xValues_tmp.push(xValues[i])
                yBatchValues_tmp.push(yBatchValues[i])
                yOrderValues_tmp.push(yOrderValues[i])
            }

            let xValues_arr= new Array(24)
            let yBatchValues_arr = new Array(24)
            let yOrderValues_arr = new Array(24)
            let index = 0
            
            for(let i = 0; i < 24; i++){
                // console.log("i" + i)
                let flag = xValues_tmp.includes(i.toString())
                console.log("flag" + flag)
                if(flag == false){
                    xValues_arr[i] = i.toString()
                    yBatchValues_arr[i] = "0"
                    yOrderValues_arr[i] = "0"
                } else {
                    xValues_arr[i] = i.toString()
                    yBatchValues_arr[i] = yBatchValues[index]
                    yOrderValues_arr[i] = yOrderValues[index]
                    index++
                }
            }
            console.log(yOrderValues_arr)
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
                console.log(o)
                datalist.push(o)
            }
            
            console.log("datalist", datalist)

            // Set up chart dimensions
            const margin = { top: 20, right: 20, bottom: 40, left: 50 };
            const viewwidth = width - margin.left - margin.right;
            const viewheight = height - margin.top - margin.bottom;

            // Create SVG element
            const svg = d3.select("#TimelineView2")
                        .append('svg')
                        .classed('timeline', true)
                        .attr('width', width)
                        .attr('height', height)
            


            // Define x and y scales
            var xScale = d3.scaleLinear()
                            .domain([0, 23])
                            .range([0, width - margin.right]);

            var yScaleBatch = d3.scaleLinear()
                                .domain([0, d3.max(yBatchValues)])
                                .range([height * 0.3, margin.top]);

            var yScaleOrder = d3.scaleLinear()
                                .domain([d3.min(yOrderValues), 0])
                                .range([height - margin.bottom, height * 0.3]);
            
            // var yScaleOrder = d3.scaleLinear()
            //                     .domain([0, d3.max(yBatchValues)])
            //                     .range([100, 0]);
            

            console.log("d3.min(yOrderValues)" + d3.min(yOrderValues))

            console.log("d3.max(yBatchValues)" + d3.max(yBatchValues))

            // const yScale = d3.scaleLinear()
            //     .domain([d3.min(yOrderValues), d3.max(yBatchValues)])
            //     .range([height, 0]);
        
            
            const curveInterpolatorBatchNum = d3.curveCardinal; // 曲线插值器，这里使用Cardinal样条曲线
            const curveInterpolatorOrderNum = d3.curveCardinal;

            const lineGeneratorBatchNum = d3.line()
                                    .x(d => {
                                        console.log(d)
                                        return xScale(d.hour)
                                    })
                                    .y(d => yScaleBatch(d.batchNum))
                                    .curve(curveInterpolatorBatchNum);
            
            const lineGeneratorOrderNum = d3.line()
                                    .x(d => {
                                        console.log(d)
                                        return xScale(d.hour)
                                    })
                                    .y(d => yScaleOrder(d.orderNum))
                                    .curve(curveInterpolatorOrderNum);


            // Define the area functions
            const areaBatch = d3.area()
                                .x((d, i) => {
                                    // console.log(d)
                                    return xScale(d.hour)   
                                })
                                .y0(height * 0.3)
                                .y1((d, i) => {
                                    return yScaleBatch(d.batchNum)
                                })
                                .curve(d3.curveMonotoneX);

            const areaOrder = d3.area()
                                .x((d, i) => {
                                    return xScale(d.hour)
                                })
                                .y0(height * 0.3)
                                .y1((d, i) => {
                                    return yScaleOrder(d.orderNum)
                                })
                                .curve(d3.curveMonotoneX);
            
            // Draw the areas
            svg.append("path")
                .datum(datalist)
                .attr("fill", "steelblue")
                .attr("d", areaBatch);

            svg.append("path")
                .datum(datalist)
                .attr("fill", "orange")
                .attr("d", areaOrder);

            // Add x axis
            svg.append("g")
                .attr("transform", "translate(0," + height * 0.3 + ")")
                .call(d3.axisBottom(xScale).ticks(24));

            // Add y axis for batchNumCntHour
            svg.append("g")
                .call(d3.axisRight(yScaleBatch).ticks(5));

            svg.append("g")
                .call(d3.axisRight(yScaleOrder).ticks(5));
            
        }
    },
    mounted() {
        this.width = this.$refs.timeline2.offsetWidth
        this.height = this.$refs.timeline2.offsetHeight * 0.98
        this.drawTimeline();
    }
}

</script>

<style scoped>
#TimelineView2{
    position: absolute;
    width: 100%;
    height: 100%;
}
</style>
