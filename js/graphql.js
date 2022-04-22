import { loadProjects } from "./functions/data_managment.js";
import { setGraphs } from "./functions/graph.js";
import { fetchDataWithQuery } from "./functions/query.js";
import { setAudit } from "./functions/set_audit.js";
import { setProjects, tableSetLoading } from "./functions/set_projects.js";
import { setXP } from "./functions/set_xp.js";
import { createUserSearch } from "./functions/user_search.js";

document.onreadystatechange = function () {
    var state = document.readyState;
    if (state == 'complete') {
        createUserSearch()
        loadProfile() 
    }
};








    
    

let handledData = []

export async function loadProfile(id = 3886){
    setLoadingProfile();

    setAudit(id)

    addProfilePicFromID(id)


    handledData = []

    handledData = await loadProjects(id)


    setProjects(handledData)

    setGraphs(handledData)

    setXP(handledData)



}


async function addProfilePicFromID(id = 3886){
    let img = document.getElementById('profile-pic')
    let nameField = document.getElementById('profile-name')
    let idField = document.getElementById('profile-id')

    let getUsernameQuery = `{
        user (where: { id: { _eq: ${id} }}) {
            id
            username: login
          }
    }`

    let data = (await fetchDataWithQuery(getUsernameQuery)).data

    console.log()
    img.src = `https://git.01.kood.tech/user/avatar/${data.user[0].username}/-1`
    nameField.innerText = data.user[0].username
    idField.innerText = "ID: " + data.user[0].id
}

function setLoadingProfile(){
    let tables = [
        'latests-projects',
        'all-projects',
        'piscine-js-projects',
        'div-01-projects',
        'piscine-go-projects',
    ]

    tables.forEach(tableName => {
        let table = document.getElementById(tableName)
        tableSetLoading(table)
    });

    let profilePic = document.getElementById('profile-pic')
    profilePic.src="https://www.kaindl.com/fileadmin/_processed_/d/8/csm_2162_PE_Dekorbild_0ec3e17e00.jpg"


    document.getElementById('go-graph').innerHTML = `<div id="go-graph" class="ms-3 me-3 overflow-visible"><label class="text-dark">Go Piscine, xp over time</label></div>`
    document.getElementById('div-graph').innerHTML = `<div id="div-graph" class="ms-3 me-3 overflow-visible"><label class="text-dark">div 01, xp over time</label></div>`
    document.getElementById('js-graph').innerHTML = `<div id="js-graph" class="ms-3 me-3 overflow-visible"><label class="text-dark">JS Piscine, xp over time</label></div>`
    document.getElementById('audit-graph').innerHTML = `<div id="audit-graph" class="ms-3 me-3 overflow-visible"><label class="text-dark">Audit ratio over time</label></div>`


    let progressBars = [
        'audit-down-rate',
        'audit-up-rate',
        'go-xp',
        'div-xp',
        'js-xp'
    ]

    progressBars.forEach(progressBar => {
        let bar = document.getElementById(progressBar)
        bar.style.width = "0%"
        bar.innerText = ""
    })

    let numbersDivs = [
        'audit-ratio',
        'go-lvl',
        'div-lvl',
        'js-lvl'
    ]

    numbersDivs.forEach(numberDiv => {
        let numberDivElement = document.getElementById(numberDiv)
        numberDivElement.innerHTML = ""
    });


}




















// WEEEEE
