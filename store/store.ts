import create from "zustand";
import { toast } from "react-hot-toast";
import { persist } from "zustand/middleware";

type ZustandSet = (
  partial: State | Partial<State> | ((state: State) => State | Partial<State>),
  replace?: boolean | undefined
) => void;

export type CartItem = {
  _id: string;
  price: number;
  quantity: number;
  name: string;
  image: {
    asset: {
      _ref: string;
    };
  }[];
};
type State = Readonly<{
  showCart: boolean;
  setShowCart: (showCart: boolean) => void;
  cartItems: Array<CartItem>;
  setCartItems: (newCartItems: Array<CartItem>) => void;
  totalPrice: number;
  setTotalPrice: (newTotalPrice: number) => void;
  totalQuantities: number;
  onAdd: (newProduct: CartItem, quantity: number) => () => void;
  incCartItemQty: (cartItemId: string) => () => void;
  decCartItemQty: (cartItemId: string, quantity: number) => () => void;
  handleRemoveItem: (cartItemId: string) => () => void;
}>;

const productInCart = (cartItems: State["cartItems"], newProduct: CartItem) => {
  const checkProductInCart = cartItems.find(
    (cartItems) => cartItems._id === newProduct._id
  );
  return checkProductInCart;
};

const onAdd = (set: ZustandSet) => {
  return (newProduct: CartItem, quantity: number) => {
    return () => {
      if (quantity >= 1) {
        set((state) => {
          const existingProduct = productInCart(state.cartItems, newProduct);
          if (existingProduct) {
            const newCartItemsContainer: State["cartItems"] = [
              ...state.cartItems,
            ];
            for (let i = 0; i < newCartItemsContainer.length; i++) {
              if (newCartItemsContainer[i]._id === newProduct._id) {
                newCartItemsContainer[i].quantity += quantity;
                break;
              }
            }
            return {
              cartItems: newCartItemsContainer,
              totalQuantities: state.totalQuantities + quantity,
              totalPrice: state.totalPrice + newProduct.price * quantity,
            };
          }
          return {
            totalQuantities: state.totalQuantities + quantity,
            totalPrice: state.totalPrice + newProduct.price * quantity,
            cartItems: [...state.cartItems, { ...newProduct, quantity }],
          };
        });
        toast.success(`${quantity} ${newProduct.name} added to cart`);
      }
    };
  };
};

const incCartItemQty = (set: ZustandSet) => {
  return (cartItemId: string) => {
    return () => {
      set((state) => {
        let newCartItemsContainer;
        let newTotalPrice;
        let newTotalQuantities;
        for (let i = 0; i < state.cartItems.length; i++) {
          if (state.cartItems[i]._id === cartItemId) {
            const cartItem = state.cartItems[i];
            newCartItemsContainer = [...state.cartItems];
            newTotalPrice = state.totalPrice + cartItem.price;
            newTotalQuantities = state.totalQuantities + 1;
            newCartItemsContainer[i].quantity = cartItem.quantity + 1;
            break;
          }
        }
        return {
          cartItems: newCartItemsContainer || state.cartItems,
          totalQuantities: newTotalQuantities || state.totalQuantities,
          totalPrice: newTotalPrice || state.totalPrice,
        };
      });
    };
  };
};

const decCartItemQty = (set: ZustandSet) => {
  return (cartItemId: string, quantity: number) => {
    return () => {
      set((state) => {
        if (quantity > 1) {
          let newCartItemsContainer;
          let newTotalPrice;
          let newTotalQuantities;
          for (let i = 0; i < state.cartItems.length; i++) {
            if (state.cartItems[i]._id === cartItemId) {
              const cartItem = state.cartItems[i];
              newCartItemsContainer = [...state.cartItems];
              newTotalPrice = state.totalPrice - cartItem.price;
              newTotalQuantities = state.totalQuantities - 1;
              newCartItemsContainer[i].quantity = cartItem.quantity - 1;
              break;
            }
          }
          return {
            cartItems: newCartItemsContainer || state.cartItems,
            totalQuantities: newTotalQuantities || state.totalQuantities,
            totalPrice: newTotalPrice || state.totalPrice,
          };
        }
        return state;
      });
    };
  };
};

const useStore = create<State>(
  // @ts-ignore
  persist(
    (set) => ({
      showCart: false,
      setShowCart: () => {
        console.log("changed cart state");
        set((state) => ({
          showCart: !state.showCart,
        }));
      },
      cartItems: [],
      setCartItems: (newCartItems) =>
        set({
          cartItems: newCartItems,
        }),
      totalPrice: 0,
      setTotalPrice: (newTotalPrice) => {
        set({
          totalPrice: newTotalPrice,
        });
      },
      totalQuantities: 0,
      resetTotalQuantities: () => {
        set({
          totalQuantities: 0,
        });
      },
      onAdd: onAdd(set),
      incCartItemQty: incCartItemQty(set),
      decCartItemQty: decCartItemQty(set),
      handleRemoveItem: (itemId: string) => {
        return () => {
          set((state) => {
            const cartItem = state.cartItems.find(
              (item) => item._id === itemId
            );
            return {
              totalQuantities:
                state.totalQuantities - (cartItem?.quantity ?? 0),
              totalPrice:
                state.totalPrice -
                (cartItem?.price ?? 0) * (cartItem?.quantity ?? 0),
              cartItems: state.cartItems.filter(
                (cartItem) => cartItem._id !== itemId
              ),
            };
          });
        };
      },
    }),
    {
      name: "cart-store",
      getStorage: () => localStorage,
    }
  )
);

export default useStore;
