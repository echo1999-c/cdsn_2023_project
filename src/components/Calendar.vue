<template>
  <el-radio-group v-model="radio" @change="clickRadio">
    <el-radio :label="0">订单信息</el-radio>
    <el-radio :label="1">货品信息</el-radio>
  </el-radio-group>
  <div id="CalendarView">

  </div>
</template>

<script>
import _ from 'lodash'
import * as d3 from 'd3';

export default {
  name: "Calendar",
  data() {
    return {
      radio: 0,
      pickingHourInfo: require('../assets/pickingInfo_202301_202305.json')['RECORDS'],
      clickDates: [],
      originParams: {
        width: 300,
        height: 1200,
        beginX: 20,
        beginY: 20,
        labelWidth: 240,
        labelHeight1: 20,
        labelHeight2: 10,
        monthHeight: 190,
        monthWidth: 270,
        cellSize: 20,
        cellBorder: 10
      },
      originColors: {
        transparentColor: '#ffffff00',
        color1: 'red',
        color2: 'yellow',
        color3: 'green',
        color4: 'blue',
        color5:'purple',
        color6:'pink'
      },
      globalScales: {
        scale1: '',
        scale2: '',
        scale3: '',
        scale4: '',
        scale5: '',
        scale6: ''
      },
      propertiesList: [
        [['avgbatchNumCnt', 'avgorderNumCnt'], ['avggoodsTypeCnt', 'avggoodsQuantityCnt']],
        [['batchNumCnt', 'orderNumCnt'], ['goodsTypeCnt', 'goodsQuantityCnt']]
      ],
      mouthCnt: 6,
      calendarData: [],
      monthData: [],
      svg: '',
      selectedCubes:[]
    }
  },
  mounted() {
    this.clickDates = this.$store.getters.getClickDates
    this.preInitialization()
    this.initSvg()
    this.initCalendarLabel()
    this.initCalendar()
  },
  methods: {
    clickRadio() {
      this.initSvg()
      this.initCalendarLabel()
      this.initCalendar()
    },
    initSvg() {
      d3.select('#CalendarView')
          .selectAll('*')
          .remove()
      this.svg = d3.select('#CalendarView')
          .append('svg')
          .attr('id', 'CalendarId')
          .attr('width', this.originParams.width)
          .attr('height', this.originParams.height)
    },
    initCalendarLabel() {
      let that = this
      this.globalScales.scale1 = d3.scaleLinear([0, _.maxBy(this.monthData, this.propertiesList[0][this.radio][0])[this.propertiesList[0][0][0]]], [this.originColors.transparentColor, this.originColors.color1])
      this.globalScales.scale2 = d3.scaleLinear([0, _.maxBy(this.monthData, this.propertiesList[0][this.radio][1])[this.propertiesList[0][0][1]]], [this.originColors.transparentColor, this.originColors.color2])
      this.globalScales.scale5 = d3.scaleLinear([0, _.maxBy(this.monthData, this.propertiesList[0][this.radio][0])[this.propertiesList[0][1][0]]], [this.originColors.transparentColor, this.originColors.color5])
      this.globalScales.scale6 = d3.scaleLinear([0, _.maxBy(this.monthData, this.propertiesList[0][this.radio][1])[this.propertiesList[0][1][1]]], [this.originColors.transparentColor, this.originColors.color6])

      this.svg.selectAll('g.month-group').remove()

      let monthGroup = this.svg
          .selectAll('g.month-group')
          .data(this.monthData)
          .enter()
          .append('g')
          .attr('class', 'month-group')
          .attr('height', that.originParams.monthHeight)
          .attr('width', that.originParams.monthWidth)

      let monthText = monthGroup
          .append('text')
          .attr('class', 'month-label')
          .attr('text-anchor', 'middle')
          .attr('font-size', '16px')
          .text(function (d) {
            return d['monthNum'] + '月'
          })
          .attr('x', that.originParams.beginX + that.originParams.labelWidth / 2)
          .attr('y', function (d, i) {
            return (that.originParams.monthHeight + that.originParams.labelHeight1 + that.originParams.labelHeight2) * i + 16
          })

      let monthProperties1 = monthGroup
          .append('rect')
          .attr('class', 'month-properties')
          .attr('height', that.originParams.labelHeight2)
          .attr('width', that.originParams.labelWidth / 4)
          .attr('x', that.originParams.beginX)
          .attr('y', function (d, i) {
            return (that.originParams.monthHeight + that.originParams.labelHeight1 + that.originParams.labelHeight2) * i + that.originParams.labelHeight1
          })
          .attr('fill', function (d) {
            return that.globalScales.scale1(d[that.propertiesList[0][0][0]])
          })

      let monthProperties2 = monthGroup
          .append('rect')
          .attr('class', 'month-properties')
          .attr('height', that.originParams.labelHeight2)
          .attr('width', that.originParams.labelWidth / 4)
          .attr('x', that.originParams.beginX + that.originParams.labelWidth / 4)
          .attr('y', function (d, i) {
            return (that.originParams.monthHeight + that.originParams.labelHeight1 + that.originParams.labelHeight2) * i + that.originParams.labelHeight1
          })
          .attr('fill', function (d) {
            return that.globalScales.scale2(d[that.propertiesList[0][0][1]])
          })

      let monthProperties3 = monthGroup
          .append('rect')
          .attr('class', 'month-properties')
          .attr('height', that.originParams.labelHeight2)
          .attr('width', that.originParams.labelWidth / 4)
          .attr('x', that.originParams.beginX + that.originParams.labelWidth / 2)
          .attr('y', function (d, i) {
            return (that.originParams.monthHeight + that.originParams.labelHeight1 + that.originParams.labelHeight2) * i + that.originParams.labelHeight1
          })
          .attr('fill', function (d) {
            return that.globalScales.scale5(d[that.propertiesList[0][1][1]])
          })
      let monthProperties4 = monthGroup
          .append('rect')
          .attr('class', 'month-properties')
          .attr('height', that.originParams.labelHeight2)
          .attr('width', that.originParams.labelWidth / 4)
          .attr('x', that.originParams.beginX + that.originParams.labelWidth *0.75)
          .attr('y', function (d, i) {
            return (that.originParams.monthHeight + that.originParams.labelHeight1 + that.originParams.labelHeight2) * i + that.originParams.labelHeight1
          })
          .attr('fill', function (d) {
            return that.globalScales.scale6(d[that.propertiesList[0][1][1]])
          })
    },
    initCalendar() {
      let that = this
      this.globalScales.scale3 = d3.scaleLinear([0, _.maxBy(this.pickingHourInfo, this.propertiesList[1][this.radio][0])[this.propertiesList[1][this.radio][0]]], [this.originColors.transparentColor, this.originColors.color3])
      this.globalScales.scale4 = d3.scaleLinear([0, _.maxBy(this.pickingHourInfo, this.propertiesList[1][this.radio][1])[this.propertiesList[1][this.radio][1]]], [this.originColors.transparentColor, this.originColors.color4])
      let monthBlock = this.svg
          .selectAll('g.month-block')
          .data(this.calendarData)
          .enter()

      let tooltip = d3.select('#CalendarView')
          .append("div")
          .attr("class", "tool-tip");

      monthBlock.append('polygon')
          .attr('class', 'property-1')
          .attr('points', function (d) {
            const y = d['y'] + that.originParams.cellBorder
            return (d['x'] + that.originParams.cellSize) + ' ' + y + ', ' + (d['x'] + that.originParams.cellSize) + ' ' + (y + that.originParams.cellSize) + ', ' + d['x'] + ' ' + (y + that.originParams.cellSize)
          })
          .attr('fill', function (d) {
            return that.globalScales.scale3(d['data'][that.propertiesList[1][that.radio][0]])
          })
          .on("mousemove", function (d, item) {
            tooltip
                .style("left", d.clientX + 10 + 'px')
                .style("top", d.layerY + 10 + 'px')
                .style("display", "inline-block")
                .html(
                    '<span class="custom-name-str">&nbsp;' + item.data['pickingTimeFormat'] + '&nbsp;</span>'
                    +
                    '<div class="custom-tooltip-line"><span class="custom-tooltip-title">batchNumCnt</span><span class="custom-tooltip-content">' + item.data['batchNumCnt'] + '</span></div>'
                    +
                    '<div class="custom-tooltip-line"><span class="custom-tooltip-title">goodsQuantityCnt</span><span class="custom-tooltip-content">' + item.data['goodsQuantityCnt'] + '</span></div>'
                    +
                    '<div class="custom-tooltip-line"><span class="custom-tooltip-title">goodsTypeCnt</span><span class="custom-tooltip-content">' + item.data['goodsTypeCnt'] + '</span></div>'
                    +
                    '<div class="custom-tooltip-line"><span class="custom-tooltip-title">orderNumCnt</span><span class="custom-tooltip-content">' + item.data['orderNumCnt'] + '</span></div>'
                );
          })
          .on("mouseout", function (d) {
            tooltip.style("display", "none");
          })
          .on('click', function (d, item) {
            const dates = that.$store.getters.getClickDates,
                curDate = item.data['pickingTimeFormat']
            if (_.indexOf(dates, curDate) === -1) {
              //当前state里没有选中的日期
              that.$store.commit("addClickDates", {
                date: curDate
              })
              that.selectedCubes.push(item)
              that.drawBlockBackground()
            } else {
              //当前state里有选中的日期
              that.$store.commit("reduceClickDates", {
                date: curDate
              })
              _.remove(that.selectedCubes, function (n) {
                return n.data['pickingTimeFormat']===item.data['pickingTimeFormat']
              })
              that.drawBlockBackground()
            }
          })

      monthBlock.append('polygon')
          .attr('class', 'property-1')
          .attr('points', function (d) {
            const y = d['y'] + that.originParams.cellBorder
            return d['x'] + ' ' + (y + that.originParams.cellSize) + ', ' + d['x'] + ' ' + y + ', ' + (d['x'] + that.originParams.cellSize) + ' ' + y
          })
          .attr('fill', function (d) {
            return that.globalScales.scale4(d['data'][that.propertiesList[1][that.radio][1]])
          })
          .on("mousemove", function (d, item) {
            tooltip
                .style("left", d.clientX + 10 + 'px')
                .style("top", d.layerY + 10 + 'px')
                .style("display", "inline-block")
                .html(
                    '<span class="custom-name-str">&nbsp;' + item.data['pickingTimeFormat'] + '&nbsp;</span>'
                    +
                    '<div class="custom-tooltip-line"><span class="custom-tooltip-title">batchNumCnt</span><span class="custom-tooltip-content">' + item.data['batchNumCnt'] + '</span></div>'
                    +
                    '<div class="custom-tooltip-line"><span class="custom-tooltip-title">goodsQuantityCnt</span><span class="custom-tooltip-content">' + item.data['goodsQuantityCnt'] + '</span></div>'
                    +
                    '<div class="custom-tooltip-line"><span class="custom-tooltip-title">goodsTypeCnt</span><span class="custom-tooltip-content">' + item.data['goodsTypeCnt'] + '</span></div>'
                    +
                    '<div class="custom-tooltip-line"><span class="custom-tooltip-title">orderNumCnt</span><span class="custom-tooltip-content">' + item.data['orderNumCnt'] + '</span></div>'
                );
          })
          .on("mouseout", function (d) {
            tooltip.style("display", "none");
          })
          .on('click', function (d, item) {
            const dates = that.$store.getters.getClickDates,
                curDate = item.data['pickingTimeFormat']
            if (_.indexOf(dates, curDate) === -1) {
              //当前state里没有选中的日期
              that.$store.commit("addClickDates", {
                date: curDate
              })
              that.selectedCubes.push(item)
              that.drawBlockBackground()
            } else {
              //当前state里有选中的日期
              that.$store.commit("reduceClickDates", {
                date: curDate
              })
              _.remove(that.selectedCubes, function (n) {
                return n.data['pickingTimeFormat']===item.data['pickingTimeFormat']
              })
              that.drawBlockBackground()
            }
          })
    },
    drawBlockBackground(){
      let that=this
      d3.select('#CalendarId')
          .selectAll('.selected-cube-background')
          .remove()
      d3.select('#CalendarId')
          .selectAll('.selected-cube-background')
          .data(this.selectedCubes)
          .enter()
          .append('rect')
          .attr('class', 'selected-cube-background')
          .attr('x', function(d){
            return d['x']-that.originParams.cellBorder/2
          })
          .attr('y', function(d){
            return d['y']+that.originParams.cellBorder/2
          })
          .attr('width', this.originParams.cellSize+this.originParams.cellBorder)
          .attr('height', this.originParams.cellSize+this.originParams.cellBorder)
          .attr('fill', 'indigo')
          .attr('z-index',2)
      d3.selectAll('.property-1').raise()
    },
    preInitialization() {
      let weekNumInMonth = 0
      for (const key in this.pickingHourInfo) {
        const item = this.pickingHourInfo[key], curDay = new Date(item['pickingTimeFormat'])
        if (curDay.getDate() === 1) {
          weekNumInMonth = 0
          this.monthData.push({
            monthNum: curDay.getMonth() + 1,
            avgbatchNumCnt: item['avgbatchNumCnt'],
            avgorderNumCnt: item['avgorderNumCnt'],
            avggoodsTypeCnt: item['avggoodsTypeCnt'],
            avggoodsQuantityCnt: item['avggoodsQuantityCnt']
          })
        }
        const curWeekNum = this.getYearWeekNum(curDay),
            curMonth = curDay.getMonth(),
            x = (curDay.getDay() === 0 ? 6 : curDay.getDay() - 1) * (this.originParams.cellSize + this.originParams.cellBorder) + this.originParams.beginX + (this.originParams.labelWidth - (this.originParams.cellSize * 7 + this.originParams.cellBorder * 6)) / 2,
            y = curMonth * this.originParams.monthHeight + (curMonth + 1) * (this.originParams.labelHeight1 + this.originParams.labelHeight2) + weekNumInMonth * (this.originParams.cellSize + this.originParams.cellBorder)
        if (curDay.getDay() === 0) {
          weekNumInMonth += 1
        }
        this.calendarData.push({
          x: x,
          y: y,
          data: item
        })
      }
    },
    getYearWeekNum(curDay) {
      function isLeapYear(year) {
        return (year % 400 == 0) || (year % 4 == 0 && year % 100 != 0)
      }

      function getMouthDays(year, mouth) {
        return [31, null, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][mouth] || (isLeapYear(year) ? 29 : 28)
      }

      let year = curDay.getFullYear(),
          month = curDay.getMonth(),
          days = curDay.getDate()

      for (let i = 0; i < month; i++) {
        days += getMouthDays(year, i)
      }

      let yearFirstDay = new Date(year, 0, 1).getDay() || 7
      let week = null

      if (yearFirstDay === 1) {
        week = Math.ceil(days / yearFirstDay)
      } else {
        days -= (7 - yearFirstDay + 1)
        week = Math.ceil(days / 7) + 1
      }
      return week
    }
  }
}

</script>

<style>
.selected-cube-background{
  z-index: 2;
}
.property-1{
  z-index: 3;
}

#CalendarView {
  height: 100vh;
}

.tool-tip {
  background-color: #eeeeee;
  color: black;
  padding: 10px;
  border-radius: 4px;
  position: absolute;
  display: none;
  width: 200px;
  height: auto;
  padding: 14px 10px 4px 10px;
  text-align: center;
}

.custom-name-str {
  font-size: 16px;
  font-weight: bolder;
  display: inline-block;
  text-align: center;
  margin-bottom: 4px;
}

.custom-tooltip-line {
  display: inline-block;
  width: 100%;
}

.custom-tooltip-title {
  font-weight: bold;
  float: left;
}

.custom-tooltip-content {
  float: right;
}

#CalendarView {
  overflow: auto;
}
</style>
