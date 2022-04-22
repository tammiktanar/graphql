import { getDateFormat, getXPFormatStr } from "./format.js";
import { manageOnClick } from "./onClick.js";

export function setGraphs(data){
    setGraph(data, 'piscine-go', "go-graph")
    setGraph(data, 'div-01', "div-graph")
    setGraph(data, 'piscine-js', "js-graph")



    document.getElementById('nav-piscine-go-stats-tab').onclick = function() {setTimeout(setGraph, 500, data, 'piscine-go', 'go-graph');}
    document.getElementById('nav-div-stats-tab').onclick = function() {setTimeout(setGraph, 500, data, 'div-01', 'div-graph');}
    document.getElementById('nav-piscine-js-stats-tab').onclick = function() {setTimeout(setGraph, 500, data, 'piscine-js', 'js-graph');}
}

export function setGraph(dataArray, graphType, where){
    let setData = []

    if (!where || !dataArray || !graphType) return
    
    dataArray.forEach(data => {
        if (data.from == graphType){
            setData.push({x: new Date(data.createdAt), y: data.totalXP})
        }
    });

    var chart = new Chartist.Line("#"+where, {
        series: [
            {
                name: where,
                data: setData
            },
        ]
        },{
        axisX: {
          type: Chartist.FixedScaleAxis,
          divisor: 5,
          labelInterpolationFnc: function(value) {
            return getDateFormat(value);
          }
        },

        axisY: {
            type: Chartist.FixedScaleAxis,
            divisor: 5,
            labelInterpolationFnc: function(value) {
              return getXPFormatStr(value);
            },
            labelOffset: {
                x: 9,
                y: 0
            },
        },

        height: '300px',

        lineSmooth: Chartist.Interpolation.cardinal({
            tension: 0.2
        }),

    });
}

