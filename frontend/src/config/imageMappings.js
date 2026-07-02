import heroBanner from '../assets/images/hero/hero-banner.webp';
import potteryCat from '../assets/images/categories/pottery.webp';
import handloomCat from '../assets/images/categories/handloom.webp';
import jewelryCat from '../assets/images/categories/jewelry.webp';
import woodworkCat from '../assets/images/categories/woodwork.webp';
import paintingsCat from '../assets/images/categories/paintings.webp';
import metalcraftCat from '../assets/images/categories/metalcraft.webp';
import defaultProduct from '../assets/images/products/default.webp';

export const HERO_BANNER = heroBanner;

export const CATEGORY_IMAGES = {
  'Pottery': potteryCat,
  'Handloom': handloomCat,
  'Textiles': handloomCat,
  'Jewelry': jewelryCat,
  'Woodwork': woodworkCat,
  'Paintings': paintingsCat,
  'Metal Crafts': metalcraftCat,
  'Metal Craft': metalcraftCat,
  'Brass': metalcraftCat
};

export const getFallbackProductImage = (categoryName) => {
  if (!categoryName || typeof categoryName !== 'string') {
    return potteryCat;
  }
  
  const categoryLower = categoryName.toLowerCase();
  
  if (categoryLower.includes('potter') || categoryLower.includes('clay') || categoryLower.includes('ceramic')) {
    return potteryCat;
  }
  if (categoryLower.includes('handloom') || categoryLower.includes('textile') || categoryLower.includes('weave') || categoryLower.includes('fabric') || categoryLower.includes('silk') || categoryLower.includes('cloth') || categoryLower.includes('embroidery') || categoryLower.includes('saree')) {
    return handloomCat;
  }
  if (categoryLower.includes('jewel') || categoryLower.includes('silver') || categoryLower.includes('pearl') || categoryLower.includes('gold') || categoryLower.includes('stone') || categoryLower.includes('necklace')) {
    return jewelryCat;
  }
  if (categoryLower.includes('wood') || categoryLower.includes('cane') || categoryLower.includes('bamboo') || categoryLower.includes('toy') || categoryLower.includes('furniture')) {
    return woodworkCat;
  }
  if (categoryLower.includes('paint') || categoryLower.includes('art') || categoryLower.includes('pattachitra') || categoryLower.includes('warli') || categoryLower.includes('canvas')) {
    return paintingsCat;
  }
  if (categoryLower.includes('metal') || categoryLower.includes('brass') || categoryLower.includes('bronze') || categoryLower.includes('iron') || categoryLower.includes('copper') || categoryLower.includes('glass') || categoryLower.includes('marble') || categoryLower.includes('decor') || categoryLower.includes('craft')) {
    return metalcraftCat;
  }

  return potteryCat;
};

export const getProductImage = (imagePath, categoryName) => {
  if (!imagePath || 
      typeof imagePath !== 'string' || 
      imagePath.trim() === '' || 
      imagePath === 'null' || 
      imagePath === 'undefined' || 
      imagePath.includes('placeholder') || 
      imagePath.includes('via.placeholder') || 
      imagePath.startsWith('data:image/svg+xml') ||
      imagePath.includes('placeholder.png') ||
      imagePath.includes('placeholder.svg')) {
    return getFallbackProductImage(categoryName);
  }
  return imagePath;
};

export const DEFAULT_PRODUCT_IMAGE = defaultProduct;
