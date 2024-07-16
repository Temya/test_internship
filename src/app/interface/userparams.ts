import { Userdata } from "./userdata";
export interface Userparams {
    limit: number,
    skip: number,
    total: number,
    users: Userdata[]
}
