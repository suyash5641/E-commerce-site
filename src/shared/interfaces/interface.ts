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
                    // alternativeText: any
                    // caption: any
                    // width: number
                    // height: number
                    // formats:  {
                    //     thumbnail: {
                    //     name: string
                    //     hash: string
                    //     ext: string
                    //     mime: string
                    //     path: any
                    //     width: number
                    //     height: number
                    //     size: number
                    //     url: string
                    //   }
                    // }
                    // hash: string
                    // ext: string
                    // mime: string
                    // size: number
                    url: string
                    // previewUrl: any
                    // provider: string
                    // provider_metadata: any
                    // createdAt: string
                    // updatedAt: string
                  }
              }
          }
      }
  }