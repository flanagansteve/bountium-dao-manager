let fetchHost = "http://localhost:8080";

if (window.location.href.includes("heroku")) {
  fetchHost = "https://bountium-user-server.herokuapp.com";
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

    // ======================================================================

    // Sends a biz object with all requisite fields to create a new one
    createProductForBiz = (product, bizId) =>
      fetch(`${fetchHost}/api/businesses/${bizId}/products`, {
        method: 'POST',
        body: JSON.stringify(product),
        headers: {
          'content-type': 'application/json'
        }
      }).then(response => response.json());

    // --------------------------------------------------------------------

    // Gets the Products of a specific business of the given id
    getProductsForBiz = (bizId) =>
      fetch(`${fetchHost}/api/businesses/${bizId}/products/`)
        .then(response => response.json());

    // --------------------------------------------------------------------

    // Deletes a given product of a certain business using the index of the product from the biz's array
    deleteProduct = (bizId, productIndex) =>
      fetch(`${fetchHost}/api/businesses/${bizId}/products/${productIndex}`, {
        method: 'DELETE'
      }).then(response => response.json());

    // ---------------------------------------------------------------------

    // Updates the information of a given product of a business.
    updateProduct = (bizId, productIndex, newProduct) =>
      fetch(`${fetchHost}/api/businesses/${bizId}/products/${productIndex}`, {
        method: 'PUT',
        body: JSON.stringify(newProduct),
        headers: {
          'content-type': 'application/json'
        }
      }).then(response => response.json());

}
