class Catalogue {
  constructor(title) {
    this.title = title;
    this.products = [];
  }

  findProductById(id) {
    const match = this.products.find((product) => id === product.id);
    return match;
  }

  addProduct(product) {
    if (!this.findProductById(product.id)) {
      this.products.push(product);
      return true;
    }
    return false;
  }

  removeProductById(id) {
    const removedProduct = this.findProductById(id);
    if (removedProduct) {
      this.products = this.products.filter(
        (product) => product.id !== id 
      );
    }
    return removedProduct;
  }

  checkReorders() {
    const result = { type: "Reorder", productIds: [] };
    result.productIds = this.products
      .filter((p) => p.quantityInStock <= p.reorderLevel)
      .map((p) => p.id);
    return result;
  }

  batchAddProducts(batch) {
    const productIDClash = batch.products.some(
      (product) => this.findProductById(product.id) !== undefined
    );
    if (productIDClash) {
      throw new Error("Bad Batch");
    }
    const noProductsAdded = batch.products
      .filter((product) => product.quantityInStock > 0 )
      .filter((p) => {
        this.addProduct(p);
        return true;
      })
      .reduce((acc, p) => acc + 1, 0);
    return noProductsAdded;
  }

  search(product) {
    if ('price' in product) {
      const price = parseFloat(product.price);
      if (isNaN(price)) {
        throw new Error('Invalid price value')
      }
      return this.products.filter(product => product.price <= price);
    } else if ('keyword' in product) {
      const keyword = product.keyword.toLowerCase();
      return this.products.filter(product => product.name.toLowerCase().includes(keyword));
    } else {
      throw new Error('Bad search');
    }
  }

}
module.exports = Catalogue;
