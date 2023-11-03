<script>
import * as d3 from 'd3';

export default {
  name: "MareyChart",
  data() {
    return {
      svg: '',
      originParams: {
        width: 400,
        height: 600,
        borderTop: 50,
        borderLeft: 50,
        axisInterval: 120,
        blockHeight: 10,
        color1: '#404040',
        color2: '#000000'
      },
      timeScale:'',
      exampleData:[
          '2023-01-01 07:01:00',
          '2023-01-01 11:01:00',
          '2023-01-01 13:01:00',
          '2023-01-01 15:01:00'
      ]
    }
  },
  mounted() {
    this.initSvg()
    this.initChart()
    this.initBlock()
  },
  methods: {
    initSvg() {
      d3.select('#MareyView')
          .selectAll('*')
          .remove()
      this.svg = d3.select('#MareyView')
          .append('svg')
          .attr('id', 'MareyChart')
          .attr('width', this.originParams.width)
          .attr('height', this.originParams.height)
    },
    initChart() {
      let that = this
      d3.select('#MareyChart')
          .selectAll('.marey-axis')
          .data(new Array(4))
          .enter()
          .append('line')
          .attr('class', 'marey-axis')
          .attr('x1', this.originParams.borderLeft)
          .attr('y1', function (d,i) {
            return i * that.originParams.axisInterval + that.originParams.borderTop
          })
          .attr('x2', this.originParams.width - this.originParams.borderLeft)
          .attr('y2', function (d,i) {
            return i * that.originParams.axisInterval + that.originParams.borderTop
          })
          .attr("stroke", this.originParams.color1)
      this.timeScale = d3.scaleUtc([new Date("2023-01-01"), new Date("2023-01-02")], [this.originParams.borderLeft, this.originParams.width - this.originParams.borderLeft])
    },
    initBlock() {
      let that=this
      let svg=d3.select('#MareyChart')
      let g=svg.append('svg')
          svg.selectAll('.marey-block')
          .data([[new Date("2023-01-01 07:01:00"), new Date("2023-01-01 15:01:00")]])
          .enter()
          .append('rect')
          .attr('x', function (d) {
            return that.timeScale(d[0])+that.originParams.borderLeft
          })
          .attr('y', this.originParams.borderTop-this.originParams.blockHeight/2)
          .attr('width', function (d) {
            return that.timeScale(d[1])-that.timeScale(d[0])
          })
          .attr('height', this.originParams.blockHeight)
          .attr('fill', "steelblue")
      const line=d3.line()
          .x(function (d) {
            return that.timeScale(new Date(d))+that.originParams.borderLeft
          })
          .y(function (d,i) {
            return i * that.originParams.axisInterval + that.originParams.borderTop
          })
          g.append('path')
          .datum([new Date("2023-01-01 15:01:00"), new Date("2023-01-01 17:01:00"), new Date("2023-01-01 20:01:00"), new Date("2023-01-01 23:50:00")])
          .attr("fill", "none")
          .attr("stroke", "steelblue")
          .attr("stroke-linejoin", "round")
          .attr("stroke-linecap", "round")
          .attr("stroke-width", 1.5)
          .attr("d", line);
    }
  }
}
</script>

<template>
  <div id="MareyView"></div>
</template>

<style scoped>
#MareyView {
  height: 100%;
}

</style>