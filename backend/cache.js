class Cache{
    cache=null;
    constructor(){
        this.cache = {}
    }

    get = (id) => {
        if(this.cache[id]) return this.cache[id];
        return null
    }

    new = (id, subId) => {
        if(this.cache[id]){
            this.cache[id].subscriptions.push(subId);
        }else{
            this.cache[id] = {
                clients: [],
                subscriptions: [subId]
            }
        }
    }

    addClient = (id, uuid, item) =>{
        item.uuid = uuid
        if(this.cache[id]){
            this.cache[id].clients.push(item);
        }else{
            throw new Error('invalid ID');
        }
    }

    closeClient = (id, uuid) => {
        if(this.cache[id]){
            const clients = this.cache[id].clients
            const res = clients.find(i => i.uuid === uuid);
            if(res){
                const index = this.cache[id].clients.indexOf(res);
                this.cache[id].clients.splice(index,1);
            }
        }else{
            throw new Error('invalid ID');
        }
    }

    clientCount = (id) => {
        if(this.cache[id]){
            return this.cache[id].clients.length;
        }else{
            throw new Error('invalid ID');
        }    
    }
}

module.exports = Cache;