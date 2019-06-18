export default class ProductService {


    static myInstance = null;

    static getInstance() {
        if (this.myInstance == null) {
            this.myInstance =
                new ProductService();
        }
        return this.myInstance;
    }

    static getUrl() {
        let pathSplit = window.location.href.split("/");
        let host = pathSplit[2];
        if (host === "localhost:3000") {
            return "http://localhost:8080/api/products"
        } else {
            return "https://wbdv-server-as4.herokuapp.com/api/products"
        }
    }


    createProduct = (product) => {
        fetch(ProductService.getUrl(), {
            method: 'PUT',
            body: JSON.stringify(product),
            headers: {
                'content-type': 'application/json'
            }

        }).then(response => response.json)
    }

    updateProduct = (id, product) => {
        fetch(`${ProductService.getUrl()}/${id}`, {
            method: 'PUT',
            body: JSON.stringify(product),
            headers: {
                'content-type': 'application/json'
            }
        }).then(response => response.json())
    }



}
