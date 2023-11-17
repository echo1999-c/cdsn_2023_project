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
       draw(){
            var data = [
                { waveNumber: "W1", orderCount: 10, productCount: 20, pickingTime: 30 },
                { waveNumber: "W2", orderCount: 5, productCount: 15, pickingTime: 25 },
                { waveNumber: "W3", orderCount: 8, productCount: 18, pickingTime: 35 },
                { waveNumber: "W4", orderCount: 9, productCount: 22, pickingTime: 15 }
            ];
            // console.log("data", data)
            
            

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
            

            // function creatCountobj(waveNumber, orderCount, productCount, pickingTime) {
            //     let obj = new Object()
            //     obj.waveNumber = waveNumber
            //     obj.orderCount = orderCount
            //     obj.productCount = productCount
            //     obj.pickingTime = pickingTime
            //     return obj
            // }

            
            var orderSort = data.slice().sort(function(a, b) {
                return b.orderCount - a.orderCount;
            });

            var productSort = data.slice().sort(function(a, b) {
                return b.productCount - a.productCount;
            });
            
            var timeSort = data.slice().sort(function(a, b) {
                return b.pickingTime - a.pickingTime;
            });

            var globalList = []
            globalList.push(data.slice(), orderSort, productSort, timeSort)
            // console.log("globalList", globalList)
            
            
            var stackOrder = []
            var tempOrder = 0
            for(let i = 0; i < orderSort.length; i++) {
                stackOrder.push(tempOrder + orderSort[i].orderCount)
                tempOrder  += orderSort[i].orderCount
            }
            // console.log("stackOrder", stackOrder)
        

            
            var stackProduct = []
            var tempProduct = 0
            for(let i = 0; i < productSort.length; i++) {
                stackProduct.push(tempProduct + productSort[i].productCount)
                tempProduct  += productSort[i].productCount
            }
            // console.log("stackProduct", stackProduct)
        

            
            var stackPickingTime = []
            var tempPickingTime = 0
            for(let i = 0; i < timeSort.length; i++) {
                stackPickingTime.push(tempPickingTime + timeSort[i].pickingTime)
                tempPickingTime  += timeSort[i].pickingTime
            }
            // console.log("stackPickingTime", stackPickingTime)
            
            
            var orderScale = d3.scaleLinear()
                        .domain([0, sum_order])
                        .range([0, height]);
        
            var productScale = d3.scaleLinear()
                        .domain([0, sum_product])
                        .range([0, height]);

            var pickingTimeScale = d3.scaleLinear()
                        .domain([0, sum_pickingTime])
                        .range([0, height]);

            
            var colors = ["#C6D57E", "#D57E7E", "#A2CDCD", "#EB92BE"];

            var viewHeight = height - margin.top - margin.bottom
            var gapSpace = 20
            var number = data.length
            var batchHeight = (viewHeight - (number - 1) * gapSpace) / number

            let tooltip = d3.select('#SankeyView')
                            .append("div")
                            .attr("class", "tool-tip");
            let selectedStrokeWidth = 2
            
            var rectWidth = 40
            // 绘制并列的堆叠矩形
            for(var j = 0; j < 4; j++) {
                var rects = svg.append("g")
                    .selectAll("g")
                    .data(globalList[j])
                    .join("rect")
                    .attr("id", (d, i) => {
                        if(j == 0) return "batch " + d.waveNumber
                        else if(j == 1) return "orderCount " + d.waveNumber
                        else if(j == 2) return "productCount " + d.waveNumber
                        else if(j == 3) return "pickingTime " + d.waveNumber
                    })
                    .attr("class", (d, i) => {
                        // if(j == 0) return "wavenumber_sel " + d.waveNumber
                        // else if(j == 1) return "orderCount_" + d.waveNumber     
                        // else if(j == 2) return "productCount_" + d.waveNumber
                        // else if(j == 3) return "pickingTime_" + d.waveNumber
                        if(j == 0)
                            return "wavenumber_sel " + d.waveNumber
                        else  
                            return "node " + d.waveNumber
                    })
                    .attr("waveNumber",  (d, i) => {
                            return d.waveNumber
                    })
                    .attr("x", (d,i) => {
                        return   20 + j * 80            
                    })
                    .attr("y", (d, i) => {
                        if(j == 0) {
                            return 100 + i * 80 + i * 10
                        } else {
                            if(i == 0)
                                return 0
                            else {
                                if(j == 1) return orderScale(stackOrder[i - 1])     
                                else if(j == 2) return productScale(stackProduct[i - 1])
                                else if(j == 3) return pickingTimeScale(stackPickingTime[i - 1])
                            }
                        }
                    })
                    .attr("height", (d, i) => {
                        if(j == 0) {
                            return 30
                        }
                        else if(j == 1) {
                            return orderScale(d.orderCount)
                        }    
                        else if(j == 2) {
                            return productScale(d.productCount)
                        }
                        else if(j == 3) {
                            return pickingTimeScale(d.pickingTime)
                        }
                    })
                    .attr("width", (d, i) => {
                        return rectWidth
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
                    })
                    .style("fill-opacity", 1)
                    // .attr('stroke', (d, i) =>{ 
                    //     if(d.waveNumber == "W1")
                    //         return colors[0]
                    //     if(d.waveNumber == "W2")
                    //         return colors[1]
                    //     if(d.waveNumber == "W3")
                    //         return colors[2]
                    //     if(d.waveNumber == "W4")
                    //         return colors[3]
                    // })
                    // .attr('stroke-width', 1)                                  
                    .on("mousemove", function (event, d) {
                        let toElementId = event.toElement.id
                        let columnName = toElementId.substring(0, toElementId.indexOf(' '));
                        console.log("columnName", columnName)
                        
                       
                        let html = ''
                        if(columnName == 'batch')
                            html += `waveNumber: ${d.waveNumber} <br>`
                        else if(columnName == 'orderCount')
                            html += `waveNumber: ${d.waveNumber} <br>
                                    orderCount: ${d.orderCount} <br>`
                        else if(columnName == 'productCount')
                            html += `waveNumber: ${d.waveNumber} <br>
                                    productCount: ${d.productCount} <br>`
                        else if(columnName == 'pickingTime')
                            html += `waveNumber: ${d.waveNumber} <br>
                                    pickingTime: ${d.pickingTime} <br>`
                        
                        tooltip.style("left", event.clientX - 280  + 'px')
                                .style("top", event.layerY + 50 + 'px')
                                .style("width", 150 + 'px')
                                .style("display", "inline-block")
                                .html(html);
                        
                        let thisPath = d3.select(this)
                        console.log("thisPath", thisPath)
                        thisPath.style('stroke-width', 5)
                    })
                    .on("mouseout", function (event, d) {
                        tooltip.style("display", "none")
                        let thisPath = d3.select(this)
                        thisPath.style('stroke-width', 1)
                    })

                //创建对象
                function createLink(waveNumber, x, y, h){
                    var o = new Object()
                    o.waveNumber = waveNumber;
                    o.x = x;
                    o.y = y;
                    o.h = h
                    return o;
                }

                function Link(source, target){
                    var o = new Object()
                    o.source = source;
                    o.target = target;
                    return o;
                } 
                
                var link_list = []
                for(var x = 0; x < globalList.length - 1; x++){
                    for(var y = 0; y < globalList[x].length; y++){
                        var temp_loc = 0 //定位下一列中的坐标
                        for(var z = 0; z < globalList[x].length; z++){
                            if(globalList[x][y].waveNumber == globalList[x + 1][z].waveNumber){
                                temp_loc = z
                            }
                        } 
                        // console.log("temp_loc", temp_loc)
                        var temp1 = globalList[x][y] //source所在的矩形
                        var temp2 = globalList[x + 1][temp_loc] //target所在的矩形

                        if(x == 0) {
                            var creatlink1 = createLink(temp1.waveNumber, 0, 100 + y * 80 + y * 10, 30)
                            var creatlink2
                            if(temp_loc == 0) {
                                creatlink2 = createLink(temp2.waveNumber, 0, 0, orderScale(temp2.orderCount))
                            } else {
                                creatlink2 = createLink(temp2.waveNumber, 0, orderScale(stackOrder[temp_loc - 1]), orderScale(temp2.orderCount))
                            }
                            var link = Link(creatlink1, creatlink2)
                            link_list.push(link)
                        }

                        else if(x == 1) { // 从orderCount到productCount
                            // console.log("temp1.orderCount", temp1.orderCount)
                            // console.log("temp2.productCount", temp2.productCount)
                            if(y == 0 && temp_loc == 0){               
                                var creatlink1 = createLink(temp1.waveNumber, 0, 0, orderScale(temp1.orderCount))
                                var creatlink2 = createLink(temp2.waveNumber, 0, 0, productScale(temp2.productCount))
                            }
                            else if(y == 0 && temp_loc != 0){                         
                                var creatlink1 = createLink(temp1.waveNumber, 0, 0, orderScale(temp1.orderCount))
                                var creatlink2 = createLink(temp2.waveNumber, 0, productScale(stackProduct[temp_loc - 1]), productScale(temp2.productCount))
                            }
                            else if(y != 0 && temp_loc == 0){
                                var creatlink1 = createLink(temp1.waveNumber, 0, orderScale(stackOrder[y-1]), orderScale(temp1.orderCount))
                                var creatlink2 = createLink(temp2.waveNumber, 0, 0, productScale(temp2.productCount))
                            }
                            else if(y != 0 && temp_loc != 0){
                                var creatlink1 = createLink(temp1.waveNumber, 0, orderScale(stackOrder[y-1]), orderScale(temp1.orderCount))
                                var creatlink2 = createLink(temp2.waveNumber, 0, productScale(stackProduct[temp_loc - 1]), productScale(temp2.productCount))
                            }
                            var link = Link(creatlink1, creatlink2)
                            link_list.push(link)
                        }
                        else if(x == 2) {
                            if(y == 0 && temp_loc == 0){
                                var creatlink1 = createLink(temp1.waveNumber, 0, 0, productScale(temp1.productCount))
                                var creatlink2 = createLink(temp2.waveNumber, 0, 0, pickingTimeScale(temp2.pickingTime))
                            }
                            else if(y == 0 && temp_loc != 0){
                                var creatlink1 = createLink(temp1.waveNumber, 0, 0, productScale(temp1.productCount))
                                var creatlink2 = createLink(temp2.waveNumber, 0, pickingTimeScale(stackPickingTime[temp_loc - 1]), pickingTimeScale(temp2.pickingTime))
                            }
                            else if(y != 0 && temp_loc == 0){
                                var creatlink1 = createLink(temp1.waveNumber, 0, productScale(stackProduct[y-1]), productScale(temp1.productCount))
                                var creatlink2 = createLink(temp2.waveNumber, 0, 0, pickingTimeScale(temp2.pickingTime))
                            } 
                            else if(y != 0 && temp_loc != 0) {
                                var creatlink1 = createLink(temp1.waveNumber, 0, productScale(stackProduct[y-1]), productScale(temp1.productCount))
                                var creatlink2 = createLink(temp2.waveNumber, 0, pickingTimeScale(stackPickingTime[temp_loc - 1]), pickingTimeScale(temp2.pickingTime))
                            }
                            var link = Link(creatlink1, creatlink2)
                            link_list.push(link)
                        }
                    }
                }
            //     console.log("link_list", link_list)     
                
                function link_path(d) {
                    // cx1 cx2 cx3 cy4 控制点，用于绘制贝塞尔曲线
                    var cx1 = d.x1 + (d.x2 - d.x1) / 3;
                    var cy1 = d.upy1;
                    var cx2 = d.x1 + (d.x2 - d.x1) * 2 / 3;
                    var cy2 = d.upy2
                    
                    var cx3 = d.x2 + (d.x1 - d.x2) / 3;
                    var cy3 = d.downy2;
                    var cx4 = d.x2 + (d.x1 - d.x2) * 2 / 3;
                    var cy4 = d.downy1

                    return "M" + d.x1 + "," + d.upy1 + "C" + cx1 + "," + cy1 + " " + cx2 + "," + cy2 + " " + d.x2 + "," + d.upy2 +
                    "L" + d.x2 + "," + d.downy2 + 
                    "C" + cx3 + "," + cy3 + " " + cx4 + "," + cy4 + " " + d.x1 + "," + d.downy1 +
                    "L" + d.x1 + "," + d.upy1 + " " + "Z"  

                }
                
                link_list.forEach((d, i) => {
                    if(i < 4){
                        var column = 0
                        d.x1 = 20 + column * 80 + rectWidth
                        d.upy1 = d.source.y
                        d.downy1 = d.source.h + d.source.y
                        d.w1 = rectWidth

                        d.x2 = 20 + column * 80 + rectWidth + 40
                        d.upy2 = d.target.y
                        d.downy2 = d.target.h + d.target.y
                        d.w2 = rectWidth
                        d.waveNumber = d.target.waveNumber
                    }
                    else if(i < 8){
                        var column = 1  
                        d.x1 = 20 + column * 80 + rectWidth
                        d.upy1 = d.source.y
                        d.downy1 = d.source.h + d.source.y
                        d.w1 = rectWidth

                        d.x2 = 20 + column * 80 + rectWidth + 40
                        d.upy2 = d.target.y
                        d.downy2 = d.target.h + d.target.y
                        d.w2 = rectWidth
                        d.waveNumber = d.target.waveNumber
                    } else {
                        var column = 2
                        d.x1 = 20 + column * 80 + rectWidth
                        d.upy1 = d.source.y
                        d.downy1 = d.source.h + d.source.y
                        d.w1 = rectWidth

                        d.x2 = 20 + column * 80 + rectWidth + 40
                        d.upy2 = d.target.y
                        d.downy2 = d.target.h + d.target.y
                        d.w2 = rectWidth
                        d.waveNumber = d.target.waveNumber
                    }
                });
                
                var link_objs = svg.append('g')
                        .attr("class", "links")
                        .selectAll('g')
                        .data(link_list)
                        .join("path")
                        .attr("class", d => "link " +  d.source.waveNumber)
                        .attr("d", d => {
                            return link_path(d)
                        })
                        .attr("visibility", "visible")
                        .attr("fill", (d, i) =>{ 
                            if(d.waveNumber == "W1")
                                return colors[0]
                            if(d.waveNumber == "W2")
                                return colors[1]
                            if(d.waveNumber == "W3")
                                return colors[2]
                            if(d.waveNumber == "W4")
                                return colors[3]
                        })
                        .style("fill-opacity", 0.05)
                        .style("stroke", (d, i) =>{ 
                            if(d.waveNumber == "W1")
                                return colors[0]
                            if(d.waveNumber == "W2")
                                return colors[1]
                            if(d.waveNumber == "W3")
                                return colors[2]
                            if(d.waveNumber == "W4")
                                return colors[3]
                        })
                        // .style("stroke-width", 1);
            }  

            d3.selectAll(".wavenumber_sel").on("click", function(d) {
                var element = d3.select(this)
                selectLegend(element)
            })

            function selectLegend(element){
                console.log("element", element)
                let waveNumber = element.attr("waveNumber") //获取点击的矩形的waveNumber
                let node_sel = d3.selectAll(".node." + waveNumber) 
                let link_sel = d3.selectAll(".link." + waveNumber)
                // console.log("click ", waveNumber)
                console.log("node_sel", node_sel)
                console.log("link_sel", link_sel)

                d3.selectAll(".wavenumber_sel").style("fill-opacity", 0.1) 
                d3.selectAll(".node").style("fill-opacity", 0.1) 
                d3.selectAll(".link").style("visibility", "hidden")
                
                element.style("fill-opacity", 1) //选中的公司图例变亮
                node_sel.style("fill-opacity", 1)
                link_sel.style("visibility", "visible")
                link_sel.style("fill-opacity", 0.01)
            }

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
.tool-tip {
  background-color: #eeeeee;
  color: black;
  /* padding: 10px; */
  border-radius: 4px;
  position: absolute;
  display: none;
  width: 20px;
  height: auto;
  /* padding: 14px 10px 4px 10px; */
  text-align: center;
  opacity: 0.1;
}
</style>
