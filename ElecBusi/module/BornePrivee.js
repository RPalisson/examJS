import {BornePublique} from "./BornePublique.js"

const noms = ["Carl", "John", "Lorie", "Patricia", "Hubert", "Leon", "Catherine", "Jeanne"]

export class BornePrivee extends BornePublique{
    constructor(id, lat, lon){
        super(id, lat, lon)
        this.proprietaire = noms[Math.floor(Math.random()*noms.length)]
    }

    toHTML(){
        return super.toHTML() + "appartient à " + this.proprietaire
    }
}