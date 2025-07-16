import {Borne} from "./Borne.js"

export class BornePublique extends Borne{

    toHTML(){
        return "La borne " + this.id + "située en " + this.lat + ", " + this.lon
    }
}