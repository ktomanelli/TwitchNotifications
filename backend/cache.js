class Cache{
    cache=null;
    constructor(){
        this.cache = {}
    }

    get = (id) => {
        if(this.cache[id]) return this.cache[id];
        return null
    }
    new = (id, item) =>{
        this.cache[id] = item
    }
}

module.exports = Cache;