var fetchHost = "http://localhost:8080";

if (window.location.href.includes("heroku")) {
  fetchHost = "https://guarded-tundra-80923.herokuapp.com";
}

export default class ProductService {


    static myInstance = null;

    static getInstance() {
        if (this.myInstance == null) {
            this.myInstance =
                new ProductService();
        }
        return this.myInstance;
    }

    // Sends a biz object with all requisite fields to create a new one
    createProductForBiz = (product, bizId) =>
      fetch(`${fetchHost}/api/businesses/${bizId}/products`, {
        method: 'POST',
        body: JSON.stringify(product),
        headers: {
          'content-type': 'application/json'
        }
      }).then(response => response.json());

    getProductsForBiz = (bizId) =>
      fetch(`${fetchHost}/api/businesses/${bizId}/products/`)
        .then(response => response.json());

    deleteProduct = (bizId, productId) =>
      fetch(`${fetchHost}/api/businesses/${bizId}/products/${productId}`, {
        method: 'DELETE'
      }).then(response => response.json());

}
