import Declaration from "./declaration";

export default class Folder {
  id: string;
  name: string | null;
  dateStart: Date | null;
  dateEnd: Date | null;
  active: boolean;
  user: string | null;
  sjm: number;
  declarations: Declaration[];
  total: number;
  aj: number;
  are: number;

  constructor() {
    this.id = "";
    this.name = "";
    this.dateStart = null;
    this.dateEnd = null;
    this.active = false;
    this.user = "";
    this.total = 0;
    this.sjm = 0;
    this.aj = 0;
    this.are = 0;
    this.declarations = [];
  }
}
