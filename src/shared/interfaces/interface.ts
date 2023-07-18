export interface IProductLists {
    id: number
    attributes: {
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
  }

  export interface ICategory {
    id: number
    attributes: {
        categorytype: string
      }
  }
  
