import {Borne} from "./module/Borne.js"
import {BornePublique} from "./module/BornePublique.js"
import {BornePrivee} from "./module/BornePrivee.js"
import {addReservation, deleteReservation, renderReservations} from "./module/Reservation.js"

const mapDiv = document.querySelector("#map")
const rechercher = document.querySelector("#rechercher")
const vue = document.querySelector("#vue")
const listing = document.querySelector("#listing")
const result = window.confirm("Le site souhaite accéder à votre position ?")
const bornes = []
console.log(result)
let positMark = L.marker()
let coord = [45.75806298279684, 3.1270760116784317]

window.currentBorne = null
window.currentBornes = []

vue.addEventListener("click", function () {
const isMaphidden = mapDiv.classList.contains("hidden")
    mapDiv.classList.toggle("hidden", !isMaphidden)
    listing.classList.toggle("hidden", isMaphidden)
})


function borneMap(mapDiv){
    navigator.geolocation.getCurrentPosition((posit) => {
        coord = [posit.coords.latitude, posit.coords.longitude]
        console.log("test")
        console.log(`Latitude : ${coord.latitude}`)
        console.log(`Longitude: ${coord.longitude}`)
        console.log(`More or less ${coord.accuracy} meters.`)
        console.log(coord)
        let map = L.map(mapDiv).setView(coord, 13)

        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map)
        positMark = positMark.setLatLng(coord).addTo(map)
        getBornes(map, coord)
    })
}

function distanceAround (lat1, lon1, lat2, lon2){
    const radius = 6371
    const toRadius = deg => deg * (Math.PI / 180)

    const dLat =toRadius(lat2 - lat1)
    const dLon =toRadius(lon2 - lon1)

    const a = Math.sin(dLat / 2) ** 2 +
        Math.cos(toRadius(lat1)) * Math.cos(toRadius(lat2)) *
            Math.sin(dLon / 2) ** 2

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1- a))
    return radius * c
}

function listBorne(bornes){
    const container = document.querySelector("#listing")
        container.innerHTML = ""
        console.log(bornes)
        bornes.forEach((item, index) => {
            const itemElement = document.createElement("div");
            itemElement.classList.add("borne-item");
            itemElement.innerHTML = `
            <div class="jam">${item.fullId} </div>
            <button onclick="preparerReservation(${index})">Reserver</button>
            `
        container.appendChild(itemElement)
    })
}

window.preparerReservation = function(index) {
    window.currentBorne = window.currentBornes[index]
    document.querySelector("#reservation").classList.remove("hidden")
}

async function getBornes(map, userCoord){
    const response = await fetch("bornes.json")
    const data = await response.json()

    const bornes = data.features.map(borne => {
        const [lon, lat] = borne.geometry.coordinates
        const fullId = borne.id
        const numericId = parseInt(fullId.split("/")[1])
        const borneInstance =
        numericId % 2 === 0
            ? new BornePublique(fullId, "Publique", lat, lon)
            : new BornePrivee(fullId, "Privée", lat, lon)


    return { fullId, lat, lon, borneInstance }
    })

    const bornesAround = bornes.filter(b => {
        const distance = distanceAround(userCoord[0], userCoord[1], b.lat, b.lon)
        return distance <= 5
    })
        listBorne(bornesAround)

    window.currentBornes = bornesAround
    console.log(bornes)
    console.log("borne a moins de 5 km"+ bornesAround)

    bornesAround.forEach((borne, index) => {const marker = L.marker([borne.lat, borne.lon]).addTo(map)
        marker.bindPopup(`${borne.fullId}<br> ${borne.borneInstance.constructor.name}<br> <button onclick="preparerReservation(${index})">Réserver</button>`) })
}

borneMap(mapDiv)