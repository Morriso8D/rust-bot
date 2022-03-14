import itemList from '@/item-list.json'
import { itemList as ItemListInterface } from '@/types/interfaces'


class ItemList{

    private static instance : ItemList
    private all : ItemListInterface.json[]

    static singleton() : ItemList{
        
        if(!ItemList.instance){
            ItemList.instance = new ItemList()
        }

        return ItemList.instance
    }

    constructor(){
        this.all = itemList as ItemListInterface.json[]
    }


    getSize() : number {
        return this.all.length
    }

    findShortName(shortName: string) : ItemListInterface.json | undefined {
        return this.all.find(item => item['Short Name'] === shortName.toLowerCase())
    }

    filterShortName(shortName: string) : ItemListInterface.json[] {
        return this.all.filter(item => item['Short Name'].includes(shortName.toLowerCase()))
    }

    hasShortName(name: string) : boolean {
        const validName = this.findShortName(name)
        if(!validName) return false
        return true
    }

}

export default ItemList