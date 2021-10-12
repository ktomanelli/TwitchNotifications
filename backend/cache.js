class Cache{
    cache=null;
    constructor(){
        this.cache = {}
    }

    get = (id) => {
        if(this.cache[id]) return this.cache[id];
        return null
    }
    new = (id, uuid, item) =>{
        if(this.cache[id]){
            this.cache[id].push(item);
        }else{
            item.uuid = uuid
            this.cache[id] = [item];
        }
    }
}

module.exports = Cache;