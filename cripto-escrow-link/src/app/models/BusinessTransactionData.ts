export class BusinessTransactionData {
    user_id!: string;
    initiator_id!: string;
    initiator_role!: string;
    name!: string;
    items!: BusinessTransactionItem[];
    price: any;
    description!: string;
    delivery_phone!: string;
    currency!: string;
    payment_id!: string;
    callback_url!: string;
    cancel_url?: string;
    order_id?:string;
}

export class BusinessTransactionItem {
  name!: string;
  item_id!: string;
  item_qty!: string;
  price!: string;
  description!: string;
}
