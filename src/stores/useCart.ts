import { defineStore } from 'pinia';

interface item{
  image:string, name:string, price:number, quantity:number, total:number
}
export const useCartStore = defineStore('cart', {
  state: () => ({
    cartItems: [] as item[],
  }),

  getters: {
  },

  actions: {
    addToCart (cartItem: {image:string, name:string, price:number, quantity:number, total:number}) {
      this.cartItems.push(cartItem);
    },
    emptyCart () {
      this.cartItems = [];
    }
  }
});
