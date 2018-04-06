import { OrderItem } from "./order-item.model";
import { User } from "./user.model";

export enum OrderStatus {
    Pending = 0,
    Accepted = 1,
    InProgress = 2,
    Implemented = 3,
    Canceled = 4
}

export const OrderStatusAlias: string[] = [
    "В очереди",
    "Принят",
    "В работе",
    "Выполнен",
    "Отменен"
];

export class Order {
    id: string;
    createdDate: Date;
    status: OrderStatus;
    items: OrderItem[];
    totalCost?: number
    user?: User
}

export const OrderStatusTransitions: OrderStatus[][] = [
    [ OrderStatus.Accepted, OrderStatus.Canceled ],
    [ OrderStatus.InProgress, OrderStatus.Canceled ],
    [ OrderStatus.Implemented, OrderStatus.Canceled ],
    [],
    [ OrderStatus.Accepted ]
];