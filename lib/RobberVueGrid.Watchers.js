import Utils from './RobberVueGridUtils.js'

export default {
  '$route.query'() {
    if(this.route.query && this.route.query.filters) {
      try {
        this.filters = JSON.parse(Utils.atob_utf8(this.route.query.filters));
        //this.filterOperator = this.route.query.filter_operator;
        if(!this.config.filtering.local) {
          this.refreshNeeded = true;
        }
      }
      catch(e) {
        console.log("Invalid query filters, BASE64 parse or JSON decode failed...");
      }
    }
    else {
      this.filters = [];
      if(!this.config.filtering.local) {
        this.refreshNeeded = true;
      }
    }
  },
  '$route.hash'() {
    var hashParts = this.route.hash.split("-");
    const id = parseInt(hashParts[1]);
    this.mainRowClick(id)
  }
}