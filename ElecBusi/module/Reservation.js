import {BornePrivee} from "./BornePrivee.js"

const list = document.querySelector("#list")
const form = document.querySelector("#reservation")
const confirmer = document.querySelector("#confirmer")
const localStorageKey = "exam"
const raw = localStorage.getItem(localStorageKey)
let reservations = raw?JSON.parse(raw):[]
renderReservations()
window.currentBorne = null
setInterval(updateCountdown, 1000)

form.addEventListener("submit", (event) => {
    event.preventDefault()
    addReservation(currentBorne)
})

window.prepareReservartion = function(index) {
    const borne = currentBorne[index]
    currentBorne = borne

    document.querySelector("#reservation").classList.remove("hidden")
}

export function addReservation(){
    const id = window.currentBorne.fullId
    const typeBorne = window.currentBorne.borneInstance instanceof BornePrivee ? "Privée" : "Public"
    const date = form.querySelector("#date").value
    const heure = form.querySelector("#heure").value
    const duree = form.querySelector("#duree").value
    const newReservation = {id, typeBorne, date, heure, duree}
    console.log(newReservation)
    reservations.push(newReservation)
    saveReservations()

    document.querySelector("#reservation").classList.add("hidden")
}

export function deleteReservation(id){
    reservations = reservations.filter((reservation)=>reservation.id!==id)
    saveReservations()
}

function saveReservations(){
    localStorage.setItem(localStorageKey, JSON.stringify(reservations))
    renderReservations()
    updateCountdown()
}

export function renderReservations(){
    list.innerHTML=``
    for(let reservation of reservations){
        console.log(reservation)
        const row = document.createElement("li")
        row.innerHTML=`
            <p>${reservation.id}</p>
            <p>${reservation.typeBorne}</p>
            <p>${reservation.date}</p>
            <p>${reservation.heure}</p>
            <p>${reservation.duree}</p>
        `
        const btn = document.createElement("button")
        btn.textContent = `Delete`
        btn.addEventListener("click", (event) => deleteReservation(reservation.id))

        row.appendChild(btn)
        list.appendChild(row)
    }
}

const timerDiv = document.querySelector("#countdown")

function getNextReservation() {
    const now = new Date()

    const futures = reservations.map(r => {
        const [hour, minute] = r.heure.split(":").map(Number)
        const date = new Date (`${r.date}T${r.heure}`)
        return {...r, dateTime:date}
    }).filter(r => r.dateTime > now).sort((a, b) => a.dateTime - b.dateTime)

        return futures[0] || null
}

function updateCountdown() {
    const next = getNextReservation()

    if (!next) {
        timerDiv.textContent = "Aucune reservation a venir"
    return
    }

    const now = new Date()
    const diffMs = next.dateTime - now

    if (diffMs <= 0) {
        alert("Reservation Maintenant")
        return
    }

    const totalSeconds = Math.floor(diffMs / 1000)
    const hours = Math.floor(totalSeconds / 3600)
    const minute = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60

    timerDiv.textContent = `Prochaine reservation dans ${hours}:${minute}:${seconds}`
}