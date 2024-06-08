export class CustomerPolicy{
    static show(user,customer){
        return true
    }
    static index(user){
        return true
    }
    static store(user){
        return true
    }
    static update(user,customer){
        return true
    }
    static delete(user,customer){
        return true
    }
}