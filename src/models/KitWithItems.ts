import { database } from "@/types/interfaces";


class KitWithItems implements database.groupedKitWithItems{
    items: database.mappedItem[];
    id: number;
    name: string;
    usage: number;
    description: string;
    created_at: string;
    updated_at: string;

    constructor(kit : database.kitWithItem){
        this.id = kit.id
        this.name = kit.name
        this.usage = kit.usage
        this.description = kit.description
        this.created_at = kit.created_at
        this.updated_at = kit.updated_at
        this.items = []
    }

    public addItem(item: database.mappedItem){
        this.items.push(item)
    }
}

export default KitWithItems