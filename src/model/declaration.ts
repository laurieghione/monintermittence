import { ObjectID } from "mongodb";

export default class Declaration {
  _id: ObjectID;
  annexe: string;
  dateStart: Date | null;
  dateEnd: Date | null;
  employer: string;
  rate: number;
  label?: string;
  nbhours: number;
  netSalary: number;
  grossSalary: number;
  workContract?: string;
  payCheck?: string;
  aem?: string;
  vacationPay?: string;
  guso?: string;
  folder: string;
  files: any[];

  constructor() {
    this._id = new ObjectID();
    this.annexe = "";
    this.folder = "";
    this.label = "";
    this.dateStart = null;
    this.dateEnd = null;
    this.employer = "";
    this.nbhours = 0;
    this.rate = 0;
    this.netSalary = 0;
    this.grossSalary = 0;
    this.files = [];
  }
}
