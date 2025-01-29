import { ShoppingCartItems } from "./shopping-cart-items";

export interface ShoppingCart {
    items: { [key: string]: ShoppingCartItems }
}