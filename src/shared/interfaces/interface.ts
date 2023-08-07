export interface IProductLists {
  id: number;
  attributes: IAttributes;
}
export interface IAttributes {
  price: string;
  categoryid: string;
  name: string;
  description: string;
  brandName: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  discountedPrice: string;
  isDiscount: boolean;
  discountPercent: string;
  title: string;
  imageurl: {
    data: {
      id: number;
      attributes: {
        name: string;
        url: string;
      };
    };
  };
}

export interface ICategory {
  id: number;
  attributes: {
    categorytype: string;
  };
}

export interface ILoginModalProps {
  open: boolean;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface IUser {
  id: number;
  username: string;
  email: string;
  cart: Cart[];
  discountPrice: number;
  cartActualPrice: number;
  cartTotalPrice: number;
}

export interface Cart {
  quantity: number;
  id: number;
  attributes: IAttributes;
}

export interface IOrder {
  id: number
  attributes: {
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    products: Product[];
    stripeId: string;
    paymentSucessful: any;
  }
}

export interface Product {
  id: number;
  attributes: IAttributes;
  quantity: number;
}
