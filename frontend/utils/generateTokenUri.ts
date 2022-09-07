type urlsType = {
  regular: string
}

type userType = {
  username: string
}

// This data comes from the Unsplash API
// https://unsplash.com/developers
type dataType = {
  description: string
  urls: urlsType
  user: userType
  views: number
  width: number
  height: number
  downloads: number
}

export const generateTokenUri = (data: dataType) => {
  const tokenUri = {
    description: data.description,
    image: data.urls.regular,
    name: data.user.username,
    attributes: [
      {
        trait_type: 'Views',
        value: data.views,
      },
      {
        trait_type: 'Width',
        value: data.width,
      },
      {
        trait_type: 'Height',
        value: data.height,
      },
      {
        trait_type: 'Downloads',
        value: data.downloads,
      },
    ],
  }

  return JSON.stringify(tokenUri)
}
