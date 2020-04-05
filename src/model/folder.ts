export default class Folder{
    id: string
    name: string | null
    dateStart: Date | null
    dateEnd: Date | null
    active: boolean
    user: string | null
  
    constructor(){
        this.id = ''
        this.name = ''
        this.dateStart = null
        this.dateEnd = null
        this.active = true
        this.user = ''
    }

}