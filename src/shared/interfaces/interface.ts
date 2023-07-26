export interface IProductLists {
    id: number
    attributes: IAttributes     
}
  export interface IAttributes {
    price: string
    categoryid: string
    name: string
    description: string
    brandName: string
    createdAt: string
    updatedAt: string
    publishedAt: string
    discountedPrice: string
    isDiscount: boolean
    discountPercent: string
    title: string
    imageurl: {
        data: {
            id: number
            attributes: {
                name: string
                url: string
              }
          }
      }
  }
  

  export interface ICategory {
    id: number
    attributes: {
        categorytype: string
      }
  }

  export interface ILoginModalProps{
    open: boolean,
    setModalOpen:React.Dispatch<React.SetStateAction<boolean>>
  }
  
