<template>
    <div id="SankeyView"  ref="sankey" class="Sankey">
        
    </div>
</template>

<script>

import * as d3 from 'd3'
import { sankey as d3Sankey, sankeyLinkHorizontal as d3SsankeyLinkHorizontal } from 'd3-sankey';
// import picking_hour_info from "@/assets/picking_hour_info_202301_202305.json"

export default {
    name: "Sankey",
    data() {
        return {
            width: '',
            height: '',
        }
    },
    methods: {
        // draw() {
        //     var data = [{ waveNumber: "W1", orderCount: 10, productCount: 20, pickingTime: 30 },
        //                 { waveNumber: "W2", orderCount: 5, productCount: 15, pickingTime: 25 },
        //                 { waveNumber: "W3", orderCount: 8, productCount: 18, pickingTime: 35 },
        //                 // ... 其他数据项
        //                 ];

        //     // 对数据按照订单数量进行排序
        //     data.sort((a, b) => b.orderCount - a.orderCount);

        //     let width = this.width
        //     let height = this.height

        //     // 创建 SVG 容器
        //     var svg = d3.select("#SankeyView")
        //                 .append("svg")
        //                 .attr("width", width)
        //                 .attr("height", height);

        //     // 创建桑基图布局
        //     var sankey = d3Sankey()
        //                     .nodeWidth(5) //矩形节点的宽度
        //                     .nodePadding(10) //矩形节点的间隙
        //                     .extent([[0, 0], [width, height]]);

        //     // 构建桑基图数据
        //     var sankeyData = {
        //                         nodes: [],
        //                         links: []
        //                     };
            
        //     data.forEach((d, i) => {
        //         sankeyData.nodes.push({ name: d.waveNumber });
        //         sankeyData.nodes.push({ name: "订单数量" });
        //         sankeyData.nodes.push({ name: "货品数量" });
        //         sankeyData.nodes.push({ name: "拣货时间" });

        //         sankeyData.links.push({ source: i * 4, target: i * 4 + 1, value: d.orderCount });
        //         sankeyData.links.push({ source: i * 4, target: i * 4 + 2, value: d.productCount });
        //         sankeyData.links.push({ source: i * 4, target: i * 4 + 3, value: d.pickingTime });
        //     });

        //     // 通过桑基图布局计算节点和链接的布局信息
        //     var { nodes, links } = sankey(sankeyData);
        //     console.log("nodes", nodes)
        //     console.log("links", links)

        //     // 创建连线
        //     var link = svg.append("g")
        //                 .selectAll("path")
        //                 .data(links)
        //                 .enter()
        //                 .append("path")
        //                 .attr("d", d3SsankeyLinkHorizontal())
        //                 .attr("fill", "none")
        //                 .attr("stroke", "black")
        //                 .attr("stroke-width", d => Math.max(1, d.width));

        //     // 创建节点
        //     var node = svg.append("g")
        //                 .selectAll("rect")
        //                 .data(nodes)
        //                 .enter()
        //                 .append("rect")
        //                 .attr("x", d => d.x0)
        //                 .attr("y", d => d.y0)
        //                 .attr("height", d => d.y1 - d.y0)
        //                 .attr("width", d => d.x1 - d.x0)
        //                 .attr("fill", d => {
        //                     if (d.depth === 0) return "#ccc";
        //                     if (d.depth === 1) return "steelblue";
        //                     return "lightgray";
        //                 });

        //     // // 创建节点标签
        //     // var label = svg.append("g")
        //     //             .selectAll("text")
        //     //             .data(nodes)
        //     //             .enter()
        //     //             .append("text")
        //     //             .attr("x", d => d.x0 + 10)
        //     //             .attr("y", d => (d.y1 + d.y0) / 2)
        //     //             .attr("dy", "0.35em")
        //     //             .text(d => d.name)
        //     //             .attr("fill", "white");

        //     // // 创建图例
        //     // var legend = svg.append("g")
        //     //                 .attr("transform", "translate(20,20)");

        //     // legend.append("rect")
        //     //     .attr("x", 0)
        //     //     .attr("y", 0)
        //     //     .attr("width", 15)
        //     //     .attr("height", 15)
        //     //     .attr("fill", "steelblue");

        //     // legend.append("text")
        //     //         .attr("x", 20)
        //     //         .attr("y", 12.5)
        //     //         .text("订单数量");

        //     // legend.append("rect")
        //     //     .attr("x", 0)
        //     //     .attr("y", 25)
        //     //     .attr("width", 15)
        //     //     .attr("height", 15)
        // },
       draw(){
        var data = [
            { waveNumber: "W1", orderCount: 10, productCount: 20, pickingTime: 30 },
            { waveNumber: "W2", orderCount: 5, productCount: 15, pickingTime: 25 },
            { waveNumber: "W3", orderCount: 8, productCount: 18, pickingTime: 35 },
            { waveNumber: "W4", orderCount: 9, productCount: 22, pickingTime: 15 }
        ];

        let width = this.width
        let height = this.height
        const margin = { top: 10, right: 10, bottom: 10, left: 10 };

        const svg = d3.select("#SankeyView")
                    .append('svg')
                    .attr('width', width)
                    .attr('height', height)
        var sum_order = 0
        var sum_product = 0
        var sum_pickingTime = 0
        for(let i = 0; i < data.length; i++) {
            // console.log(data[i].orderCount)
            sum_order += data[i].orderCount
            sum_product += data[i].productCount
            sum_pickingTime += data[i].pickingTime
        }
        

        function creatCountobj(waveNumber, orderCount, productCount, pickingTime) {
            let obj = new Object()
            obj.waveNumber = waveNumber
            obj.orderCount = orderCount
            obj.productCount = productCount
            obj.pickingTime = pickingTime
            return obj
        }
        var fineOrderList = []
        for(let i = 0; i < data.length; i++) {
            let o = creatCountobj(data[i].waveNumber, data[i].orderCount, data[i].productCount, data[i].pickingTime)
            fineOrderList.push(o)
        }

        // 创建一个用于排序的比较函数
        var compareOrder = function(a, b) {
            return b.orderCount - a.orderCount;
        };
        var compareProduct = function(a, b) {
            return b.productCount - a.productCount;
        };
        var comparePickingTime = function(a, b) {
            return b.pickingTime - a.pickingTime;
        };

        
        var stackOrder = []
        var tempOrder = 0
        // 使用比较函数对数据进行排序
        fineOrderList.sort(compareOrder);
        for(let i = 0; i < fineOrderList.length; i++) {
            stackOrder.push(tempOrder + fineOrderList[i].orderCount)
            tempOrder  += fineOrderList[i].orderCount
        }

        var tempProduct = 0
        var stackProduct = []
        
        fineOrderList.sort(compareProduct);
        for(let i = 0; i < fineOrderList.length; i++) {
            stackProduct.push(tempProduct + fineOrderList[i].productCount)
            tempProduct  += fineOrderList[i].productCount
        }

        var tempPickingTime = 0
        var stackPickingTime = []
        fineOrderList.sort(comparePickingTime);
        for(let i = 0; i < fineOrderList.length; i++) {
            stackPickingTime.push(tempPickingTime + fineOrderList[i].pickingTime)
            tempPickingTime  += fineOrderList[i].pickingTime
        }
        
        // console.log(sum_order)
        var orderScale = d3.scaleLinear()
                    .domain([0, sum_order])
                    .range([0, height]);
        // console.log("orderScale(10)", orderScale(10))
        var productScale = d3.scaleLinear()
                    .domain([0, sum_product])
                    .range([0, height]);
        var pickingTimeScale = d3.scaleLinear()
                    .domain([0, sum_pickingTime])
                    .range([0, height]);

        
        
        var colors = ["#C6D57E", "#D57E7E", "#A2CDCD", "#EB92BE"];

        // 绘制表示波次号的矩形
        svg.selectAll(".wave-rect")
            .data(data)
            .enter()
            .append("rect")
            .attr("class", "wave-rect")
            .attr("x", margin.left)
            .attr("y", (d, i) => {
                return margin.top + i * 40 + i * 80
            })
            .attr("width", 20)
            .attr("height", 40)
            .attr("fill", "gray");

        // 绘制表示订单数量的矩形
        svg.selectAll(".order-rect")
           .data(fineOrderList.sort(compareOrder))
           .enter()
           .append("rect")
           .attr("class", "order-rect")
           .attr("x", margin.left + 100)
           .attr("y", (d, i) => {
                // console.log(d)
                if(i === 0)
                    return 0
                else
                    return stackOrder[i - 1] / sum_order * height
           })
           .attr("width", 40)
           .attr("height", (d, i) => {
                return orderScale(d.orderCount)
           })
           .attr("fill", (d, i) =>{ 
                    if(d.waveNumber == "W1")
                      return colors[0]
                    if(d.waveNumber == "W2")
                      return colors[1]
                    if(d.waveNumber == "W3")
                      return colors[2]
                    if(d.waveNumber == "W4")
                      return colors[3]
                  });

            // 绘制表示货品数量的矩形
            svg.selectAll(".product-rect")
            .data(fineOrderList.sort(compareProduct))
            .enter()
            .append("rect")
            .attr("class", "product-rect")
            .attr("x", margin.left + 200)
            .attr("y", (d, i) => {
                    if(i === 0)
                        return 0
                    else
                        return stackProduct[i - 1] / sum_product * height
            })
            .attr("width", 40)
            .attr("height", (d, i) => {
                    return productScale(d.productCount)
            })
            .attr("fill", (d, i) =>{ 
                        if(d.waveNumber == "W1")
                        return colors[0]
                        if(d.waveNumber == "W2")
                        return colors[1]
                        if(d.waveNumber == "W3")
                        return colors[2]
                        if(d.waveNumber == "W4")
                        return colors[3]
                    });


            // 绘制表示拣货时间的矩形
            svg.selectAll(".time-rect")
            .data(fineOrderList.sort(comparePickingTime))
            .enter()
            .append("rect")
            .attr("class", "time-rect")
            .attr("x", margin.left + 350)
            .attr("y", (d, i) => {
                    if(i === 0)
                        return 0
                    else
                        return stackPickingTime[i - 1] / sum_pickingTime * height
            })
            .attr("width", 40)
            .attr("height", (d, i) => {
                    return pickingTimeScale(d.pickingTime)
            })
            .attr("fill", (d, i) =>{ 
                        if(d.waveNumber == "W1")
                        return colors[0]
                        if(d.waveNumber == "W2")
                        return colors[1]
                        if(d.waveNumber == "W3")
                        return colors[2]
                        if(d.waveNumber == "W4")
                        return colors[3]
                    });

// // 绘制连接线
// svg.selectAll(".connect-line")
//    .data(data)
//    .enter()
//    .append("line")
//    .attr("class", "connect-line")
//    .attr("x1", (d, i) => widthScale(d.waveNumber) + widthScale.bandwidth() / 2)
//    .attr("y1", height)
//    .attr("x2", (d, i) => widthScale(d.waveNumber) + widthScale.bandwidth() / 2)
//    .attr("y2", d => height - heightScale(d.orderCount) - heightScale(d.productCount) - heightScale(d.pickingTime))
//    .attr("stroke", "black");
       }
    },
    mounted() {
        this.width = this.$refs.sankey.offsetWidth
        this.height = this.$refs.sankey.offsetHeight
        this.draw()
    }
}

</script>

<style scoped>
.Sankey{
    width: 100%;
    height: 100%;
}
</style>
