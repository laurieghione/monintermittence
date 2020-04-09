export default class Folder{
    _id: string
    name: string | null
    dateStart: Date | null
    dateEnd: Date | null
    active: boolean
    user: string | null
  
    constructor(){
        this._id = ''
        this.name = ''
        this.dateStart = null
        this.dateEnd = null
        this.active = true
        this.user = ''
    }

}