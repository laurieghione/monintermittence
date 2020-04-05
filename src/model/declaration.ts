export default class Declaration{
    id: string
    annexe: string
    dateStart: Date | null
    dateEnd: Date | null
    employer: string
    rate: number
    label?: string
    nbhours: number
    netSalary: number
    grossSalary: number
    workContract?: string
    payCheck?: string
    aem?: string
    vacationPay?: string
    guso?: string
    folder: string

    constructor(){
        this.id = ''
        this.annexe = ''
        this.folder = ''
        this.dateStart = null
        this.dateEnd = null
        this.employer = ''
        this.nbhours = 0
        this.rate = 0
        this.netSalary = 0 
        this.grossSalary = 0
    }

}