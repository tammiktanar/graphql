import { getDateFormat, getXPFormatStr } from "./format.js"
import { fetchDataWithQuery } from "./query.js"


async function getDataFromTransactions(id = 3886, offset = 0, audits = [], dataRequest = 'up'){
    let query = `{
        transaction(
          where: {
              userId: {_eq: ${id}},
              type: {_eq: "${dataRequest}"},
          },
          offset: ${offset},
          limit: 10
        ){
          amount
          type
          userId
          createdAt
        }
    }`
    
    let returned_audits = (await fetchDataWithQuery(query)).data.transaction

    if (returned_audits.length > 0) {
        audits = audits.concat(returned_audits)
        return (await getDataFromTransactions(id, offset+10, audits, dataRequest))
    }

    return audits
}

export async function setAudit(id){
    let upData = await getDataFromTransactions(id, 0, [], 'up')
    let downData = await getDataFromTransactions(id, 0, [], 'down')

    makeAuditGraph(upData, downData)

    document.getElementById('nav-audit-ratio-tab').onclick = function() {setTimeout(makeAuditGraph, 500, upData, downData);}
}

function makeAuditGraph(upData, downData){
    let auditData = upData.concat(downData)

    auditData.sort(function(a,b){
        return new Date(a.createdAt) - new Date(b.createdAt);
    });

    setAuditProgressBar(upData, downData)
    setAuditGraph(auditData)
}

function setAuditProgressBar(upData, downData){
    let up = upData.reduce((acc, transaction) => acc + transaction["amount"], 0)
    let down = downData.reduce((acc, transaction) => acc + transaction["amount"], 0)





    let downBar = document.getElementById('audit-down-rate')
    downBar.style.width = ((down/up)*100).toFixed(2) + "%"
    downBar.innerText = getXPFormatStr(down)

    let upBar = document.getElementById('audit-up-rate')
    upBar.style.width = ((up/down)*100).toFixed(2) + "%"
    upBar.innerText = getXPFormatStr(up)

    let auditRatioNr = document.getElementById('audit-ratio')
    auditRatioNr.innerText = "Audits ratio: " + (up/down).toFixed(2)
}

function setAuditGraph(dataArray){
    let setData = []

    let up = 0
    let down = 0
    dataArray.forEach(data => {
        if (data.type == "down"){
            down += data.amount
        } else {
            up += data.amount
        }

        let tempNr = up / down

        if (tempNr < 0) tempNr = 0

        setData.push({
            x: new Date(data.createdAt),
            y: tempNr
        })
    });

    var chart = new Chartist.Line("#audit-graph", {
        series: [
            {
                name: "Audit ratio graph",
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

        series: {
            'Audit ratio graph': {
              lineSmooth: Chartist.Interpolation.step()
            }
        },

        axisY: {
            type: Chartist.FixedScaleAxis,
            divisor: 5,
            labelInterpolationFnc: function(value) {
              return (value);
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