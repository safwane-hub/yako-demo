import { create } from "zustand";
export type CartItem = { productId: string; title: string; price: number; qty: number; currency: 'MAD'|'EUR'|'USD' };
type State = { items: CartItem[]; method: 'NAPS'|'PAYPAL'|'CARD' };
type Actions = { add:(i:CartItem)=>void; remove:(id:string)=>void; setQty:(id:string,q:number)=>void; setMethod:(m:State['method'])=>void; clear:()=>void; };
export const useCart = create<State & Actions>((set, get) => ({ items: [], method:'NAPS', add:(i)=>{ const ex=get().items.find(x=>x.productId===i.productId); if (ex) set({ items:get().items.map(x=>x.productId===i.productId?{...x, qty:x.qty+i.qty}:x) }); else set({ items:[...get().items, i] }); }, remove:(id)=>set({ items:get().items.filter(x=>x.productId!==id)}), setQty:(id,q)=>set({ items:get().items.map(x=>x.productId===id?{...x, qty:q}:x)}), setMethod:(m)=>set({ method:m }), clear:()=>set({ items:[] }) }));
export function applyNapsFee(amount: number){ return +(amount * 1.012).toFixed(2); }
