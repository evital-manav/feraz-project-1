import { appdb } from "../model/appdb";

class traindb extends appdb {
  constructor() {
    super();
  }
}
const train_obj = new traindb();
export default train_obj;
